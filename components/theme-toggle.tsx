'use client'

import * as React from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as stylex from '@stylexjs/stylex'
import { a11y } from '@/lib/a11y'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const styles = stylex.create({
  trigger: {
    height: '1.75rem',
    width: '1.75rem',
  },
  icon: {
    height: '1rem',
    transition: 'transform 200ms ease-out, opacity 200ms ease-out',
    width: '1rem',
  },
  sun: {
    opacity: {
      default: 1,
      ':where(.dark *)': 0,
    },
    transform: {
      default: 'rotate(0deg) scale(1)',
      ':where(.dark *)': 'rotate(-90deg) scale(0.95)',
    },
  },
  moon: {
    position: 'absolute',
    opacity: {
      default: 0,
      ':where(.dark *)': 1,
    },
    transform: {
      default: 'rotate(90deg) scale(0.95)',
      ':where(.dark *)': 'rotate(0deg) scale(1)',
    },
  },
  menuIcon: {
    height: '1rem',
    marginRight: '0.5rem',
    width: '1rem',
  },
})

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className={stylex.props(styles.trigger).className}>
                    <Sun {...stylex.props(styles.icon, styles.sun)} />
                    <Moon {...stylex.props(styles.icon, styles.moon)} />
                    <span {...stylex.props(a11y.srOnly)}>Toggle theme</span>
                  </Button>
                }
              />
            }
          />
          <TooltipContent side="bottom" align="end">
            Toggle theme
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun {...stylex.props(styles.menuIcon)} />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon {...stylex.props(styles.menuIcon)} />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Laptop {...stylex.props(styles.menuIcon)} />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
