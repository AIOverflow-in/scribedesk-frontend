import React from "react"

interface ThreeDotsScaleProps {
  size?: number
  className?: string
}

export function ThreeDotsScale({ size = 24, className }: ThreeDotsScaleProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <circle cx="4" cy="12" r="3" fill="currentColor">
        <animate
          id="dot1"
          attributeName="r"
          begin="0;dot3.end-0.25s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="r"
          begin="dot1.end-0.6s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
      <circle cx="20" cy="12" r="3" fill="currentColor">
        <animate
          id="dot3"
          attributeName="r"
          begin="dot1.end-0.45s"
          dur="0.75s"
          values="3;.2;3"
        />
      </circle>
    </svg>
  )
}
