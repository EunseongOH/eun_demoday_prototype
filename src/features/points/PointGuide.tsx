import { LOCKER_DECOR_PRICE } from '@/features/classroom/lockerDecor'
import { PENNANT_PRICE } from '@/features/classroom/lockerStickers'
import { UNIVERSITY_CHARM_PRICE } from '@/features/classroom/universities'
import { ACRYLIC_CHARM_PRICE } from '@/features/supporter/charmDesigns'
import { GEM_PRICE } from '@/features/supporter/gems'
import {
  AD_DAILY_LIMIT,
  AD_REWARD,
  CHECK_IN_REWARD,
  FIRST_CHEER_REWARD,
  LETTER_DECOR_PRICE,
  POINT_NAME,
  STAMP_CARD_BONUS,
  STAMP_CARD_SIZE,
  STATIONERY_PRICE,
} from './points'
import './points.css'

const earnRows = [
  ['오늘의 응원 열기 (출석 도장)', `+${CHECK_IN_REWARD}`],
  [`도장 ${STAMP_CARD_SIZE}개 모을 때마다`, `+${STAMP_CARD_BONUS}`],
  [`광고 보기 · 하루 ${AD_DAILY_LIMIT}번`, `+${AD_REWARD}`],
  ['친구에게 첫 응원 남기기 · 한 번', `+${FIRST_CHEER_REWARD}`],
] as const

const spendRows = [
  ['보석 스티커 1개', GEM_PRICE],
  ['클립 · 마스킹 테이프', LETTER_DECOR_PRICE],
  ['편지지', STATIONERY_PRICE],
  ['아크릴 부적', ACRYLIC_CHARM_PRICE],
  ['대학 깃발', PENNANT_PRICE],
  ['대학 굿즈 부적', UNIVERSITY_CHARM_PRICE],
  ['사물함 조명 · 페인트', LOCKER_DECOR_PRICE],
] as const

/** Everything about 찰떡 on one card: how to earn, what it buys, the rules. */
export function PointGuide() {
  return (
    <div className="point-guide">
      <section>
        <h3>모으기</h3>
        <dl>
          {earnRows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h3>쓰기</h3>
        <dl>
          {spendRows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}개</dd>
            </div>
          ))}
        </dl>
      </section>
      <ul className="point-guide__rules">
        <li>도장은 하루 하나예요. 하루쯤 빠져도 모은 도장은 그대로예요.</li>
        <li>{POINT_NAME}은 현금으로 바꾸거나 환불, 선물할 수 없어요.</li>
        <li>로그인하지 않으면 이 기기에만 보관돼요.</li>
        <li>바구니에 넣은 응원은 지금처럼 광고를 보고 다시 열어요.</li>
      </ul>
    </div>
  )
}
