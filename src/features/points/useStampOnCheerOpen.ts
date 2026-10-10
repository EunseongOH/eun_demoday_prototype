import { useEffect } from 'react'
import { useFeedback } from '@/design-system'
import { STAMP_CARD_SIZE, formatPoints } from './points'
import { usePointsStore } from './pointsStore'

/**
 * Opening one of today's cheers is the daily stamp. Owners already come back
 * at the unlock time to read them, so attendance needs no push reminder.
 */
export function useStampOnCheerOpen(opened: boolean) {
  const { showToast } = useFeedback()
  const checkIn = usePointsStore((state) => state.checkIn)

  useEffect(() => {
    if (!opened) return
    const result = checkIn()
    if (!result) return
    showToast(
      result.bonus > 0
        ? `도장 ${STAMP_CARD_SIZE}개 완성! ${formatPoints(result.reward + result.bonus)}를 받았어요.`
        : `오늘의 응원을 열어서 출석 도장 쾅! ${formatPoints(result.reward)}를 받았어요.`,
    )
  }, [checkIn, opened, showToast])
}
