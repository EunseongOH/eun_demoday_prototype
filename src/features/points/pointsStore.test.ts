import { beforeEach, describe, expect, it } from 'vitest'
import {
  AD_DAILY_LIMIT,
  AD_REWARD,
  CHECK_IN_REWARD,
  FIRST_CHEER_REWARD,
  STAMP_CARD_BONUS,
} from './points'
import {
  selectAdsLeftToday,
  selectFilledStamps,
  usePointsStore,
} from './pointsStore'

const day = (date: number) => new Date(2026, 9, date, 9)

describe('pointsStore', () => {
  beforeEach(() => {
    usePointsStore.setState({
      balance: 0,
      lastCheckInDay: null,
      stamps: 0,
      adDay: null,
      adCount: 0,
      firstCheerRewarded: false,
    })
  })

  it('stamps once a day', () => {
    const { checkIn } = usePointsStore.getState()
    expect(checkIn(day(1))).toEqual({ reward: CHECK_IN_REWARD, bonus: 0 })
    expect(checkIn(day(1))).toBeNull()
    expect(usePointsStore.getState().balance).toBe(CHECK_IN_REWARD)
  })

  it('pays the card bonus on every 7th stamp, even with days skipped', () => {
    const { checkIn } = usePointsStore.getState()
    for (const date of [1, 2, 4, 5, 8, 9]) checkIn(day(date))
    expect(selectFilledStamps(usePointsStore.getState(), day(10))).toBe(6)

    expect(checkIn(day(12))?.bonus).toBe(STAMP_CARD_BONUS)
    expect(usePointsStore.getState().balance).toBe(CHECK_IN_REWARD * 7 + STAMP_CARD_BONUS)
    // The full card stays on screen that day, then a new card starts.
    expect(selectFilledStamps(usePointsStore.getState(), day(12))).toBe(7)
    expect(selectFilledStamps(usePointsStore.getState(), day(13))).toBe(0)
    expect(checkIn(day(13))?.bonus).toBe(0)
  })

  it('pays ads up to the daily limit, then again the next day', () => {
    const { rewardAd } = usePointsStore.getState()
    for (let count = 0; count < AD_DAILY_LIMIT; count += 1) {
      expect(rewardAd(day(1))).toBe(AD_REWARD)
    }
    expect(rewardAd(day(1))).toBe(0)
    expect(selectAdsLeftToday(usePointsStore.getState(), day(1))).toBe(0)
    expect(selectAdsLeftToday(usePointsStore.getState(), day(2))).toBe(AD_DAILY_LIMIT)
    expect(rewardAd(day(2))).toBe(AD_REWARD)
  })

  it('only spends what the balance covers', () => {
    usePointsStore.setState({ balance: 12 })
    const { spend } = usePointsStore.getState()
    expect(spend(30)).toBe(false)
    expect(usePointsStore.getState().balance).toBe(12)
    expect(spend(10)).toBe(true)
    expect(usePointsStore.getState().balance).toBe(2)
  })

  it('pays the first cheer bonus once', () => {
    const { rewardFirstCheer } = usePointsStore.getState()
    expect(rewardFirstCheer()).toBe(FIRST_CHEER_REWARD)
    expect(rewardFirstCheer()).toBe(0)
    expect(usePointsStore.getState().balance).toBe(FIRST_CHEER_REWARD)
  })
})
