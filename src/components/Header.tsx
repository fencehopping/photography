import { CameraSettingsMenu } from './CameraSettingsMenu';
import { CategoryFilter } from './CategoryFilter';
import type { CategoryFilterValue } from '../lib/photos';
import type { CameraSetting } from '../types';

interface HeaderProps {
  category: CategoryFilterValue;
  cameraSetting: CameraSetting;
  onCategoryChange: (value: CategoryFilterValue) => void;
  onCameraSettingChange: (value: CameraSetting) => void;
}

export function Header({
  category,
  cameraSetting,
  onCategoryChange,
  onCameraSettingChange,
}: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Sara Cohen home">
        Sara Cohen
      </a>
      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="#about">About</a>
        <a href="mailto:sara@example.com">Hire Me</a>
      </nav>
      <div className="header-controls">
        <CategoryFilter value={category} onChange={onCategoryChange} />
        <CameraSettingsMenu value={cameraSetting} onChange={onCameraSettingChange} />
      </div>
    </header>
  );
}
