import { useEffect, useState } from 'react';
import { Admin } from './components/Admin';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import {
  getCategories,
  getPhotosByCategory,
  getRemoteCategories,
  getRemotePhotos,
  type CategoryFilterValue,
} from './lib/photos';
import type { CameraSetting, Photo } from './types';

const hireCategories = [
  {
    name: 'Weddings',
    description: 'Documentary coverage for ceremonies, celebrations, portraits, and the quiet in-between moments.',
  },
  {
    name: 'Portraits',
    description: 'Natural portraits for individuals, couples, creatives, and personal branding sessions.',
  },
  {
    name: 'Families',
    description: 'Relaxed family sessions built around connection, movement, and familiar places.',
  },
  {
    name: 'Lifestyle',
    description: 'Editorial-feeling imagery for homes, makers, small brands, and everyday stories.',
  },
  {
    name: 'Events',
    description: 'Atmospheric coverage for gatherings, launches, dinners, performances, and community moments.',
  },
];

export default function App() {
  const [category, setCategory] = useState<CategoryFilterValue>('All');
  const [cameraSetting, setCameraSetting] = useState<CameraSetting>('standard');
  const [categories, setCategories] = useState<CategoryFilterValue[]>(getCategories());
  const [photos, setPhotos] = useState<Photo[]>(getPhotosByCategory('All'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      return;
    }

    let isMounted = true;

    async function loadGallery() {
      setIsLoading(true);
      const [nextCategories, nextPhotos] = await Promise.all([
        getRemoteCategories(),
        getRemotePhotos(category),
      ]);

      if (!isMounted) {
        return;
      }

      setCategories(nextCategories);
      setPhotos(nextPhotos);
      setIsLoading(false);
    }

    void loadGallery();

    return () => {
      isMounted = false;
    };
  }, [category]);

  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return (
    <>
      <Header
        categories={categories}
        category={category}
        cameraSetting={cameraSetting}
        onCategoryChange={setCategory}
        onCameraSettingChange={setCameraSetting}
      />
      {isLoading ? <div className="gallery-status">Loading portfolio...</div> : null}
      <Gallery photos={photos} cameraSetting={cameraSetting} />
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <div className="section-shell">
          <div className="section-intro">
            <span className="section-kicker">Available for hire</span>
            <h2 id="about-heading">Photography for personal milestones and considered stories.</h2>
            <p>
              Sarah Cronin creates elegant, intimate photography across the South Shore and beyond,
              with a calm documentary approach and a polished editorial eye.
            </p>
          </div>
          <div className="hire-grid">
            {hireCategories.map((item) => (
              <article className="hire-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="contact-section" aria-labelledby="contact-heading">
        <div className="section-shell contact-shell">
          <div className="section-intro">
            <span className="section-kicker">Start a conversation</span>
            <h2 id="contact-heading">Tell Sarah what you are planning.</h2>
            <p>
              Share a few details about the session, timing, and location. She will follow up with
              availability and next steps.
            </p>
          </div>
          <form className="contact-form" action="mailto:sara@example.com" method="post" encType="text/plain">
            <label>
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>Photography type</span>
              <select name="photographyType" defaultValue="" required>
                <option value="" disabled>
                  Select a category
                </option>
                {hireCategories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Date or season</span>
              <input name="date" type="text" placeholder="Fall 2026, June 14, flexible..." />
            </label>
            <label className="contact-form-wide">
              <span>Message</span>
              <textarea name="message" rows={5} required />
            </label>
            <button type="submit">Send inquiry</button>
          </form>
        </div>
      </section>
    </>
  );
}
