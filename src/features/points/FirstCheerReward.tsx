import { useEffect, useState } from 'react'
import { BottomSheet, Button } from '@/design-system'
import { PointGuide } from './PointGuide'
import { PointIcon } from './PointIcon'
import { POINT_NAME, formatPoints } from './points'
import { usePointsStore } from './pointsStore'
import './points.css'

/**
 * Pays the one-time first cheer bonus on a "cheer placed" screen, and uses
 * that moment to introduce 찰떡: the first time anyone hears of it, they
 * are already holding some.
 */
export function FirstCheerReward() {
  const rewardFirstCheer = usePointsStore((state) => state.rewardFirstCheer)
  const [reward, setReward] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    const paid = rewardFirstCheer()
    if (paid > 0) setReward(paid)
  }, [rewardFirstCheer])

  const close = () => {
    setReward(0)
    setGuideOpen(false)
  }

  return (
    <BottomSheet
      open={reward > 0}
      onClose={close}
      title="첫 응원 고마워요!"
      description={`착 붙으라고 ${formatPoints(reward)}를 드려요.`}
    >
      <div className="point-intro">
        <div className="point-intro__gift" aria-hidden>
          <PointIcon size={44} />
          <strong>+{reward}</strong>
        </div>
        <p>
          수능 전에 "착 붙어라" 하고 주던 찹쌀떡처럼, 응원할수록 {POINT_NAME}이
          쌓여요. 보석 스티커, 아크릴 부적, 예쁜 편지지를 살 수 있어요.
        </p>
        {guideOpen && <PointGuide />}
        <div className="point-intro__actions">
          {!guideOpen && (
            <Button variant="secondary" fullWidth onClick={() => setGuideOpen(true)}>
              {POINT_NAME} 안내 보기
            </Button>
          )}
          <Button variant="brand" fullWidth onClick={close}>
            좋아요
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
