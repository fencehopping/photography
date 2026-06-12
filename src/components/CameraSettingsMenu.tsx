import { cameraSettings } from '../lib/cameraSettings';
import type { CameraSetting } from '../types';

interface CameraSettingsMenuProps {
  value: CameraSetting;
  onChange: (value: CameraSetting) => void;
}

export function CameraSettingsMenu({ value, onChange }: CameraSettingsMenuProps) {
  return (
    <div className="control">
      <label htmlFor="camera-setting">Camera Settings</label>
      <select
        id="camera-setting"
        value={value}
        onChange={(event) => onChange(event.target.value as CameraSetting)}
      >
        {cameraSettings.map((setting) => (
          <option key={setting.id} value={setting.id}>
            {setting.label}
          </option>
        ))}
      </select>
    </div>
  );
}
