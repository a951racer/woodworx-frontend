import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { SettingsForm } from '../components/settings/SettingsForm';
import '../components/settings/settings.css';

export function SettingsPage() {
  const { settings, loading, fetchSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="content-area__title">Settings</h1>
      </div>

      {loading && <p className="settings-page__loading">Loading settings…</p>}

      {settings && <SettingsForm settings={settings} onSubmit={updateSettings} />}
    </div>
  );
}
