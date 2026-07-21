import type { ReactNode } from 'react'

interface EmptyStateProps {
  illustration?: ReactNode
  title: string
  children: ReactNode
  actions?: ReactNode
}

export function EmptyState({ illustration, title, children, actions }: EmptyStateProps) {
  return (
    <div className="flex min-h-[55svh] items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {illustration && (
          <div className="animate-blur-fade-in mb-8 text-foreground motion-reduce:animate-none">
            {illustration}
          </div>
        )}
        <h2 className="animate-blur-fade-in text-lg font-semibold tracking-tight [animation-delay:75ms] motion-reduce:animate-none">
          {title}
        </h2>
        <div className="animate-blur-fade-in mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [animation-delay:150ms] motion-reduce:animate-none sm:text-base">
          {children}
        </div>
        {actions && (
          <div className="animate-blur-fade-in mt-6 flex flex-wrap items-center gap-2 [animation-delay:225ms] motion-reduce:animate-none">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export function NoteStackIllustration() {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className="-ml-3 overflow-visible"
    >
      {/* stack of settled sheets */}
      <path
        d="M48 56 78 71 48 86 18 71Z"
        className="fill-muted stroke-muted-foreground/40"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M48 49 78 64 48 79 18 64Z"
        className="fill-background stroke-muted-foreground/60"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M48 42 78 57 48 72 18 57Z"
        className="fill-background stroke-current"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* lifted top sheet */}
      <g transform="rotate(-14 48 26)">
        <path
          d="M48 8 76 22 48 36 20 22Z"
          className="fill-background stroke-current"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M36 20.5 54 18M40 25 58 22.5"
          className="stroke-muted-foreground/70"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
