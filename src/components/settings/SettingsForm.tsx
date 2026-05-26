import { useState, useEffect } from 'react';
import type { Settings, UpdateSettingsDTO } from '../../types';
import './settings.css';

interface SettingsFormProps {
  settings: Settings;
  onSubmit: (data: UpdateSettingsDTO) => Promise<void>;
}

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const [measurementSystem, setMeasurementSystem] = useState<'imperial' | 'metric'>(
    settings.measurementSystem
  );
  const [lengthMargin, setLengthMargin] = useState(settings.margins.length);
  const [widthMargin, setWidthMargin] = useState(settings.margins.width);
  const [thicknessMargin, setThicknessMargin] = useState(settings.margins.thickness);
  const [driveStoragePath, setDriveStoragePath] = useState(settings.driveStoragePath || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMeasurementSystem(settings.measurementSystem);
    setLengthMargin(settings.margins.length);
    setWidthMargin(settings.margins.width);
    setThicknessMargin(settings.margins.thickness);
    setDriveStoragePath(settings.driveStoragePath || '');
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      measurementSystem,
      margins: {
        length: lengthMargin,
        width: widthMargin,
        thickness: thicknessMargin,
      },
      driveStoragePath,
    });
    setSaving(false);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2 className="settings-form__title">Preferences</h2>

      <div className="settings-form__section">
        <span className="settings-form__section-label">Measurement System</span>
        <div className="settings-form__radio-group" role="radiogroup" aria-label="Measurement system">
          <label className="settings-form__radio-label">
            <input
              type="radio"
              name="measurementSystem"
              value="imperial"
              checked={measurementSystem === 'imperial'}
              onChange={() => setMeasurementSystem('imperial')}
            />
            Imperial
          </label>
          <label className="settings-form__radio-label">
            <input
              type="radio"
              name="measurementSystem"
              value="metric"
              checked={measurementSystem === 'metric'}
              onChange={() => setMeasurementSystem('metric')}
            />
            Metric
          </label>
        </div>
      </div>

      <fieldset className="settings-form__fieldset">
        <legend>Margins (tolerance)</legend>
        <div className="settings-form__margins">
          <div className="settings-form__field">
            <label htmlFor="margin-length">Length</label>
            <input
              id="margin-length"
              type="number"
              step="0.01"
              min="0"
              value={lengthMargin}
              onChange={(e) => setLengthMargin(Number(e.target.value))}
            />
          </div>
          <div className="settings-form__field">
            <label htmlFor="margin-width">Width</label>
            <input
              id="margin-width"
              type="number"
              step="0.01"
              min="0"
              value={widthMargin}
              onChange={(e) => setWidthMargin(Number(e.target.value))}
            />
          </div>
          <div className="settings-form__field">
            <label htmlFor="margin-thickness">Thickness</label>
            <input
              id="margin-thickness"
              type="number"
              step="0.01"
              min="0"
              value={thicknessMargin}
              onChange={(e) => setThicknessMargin(Number(e.target.value))}
            />
          </div>
        </div>
      </fieldset>

      <div className="settings-form__section">
        <div className="settings-form__field">
          <label htmlFor="drive-storage-path">Google Drive Storage Path</label>
          <input
            id="drive-storage-path"
            type="text"
            value={driveStoragePath}
            onChange={(e) => setDriveStoragePath(e.target.value)}
          />
        </div>
      </div>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
