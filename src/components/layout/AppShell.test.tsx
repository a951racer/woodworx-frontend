import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('renders a two-panel layout with nav and content', () => {
    render(
      <AppShell nav={<nav>Navigation</nav>}>
        <p>Content area</p>
      </AppShell>
    )

    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Content area')).toBeInTheDocument()
  })

  it('applies the app-shell class to the root element', () => {
    const { container } = render(
      <AppShell nav={<nav>Nav</nav>}>
        <p>Content</p>
      </AppShell>
    )

    const shell = container.firstElementChild
    expect(shell).toHaveClass('app-shell')
  })

  it('renders nav inside an aside with app-shell__nav class', () => {
    const { container } = render(
      <AppShell nav={<nav data-testid="nav">Nav</nav>}>
        <p>Content</p>
      </AppShell>
    )

    const aside = container.querySelector('aside.app-shell__nav')
    expect(aside).toBeInTheDocument()
    expect(aside).toContainElement(screen.getByTestId('nav'))
  })

  it('renders children inside a main element with app-shell__content class', () => {
    const { container } = render(
      <AppShell nav={<nav>Nav</nav>}>
        <p data-testid="content">Main content</p>
      </AppShell>
    )

    const main = container.querySelector('main.app-shell__content')
    expect(main).toBeInTheDocument()
    expect(main).toContainElement(screen.getByTestId('content'))
  })
})
