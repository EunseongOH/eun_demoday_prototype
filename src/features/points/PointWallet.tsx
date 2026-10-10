import { useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet, Button, useFeedback } from '@/design-system'
import { AdPlayer } from './AdPlayer'
import { useAdCountdown } from './useAdCountdown'
import { PointGuide } from './PointGuide'
import { PointIcon } from './PointIcon'
import {
  AD_DAILY_LIMIT,
  AD_REWARD,
  CHECK_IN_REWARD,
  FIRST_CHEER_REWARD,
  POINT_NAME,
  STAMP_CARD_BONUS,
  STAMP_CARD_SIZE,
  formatPoints,
} from './points'
import {
  selectAdsLeftToday,
  selectCheckedInToday,
  selectFilledStamps,
  usePointsStore,
} from './pointsStore'
import { usePrototypeStore } from '@/store/prototypeStore'
import './points.css'

/**
 * The 찰떡 balance as a small chip. Tapping it opens the wallet, where the
 * daily stamp and rewarded ads live. A dot means today's stamp is waiting.
 * Supporters drop in now and then, so their wallet leaves the stamp card out.
 */
export function PointBalanceChip({
  showCheckIn = true,
}: {
  showCheckIn?: boolean
}) {
  const balance = usePointsStore((state) => state.balance)
  const checkedIn = usePointsStore((state) => selectCheckedInToday(state))
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="point-chip"
        aria-label={`가진 ${formatPoints(balance)}, ${POINT_NAME} 모으기`}
        onClick={() => setOpen(true)}
      >
        <PointIcon size={16} />
        <strong>{balance}</strong>
        {showCheckIn && !checkedIn && (
          <span className="point-chip__dot" aria-hidden />
        )}
      </button>
      <PointWalletSheet
        open={open}
        showCheckIn={showCheckIn}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export function PointWalletSheet({
  open,
  showCheckIn = true,
  onClose,
}: {
  open: boolean
  showCheckIn?: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { showToast } = useFeedback()
  // Without an account, 찰떡 only live in this browser (prototype).
  const signedIn = usePrototypeStore(
    (state) => state.authSession.status === 'authenticated',
  )
  const balance = usePointsStore((state) => state.balance)
  const checkIn = usePointsStore((state) => state.checkIn)
  const rewardAd = usePointsStore((state) => state.rewardAd)
  const firstCheerRewarded = usePointsStore((state) => state.firstCheerRewarded)
  const checkedIn = usePointsStore((state) => selectCheckedInToday(state))
  const filled = usePointsStore((state) => selectFilledStamps(state))
  const adsLeft = usePointsStore((state) => selectAdsLeftToday(state))
  const [watching, setWatching] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const ad = useAdCountdown(open)

  const stamp = () => {
    const result = checkIn()
    if (!result) return
    showToast(
      result.bonus > 0
        ? `도장 ${STAMP_CARD_SIZE}개 완성! ${formatPoints(result.reward + result.bonus)}를 받았어요.`
        : `출석 도장 쾅! ${formatPoints(result.reward)}를 받았어요.`,
    )
  }

  const collectAd = () => {
    const reward = rewardAd()
    ad.reset()
    setWatching(false)
    if (reward > 0) showToast(`광고 보고 ${formatPoints(reward)}를 받았어요.`)
  }

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        setWatching(false)
        setGuideOpen(false)
        ad.reset()
        onClose()
      }}
      title={`내 ${POINT_NAME}`}
      description={`${POINT_NAME}으로 보석, 아크릴 부적, 대학 굿즈, 편지지를 살 수 있어요.`}
    >
      <div className="point-wallet">
        <div className="point-wallet__balance">
          <PointIcon size={30} />
          <strong>{balance}개</strong>
        </div>

        {!signedIn && (
          <section className="point-wallet__guest" aria-label="로그인 안내">
            <div>
              <strong>로그인하면 찰떡이 사라지지 않아요.</strong>
              <span>지금은 이 기기에만 보관돼요. 가입하면 모은 찰떡을 그대로 옮겨드려요.</span>
            </div>
            <Button
              variant="secondary"
              size="m"
              onClick={() => {
                onClose()
                navigate('/auth/login')
              }}
            >
              로그인
            </Button>
          </section>
        )}

        {showCheckIn && (
          <section className="point-wallet__section" aria-label="출석 도장">
            <header>
              <strong>출석 도장</strong>
              <span>
                하루 {formatPoints(CHECK_IN_REWARD)} · 도장 {STAMP_CARD_SIZE}개마다{' '}
                {STAMP_CARD_BONUS}개 더
              </span>
            </header>
            <ol className="point-wallet__stamps">
              {Array.from({ length: STAMP_CARD_SIZE }, (_, index) => (
                <li
                  key={index}
                  className={[
                    'point-wallet__stamp',
                    index < filled ? 'point-wallet__stamp--done' : '',
                    index === STAMP_CARD_SIZE - 1 ? 'point-wallet__stamp--bonus' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {index < filled ? <Check size={14} aria-hidden /> : index + 1}
                </li>
              ))}
            </ol>
            <Button
              variant="brand"
              fullWidth
              disabled={checkedIn}
              onClick={stamp}
            >
              {checkedIn ? '오늘 도장은 찍었어요' : '지금 도장 찍기'}
            </Button>
            <p className="point-wallet__note">
              오늘의 응원을 열면 도장이 저절로 찍혀요. 하루쯤 빠져도 모은 도장은 그대로예요.
            </p>
          </section>
        )}

        <section className="point-wallet__section" aria-label="광고 보기">
          <header>
            <strong>광고 보기</strong>
            <span>
              한 번에 {formatPoints(AD_REWARD)} · 오늘 {adsLeft}/{AD_DAILY_LIMIT}번 남음
            </span>
          </header>
          {watching && <AdPlayer playing={ad.playing} remaining={ad.remaining} />}
          {watching && ad.finished ? (
            <Button variant="brand" fullWidth onClick={collectAd}>
              {formatPoints(AD_REWARD)} 받기
            </Button>
          ) : (
            <Button
              variant="secondary"
              fullWidth
              disabled={watching || adsLeft === 0}
              onClick={() => {
                setWatching(true)
                ad.start()
              }}
            >
              {watching
                ? '광고 보는 중…'
                : adsLeft > 0
                  ? '광고 보고 받기'
                  : '오늘 광고는 다 봤어요'}
            </Button>
          )}
        </section>

        <p className="point-wallet__extra">
          {firstCheerRewarded
            ? '첫 응원 보너스를 받았어요.'
            : `친구에게 첫 응원을 남기면 ${formatPoints(FIRST_CHEER_REWARD)}를 더 줘요.`}
        </p>

        <button
          type="button"
          className="point-wallet__guide-toggle"
          aria-expanded={guideOpen}
          onClick={() => setGuideOpen((value) => !value)}
        >
          {guideOpen ? `${POINT_NAME} 안내 접기` : `${POINT_NAME} 안내`}
        </button>
        {guideOpen && <PointGuide />}
      </div>
    </BottomSheet>
  )
}
