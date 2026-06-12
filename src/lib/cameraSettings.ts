import type { CameraSetting } from '../types';

export interface CameraSettingOption {
  id: CameraSetting;
  label: string;
  description: string;
  className: string;
}

export const cameraSettings: CameraSettingOption[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Natural color rendering.',
    className: 'setting-standard',
  },
  {
    id: 'black-white',
    label: 'Black & White',
    description: 'Classic monochrome conversion.',
    className: 'setting-black-white',
  },
  {
    id: 'contact-sheet',
    label: 'Contact Sheet',
    description: 'Smaller frames with labels and borders.',
    className: 'setting-contact-sheet',
  },
  {
    id: 'high-iso',
    label: 'High ISO',
    description: 'Higher contrast with subtle grain.',
    className: 'setting-high-iso',
  },
  {
    id: 'golden-hour',
    label: 'Golden Hour',
    description: 'A warm, late-day cast.',
    className: 'setting-golden-hour',
  },
  {
    id: 'cool-editorial',
    label: 'Cool Editorial',
    description: 'Cooler tone with restrained saturation.',
    className: 'setting-cool-editorial',
  },
  {
    id: 'soft-focus',
    label: 'Soft Focus',
    description: 'Gentle glow and reduced clarity.',
    className: 'setting-soft-focus',
  },
];

export function getCameraSetting(id: CameraSetting): CameraSettingOption {
  return cameraSettings.find((setting) => setting.id === id) ?? cameraSettings[0];
}
