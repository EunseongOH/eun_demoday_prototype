import { useState, type ReactNode } from 'react'
import { BottomSheet, Button } from '@/design-system'
import { AdPlayer } from './AdPlayer'
import { useAdCountdown } from './useAdCountdown'
import { PointIcon } from './PointIcon'
import {
  AD_REWARD,
  CHECK_IN_REWARD,
  POINT_NAME,
  formatPoints,
} from './points'
import {
  selectAdsLeftToday,
  selectCheckedInToday,
  usePointsStore,
} from './pointsStore'
import './points.css'

export type PointCharge = {
  key: string
  label: string
  points: number
}

type PointPaySheetProps = {
  open: boolean
  title: string
  description?: string
  /** Shown above the bill, e.g. the stationery being bought. */
  preview?: ReactNode
  charges: PointCharge[]
  onClose: () => void
  /** Runs after the points are taken. */
  onPaid: () => void
}

/**
 * Pays for something with 찰떡. When the balance is short, the sheet lets
 * the person earn the gap right here: a rewarded ad, or today's stamp.
 */
export function PointPaySheet({
  open,
  title,
  description,
  preview,
  charges,
  onClose,
  onPaid,
}: PointPaySheetProps) {
  const balance = usePointsStore((state) => state.balance)
  const spend = usePointsStore((state) => state.spend)
  const rewardAd = usePointsStore((state) => state.rewardAd)
  const checkIn = usePointsStore((state) => state.checkIn)
  const adsLeft = usePointsStore((state) => selectAdsLeftToday(state))
  const checkedIn = usePointsStore((state) => selectCheckedInToday(state))
  const [watching, setWatching] = useState(false)
  const [earned, setEarned] = useState<string | null>(null)
  const ad = useAdCountdown(open)

  const total = charges.reduce((sum, charge) => sum + charge.points, 0)
  const short = Math.max(0, total - balance)

  const close = () => {
    setWatching(false)
    setEarned(null)
    onClose()
  }

  const pay = () => {
    if (!spend(total)) return
    setEarned(null)
    onPaid()
  }

  const collectAd = () => {
    const reward = rewardAd()
    ad.reset()
    setWatching(false)
    setEarned(reward > 0 ? `광고 보고 ${formatPoints(reward)}를 받았어요.` : null)
  }

  const stamp = () => {
    const result = checkIn()
    if (!result) return
    setEarned(
      `출석 도장으로 ${formatPoints(result.reward + result.bonus)}를 받았어요.`,
    )
  }

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title={title}
      description={description}
    >
      <div className="point-pay">
        {preview}

        {!watching && (
          <>
            <div className="point-pay__bill">
              {charges.map((charge) => (
                <div key={charge.key} className="point-pay__row">
                  <span>{charge.label}</span>
                  <strong>{formatPoints(charge.points)}</strong>
                </div>
              ))}
              <div className="point-pay__row point-pay__row--total">
                <span>합계</span>
                <strong>{formatPoints(total)}</strong>
              </div>
            </div>

            <div
              className={[
                'point-pay__balance',
                short > 0 ? 'point-pay__balance--short' : '',
              ].filter(Boolean).join(' ')}
            >
              <PointIcon />
              <span>
                가진 {POINT_NAME} <strong>{balance}개</strong>
              </span>
              <span className="point-pay__after">
                {short > 0
                  ? `${short}개 모자라요`
                  : `쓰고 나면 ${balance - total}개 남아요`}
              </span>
            </div>
          </>
        )}

        {earned && <p className="point-pay__earned">{earned}</p>}

        {watching && <AdPlayer playing={ad.playing} remaining={ad.remaining} />}

        {short === 0 ? (
          <Button variant="brand" fullWidth onClick={pay}>
            {formatPoints(total)} 쓰기
          </Button>
        ) : watching ? (
          ad.finished ? (
            <Button variant="brand" fullWidth onClick={collectAd}>
              {formatPoints(AD_REWARD)} 받기
            </Button>
          ) : (
            <Button variant="brand" fullWidth disabled>
              광고 보는 중…
            </Button>
          )
        ) : (
          <div className="point-pay__earn">
            <Button
              variant="brand"
              fullWidth
              disabled={adsLeft === 0}
              onClick={() => {
                setEarned(null)
                setWatching(true)
                ad.start()
              }}
            >
              {adsLeft > 0
                ? `광고 보고 ${formatPoints(AD_REWARD)} 받기 · 오늘 ${adsLeft}번 남음`
                : '오늘 광고는 다 봤어요'}
            </Button>
            {!checkedIn && (
              <Button variant="secondary" fullWidth onClick={stamp}>
                출석 도장 찍고 {formatPoints(CHECK_IN_REWARD)} 받기
              </Button>
            )}
            {adsLeft === 0 && checkedIn && (
              <p className="point-pay__hint">
                내일 출석 도장을 찍으면 {POINT_NAME}을 더 받을 수 있어요.
              </p>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
