import { useEffect, useState } from 'react'

/** How long the prototype "ad" plays before it counts as watched, in seconds. */
export const AD_SECONDS = 5

/**
 * Countdown for one prototype rewarded ad. `reset` re-arms it, e.g. when
 * the sheet switches to another item. No real ad network is called.
 */
export function useAdCountdown(resetKey?: unknown) {
  const [remaining, setRemaining] = useState(AD_SECONDS)
  const [playing, setPlaying] = useState(false)

  const reset = () => {
    setRemaining(AD_SECONDS)
    setPlaying(false)
  }

  useEffect(reset, [resetKey])

  useEffect(() => {
    if (!playing || remaining <= 0) return
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [playing, remaining])

  return {
    remaining,
    playing,
    finished: playing && remaining <= 0,
    start: () => setPlaying(true),
    reset,
  }
}
