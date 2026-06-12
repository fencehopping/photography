import { useMemo, useState } from 'react';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { getPhotosByCategory, type CategoryFilterValue } from './lib/photos';
import type { CameraSetting } from './types';

export default function App() {
  const [category, setCategory] = useState<CategoryFilterValue>('All');
  const [cameraSetting, setCameraSetting] = useState<CameraSetting>('standard');
  const photos = useMemo(() => getPhotosByCategory(category), [category]);

  return (
    <>
      <Header
        category={category}
        cameraSetting={cameraSetting}
        onCategoryChange={setCategory}
        onCameraSettingChange={setCameraSetting}
      />
      <Gallery photos={photos} cameraSetting={cameraSetting} />
      <section id="about" className="about-section" aria-label="About Sara Cohen">
        <p>
          Sara Cohen creates elegant, intimate photography for weddings, portraits, families,
          lifestyle stories, and editorial events.
        </p>
      </section>
    </>
  );
}
