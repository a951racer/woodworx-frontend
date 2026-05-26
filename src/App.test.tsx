import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { useAuthStore } from './stores/authStore'

// Helper to set auth state directly
function setAuthenticated(value: boolean) {
  useAuthStore.setState({ isAuthenticated: value, token: value ? 'fake-token' : null, user: value ? { id: '1', email: 'test@test.com' } : null })
}

describe('App - Authenticated', () => {
  beforeEach(() => {
    setAuthenticated(true)
  })

  it('renders the WoodworX heading', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('WoodworX')).toBeDefined()
  })

  it('navigates to Designs by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Designs' })).toBeDefined()
  })

  it('renders the correct page for each route', () => {
    const routes = [
      { path: '/designs', heading: 'Designs' },
      { path: '/projects', heading: 'Projects' },
      { path: '/gallery', heading: 'Gallery' },
      { path: '/customers', heading: 'Customers' },
      { path: '/settings', heading: 'Settings' },
      { path: '/about', heading: 'About' },
    ]

    for (const route of routes) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[route.path]}>
          <App />
        </MemoryRouter>
      )
      expect(screen.getByRole('heading', { name: route.heading })).toBeDefined()
      unmount()
    }
  })

  it('redirects /login to /designs when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Designs' })).toBeDefined()
  })

  it('redirects /register to /designs when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Designs' })).toBeDefined()
  })

  it('redirects /forgot-password to /designs when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Designs' })).toBeDefined()
  })
})

describe('App - Unauthenticated', () => {
  beforeEach(() => {
    setAuthenticated(false)
  })

  it('shows login form at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeDefined()
  })

  it('shows register form at /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeDefined()
  })

  it('shows forgot password form at /forgot-password', () => {
    render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeDefined()
  })

  it('redirects unknown routes to /login', () => {
    render(
      <MemoryRouter initialEntries={['/designs']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeDefined()
  })

  it('redirects / to /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeDefined()
  })
})
