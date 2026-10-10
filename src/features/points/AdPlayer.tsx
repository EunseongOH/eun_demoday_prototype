import { AD_SECONDS } from './useAdCountdown'
import './points.css'

/** The striped placeholder where an ad would play. */
export function AdPlayer({
  playing,
  remaining,
}: {
  playing: boolean
  remaining: number
}) {
  const finished = playing && remaining <= 0

  return (
    <>
      <div
        className={[
          'ad-player',
          playing ? 'ad-player--playing' : '',
        ].filter(Boolean).join(' ')}
        aria-live="polite"
      >
        <span className="ad-player__badge">AD</span>
        <span>
          {!playing
            ? '광고 영역 (프로토타입)'
            : finished
              ? '광고가 끝났어요'
              : `광고 재생 중… ${remaining}초`}
        </span>
        <span
          className="ad-player__progress"
          style={{
            width: `${playing ? ((AD_SECONDS - remaining) / AD_SECONDS) * 100 : 0}%`,
          }}
        />
      </div>
      <p className="ad-player__note">
        프로토타입이라 실제 광고는 나오지 않아요.
      </p>
    </>
  )
}
