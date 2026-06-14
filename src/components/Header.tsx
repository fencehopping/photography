import { CameraSettingsMenu } from './CameraSettingsMenu';
import { CategoryFilter } from './CategoryFilter';
import type { CategoryFilterValue } from '../lib/photos';
import type { CameraSetting } from '../types';

interface HeaderProps {
  categories: CategoryFilterValue[];
  category: CategoryFilterValue;
  cameraSetting: CameraSetting;
  onCategoryChange: (value: CategoryFilterValue) => void;
  onCameraSettingChange: (value: CameraSetting) => void;
}

export function Header({
  categories,
  category,
  cameraSetting,
  onCategoryChange,
  onCameraSettingChange,
}: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Sarah Cronin home">
        <span className="brand-name">Sarah Cronin</span>
        <span className="brand-location">
          <span>SCITUATE, MA</span>
          <span>42.1957° N, -70.7249° W</span>
        </span>
      </a>
      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
      </nav>
      <div className="header-controls">
        <CameraSettingsMenu value={cameraSetting} onChange={onCameraSettingChange} />
        <CategoryFilter categories={categories} value={category} onChange={onCategoryChange} />
      </div>
    </header>
  );
}
