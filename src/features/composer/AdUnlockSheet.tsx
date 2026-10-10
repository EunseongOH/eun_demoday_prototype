import { BottomSheet, Button } from '@/design-system'
import { AdPlayer } from '@/features/points/AdPlayer'
import { useAdCountdown } from '@/features/points/useAdCountdown'

export type AdUnlockItem = {
  id: string
  name: string
  source?: string
}

type AdUnlockSheetProps<T extends AdUnlockItem> = {
  item: T | null
  /** What is being unlocked, e.g. '응원'. */
  kindLabel?: string
  /** 'contain' previews a cut-out (clip, tape); 'cover' a full sheet. */
  previewFit?: 'cover' | 'contain'
  /** Replaces the default "keep using it" copy. */
  description?: string
  onClose: () => void
  onUnlocked: (item: T) => void
}

/**
 * Prototype rewarded-ad flow: a placeholder "ad" counts down, then the
 * item opens. No real ad network is called.
 */
export function AdUnlockSheet<T extends AdUnlockItem>({
  item,
  kindLabel = '편지지',
  previewFit = 'cover',
  description,
  onClose,
  onUnlocked,
}: AdUnlockSheetProps<T>) {
  const ad = useAdCountdown(item?.id)

  return (
    <BottomSheet
      open={Boolean(item)}
      onClose={onClose}
      title={`광고 보고 ${kindLabel} 열기`}
      description={
        description ??
        `광고 하나를 끝까지 보면 이 ${kindLabel}${hasBatchim(kindLabel) ? '을' : '를'} 계속 쓸 수 있어요.`
      }
    >
      {item && (
        <div className="ad-unlock">
          <div
            className={[
              'ad-unlock__preview',
              previewFit === 'contain' ? 'ad-unlock__preview--contain' : '',
            ].filter(Boolean).join(' ')}
          >
            {item.source && (
              <img src={item.source} alt="" draggable={false} />
            )}
            <span className="ad-unlock__name">{item.name}</span>
          </div>

          <AdPlayer playing={ad.playing} remaining={ad.remaining} />

          {ad.finished ? (
            <Button variant="brand" fullWidth onClick={() => onUnlocked(item)}>
              {kindLabel} 열기
            </Button>
          ) : (
            <Button
              variant="brand"
              fullWidth
              disabled={ad.playing}
              onClick={ad.start}
            >
              {ad.playing ? '광고 보는 중…' : '광고 보기'}
            </Button>
          )}
        </div>
      )}
    </BottomSheet>
  )
}

/** Whether the last Hangul syllable ends in a consonant (을/를 choice). */
function hasBatchim(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0
}
