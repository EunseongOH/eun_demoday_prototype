/** A small 찰떡: one soft rice cake with a dusting of colour on top. */
export function PointIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="point-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M3.2 15.4c0-5 3.9-9.4 8.8-9.4s8.8 4.4 8.8 9.4c0 2.6-3.9 3.6-8.8 3.6s-8.8-1-8.8-3.6Z"
        fill="#FFF8EA"
        stroke="#542F20"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 9.6c1-1 2.2-1.5 3.6-1.5"
        fill="none"
        stroke="#F46C65"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
