import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AD_DAILY_LIMIT,
  AD_REWARD,
  CHECK_IN_REWARD,
  FIRST_CHEER_REWARD,
  STAMP_CARD_BONUS,
  STAMP_CARD_SIZE,
  dayKey,
} from './points'

type PointsState = {
  balance: number
  /** Day of the last attendance stamp, or null before the first one. */
  lastCheckInDay: string | null
  /** Stamps collected so far; every `STAMP_CARD_SIZE`th one pays a bonus. */
  stamps: number
  /** Rewarded ads watched on `adDay`. */
  adDay: string | null
  adCount: number
  firstCheerRewarded: boolean
  /** Stamps today. Returns what was earned, or null if already stamped. */
  checkIn: (now?: Date) => { reward: number; bonus: number } | null
  /** Pays out one rewarded ad. Returns 0 once today's ads are used up. */
  rewardAd: (now?: Date) => number
  /** Takes points if there are enough; false leaves the balance alone. */
  spend: (amount: number) => boolean
  /** Pays the one-time first cheer bonus. Returns 0 if it was already paid. */
  rewardFirstCheer: () => number
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      balance: 0,
      lastCheckInDay: null,
      stamps: 0,
      adDay: null,
      adCount: 0,
      firstCheerRewarded: false,
      checkIn: (now = new Date()) => {
        const state = get()
        const today = dayKey(now)
        if (state.lastCheckInDay === today) return null

        const stamps = state.stamps + 1
        const bonus = stamps % STAMP_CARD_SIZE === 0 ? STAMP_CARD_BONUS : 0
        set({
          balance: state.balance + CHECK_IN_REWARD + bonus,
          lastCheckInDay: today,
          stamps,
        })
        return { reward: CHECK_IN_REWARD, bonus }
      },
      rewardAd: (now = new Date()) => {
        const state = get()
        const today = dayKey(now)
        const watched = state.adDay === today ? state.adCount : 0
        if (watched >= AD_DAILY_LIMIT) return 0

        set({
          balance: state.balance + AD_REWARD,
          adDay: today,
          adCount: watched + 1,
        })
        return AD_REWARD
      },
      spend: (amount) => {
        const { balance } = get()
        if (amount > balance) return false
        set({ balance: balance - amount })
        return true
      },
      rewardFirstCheer: () => {
        const state = get()
        if (state.firstCheerRewarded) return 0
        set({
          balance: state.balance + FIRST_CHEER_REWARD,
          firstCheerRewarded: true,
        })
        return FIRST_CHEER_REWARD
      },
    }),
    {
      name: 'eun-demoday-points',
      partialize: (state) => ({
        balance: state.balance,
        lastCheckInDay: state.lastCheckInDay,
        stamps: state.stamps,
        adDay: state.adDay,
        adCount: state.adCount,
        firstCheerRewarded: state.firstCheerRewarded,
      }),
    },
  ),
)

export function selectAdsLeftToday(state: PointsState, now = new Date()) {
  const watched = state.adDay === dayKey(now) ? state.adCount : 0
  return Math.max(0, AD_DAILY_LIMIT - watched)
}

export function selectCheckedInToday(state: PointsState, now = new Date()) {
  return state.lastCheckInDay === dayKey(now)
}

/**
 * Filled boxes on the stamp card. The day the card fills up it shows all
 * seven; the next stamp starts a fresh card.
 */
export function selectFilledStamps(state: PointsState, now = new Date()) {
  const { stamps } = state
  if (stamps === 0) return 0
  return selectCheckedInToday(state, now)
    ? ((stamps - 1) % STAMP_CARD_SIZE) + 1
    : stamps % STAMP_CARD_SIZE
}
