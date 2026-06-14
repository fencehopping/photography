import { cameraSettings } from '../lib/cameraSettings';
import type { CameraSetting } from '../types';
import apertureIcon from '../../aperture.svg';

interface CameraSettingsMenuProps {
  value: CameraSetting;
  onChange: (value: CameraSetting) => void;
}

export function CameraSettingsMenu({ value, onChange }: CameraSettingsMenuProps) {
  return (
    <div className="control">
      <label className="control-label" htmlFor="camera-setting">
        Camera Settings
      </label>
      <div className="select-button">
        <img className="select-icon select-icon-image" src={apertureIcon} alt="" aria-hidden="true" />
        <span className="select-label" aria-hidden="true">
          CAMERA
        </span>
        <select
          id="camera-setting"
          aria-label="Camera Settings"
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
    </div>
  );
}
