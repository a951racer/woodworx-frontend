import { useNavigate } from 'react-router-dom'
import { NavItem } from './NavItem'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
  { icon: 'designs-icon', label: 'Designs', to: '/designs' },
  { icon: 'projects-icon', label: 'Projects', to: '/projects' },
  { icon: 'gallery-icon', label: 'Gallery', to: '/gallery' },
  { icon: 'customers-icon', label: 'Customers', to: '/customers' },
  { icon: 'settings-icon', label: 'Settings', to: '/settings' },
]

export function NavBar() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav-bar">
      <div className="nav-bar__brand">
        <img src="/logo.png" alt="WoodworX logo" className="nav-bar__logo" />
        <span className="nav-bar__title">WoodworX</span>
      </div>
      <ul className="nav-bar__items">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavItem icon={item.icon} label={item.label} to={item.to} />
          </li>
        ))}
      </ul>
      <button type="button" className="nav-bar__logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="nav-bar__version">v0.1.0</div>
    </nav>
  )
}
