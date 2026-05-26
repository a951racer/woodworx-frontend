import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface NavItemProps {
  icon: string | ReactNode
  label: string
  to: string
}

export function NavItem({ icon, label, to }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item${isActive ? ' nav-item--active' : ''}`
      }
    >
      <span className="nav-item__icon">
        {typeof icon === 'string' ? (
          <svg>
            <use href={`/icons.svg#${icon}`} />
          </svg>
        ) : (
          icon
        )}
      </span>
      <span className="nav-item__label">{label}</span>
    </NavLink>
  )
}
