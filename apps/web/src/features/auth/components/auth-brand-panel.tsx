import type { ReactNode } from "react"

const dotPattern = "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')"

export function AuthBrandPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-sky-800 lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12 lg:pt-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: dotPattern, backgroundSize: "60px 60px" }}
      />
      {children}
    </div>
  )
}
