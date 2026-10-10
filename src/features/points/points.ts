/**
 * 찰떡: the app's point. Named after the sticky rice cake friends hand each
 * other before 수능 ("착 붙어라"), the same "stick" the 착 brand is built on.
 * One 찰떡 is worth roughly 5원, so every price lands on a whole number.
 */
export const POINT_NAME = '찰떡'

/** "찰떡 40개" — the one way a point amount is written in the app. */
export function formatPoints(amount: number) {
  return `${POINT_NAME} ${amount}개`
}

/** Daily attendance stamp; opening today's cheers stamps it on its own. */
export const CHECK_IN_REWARD = 3
/**
 * Every 7th stamp adds a bonus. Days don't have to be in a row: a student
 * who skips a day for 공부 keeps the card instead of starting over.
 */
export const STAMP_CARD_SIZE = 7
export const STAMP_CARD_BONUS = 10
/** One rewarded ad, up to `AD_DAILY_LIMIT` times a day. */
export const AD_REWARD = 5
export const AD_DAILY_LIMIT = 3
/** Once, for the first cheer someone leaves for a friend. */
export const FIRST_CHEER_REWARD = 5

/** Stationery templates in the composer, kept for good once bought. */
export const STATIONERY_PRICE = 10
/** Paid clips and washi tapes in the composer, kept for good once bought. */
export const LETTER_DECOR_PRICE = 5

/** Local calendar day, so a stamp resets at the user's midnight. */
export function dayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
