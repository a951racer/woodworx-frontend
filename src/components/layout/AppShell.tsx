import { ReactNode } from 'react'

interface AppShellProps {
  nav: ReactNode
  children: ReactNode
}

export function AppShell({ nav, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell__nav">
        {nav}
      </aside>
      <main className="app-shell__content">
        {children}
      </main>
    </div>
  )
}
