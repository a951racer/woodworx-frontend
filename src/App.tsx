import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { NavBar } from './components/layout/NavBar'
import { ContentArea } from './components/layout/ContentArea'
import { DesignsPage } from './pages/DesignsPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { GalleryPage } from './pages/GalleryPage'
import { CustomersPage } from './pages/CustomersPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { ForgotPassword } from './components/auth/ForgotPassword'
import { useAuthStore } from './stores/authStore'
import { useSettingsStore } from './stores/settingsStore'

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const fetchSettings = useSettingsStore((s) => s.fetchSettings)

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, fetchSettings]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/designs" replace />} />
      <Route path="/register" element={<Navigate to="/designs" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/designs" replace />} />
      <Route
        path="*"
        element={
          <AppShell nav={<NavBar />}>
            <Routes>
              <Route element={<ContentArea />}>
                <Route path="/designs" element={<DesignsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/designs" replace />} />
                <Route path="*" element={<Navigate to="/designs" replace />} />
              </Route>
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  )
}

export default App
