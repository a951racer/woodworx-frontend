import { Outlet } from 'react-router-dom'

export function ContentArea() {
  return (
    <div className="content-area">
      <Outlet />
    </div>
  )
}
