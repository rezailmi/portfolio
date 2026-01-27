import * as React from 'react'
import { createPortal } from 'react-dom'
import { useDirectEdit } from './provider'
import { cn } from './cn'
import { Crosshair } from 'lucide-react'

function DirectEditToolbarContent() {
  const { editModeActive, toggleEditMode } = useDirectEdit()

  return createPortal(
    <button
      type="button"
      onClick={toggleEditMode}
      className={cn(
        'fixed bottom-4 left-1/2 z-[99999] flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-lg transition-all duration-200',
        editModeActive
          ? 'border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600'
          : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Crosshair className="size-4" />
      {editModeActive && <span>Edit Mode Active</span>}
      <kbd
        className={cn(
          'ml-1 rounded px-1.5 py-0.5 font-mono text-[10px]',
          editModeActive ? 'bg-blue-600 text-blue-100' : 'bg-muted text-muted-foreground'
        )}
      >
        {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘.' : 'Ctrl+.'}
      </kbd>
    </button>,
    document.body
  )
}

export function DirectEditToolbar() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <DirectEditToolbarContent />
}
