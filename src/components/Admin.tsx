import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getRemoteCategories, getRemotePhotos } from '../lib/photos';
import { ADMIN_EMAIL, isAdminEmail, isSupabaseConfigured, PHOTO_BUCKET, supabase } from '../lib/supabase';
import type { Photo } from '../types';

export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const isAdmin = useMemo(() => isAdminEmail(session?.user.email), [session]);

  const refreshAdminData = useCallback(async () => {
    const [nextCategories, nextPhotos] = await Promise.all([
      getRemoteCategories(),
      getRemotePhotos('All'),
    ]);
    const categoryNames = nextCategories.filter((item) => item !== 'All');

    setCategories(categoryNames);
    setPhotos(nextPhotos);
    setCategory((current) => current || categoryNames[0] || '');
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void refreshAdminData();
    }
  }, [isAdmin, refreshAdminData]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    if (!isAdminEmail(email)) {
      setMessage(`Only ${ADMIN_EMAIL} can access this admin area.`);
      return;
    }

    setIsBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/`,
      },
    });

    setIsBusy(false);
    setMessage(error ? error.message : 'Check your email for the admin sign-in link.');
  }

  async function handleCategoryCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !newCategory.trim()) {
      return;
    }

    setIsBusy(true);
    setMessage('');

    const name = newCategory.trim();
    const { error } = await supabase.from('categories').insert({ name });

    setIsBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewCategory('');
    setCategory(name);
    await refreshAdminData();
    setMessage(`Added ${name}.`);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !file || !title.trim() || !category) {
      setMessage('Choose an image, title, and category before uploading.');
      return;
    }

    setIsBusy(true);
    setMessage('');

    const storagePath = createStoragePath(file);
    const { error: uploadError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(storagePath, file, { cacheControl: '31536000', upsert: false });

    if (uploadError) {
      setIsBusy(false);
      setMessage(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from('photos').insert({
      title: title.trim(),
      alt: alt.trim() || title.trim(),
      category,
      storage_path: storagePath,
    });

    if (insertError) {
      await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);
      setIsBusy(false);
      setMessage(insertError.message);
      return;
    }

    setTitle('');
    setAlt('');
    setFile(null);
    setIsBusy(false);
    await refreshAdminData();
    setMessage('Image uploaded.');
  }

  async function handleDelete(photo: Photo) {
    if (!supabase || !window.confirm(`Delete "${photo.title}"?`)) {
      return;
    }

    setIsBusy(true);
    setMessage('');

    const storagePath = photo.metadata?.cmsAssetId;
    const { error: deleteError } = await supabase.from('photos').delete().eq('id', photo.id);

    if (deleteError) {
      setIsBusy(false);
      setMessage(deleteError.message);
      return;
    }

    if (storagePath) {
      await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);
    }

    setIsBusy(false);
    await refreshAdminData();
    setMessage('Image deleted.');
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
    setSession(null);
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <h1>Admin setup required</h1>
          <p>Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment first.</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page">
        <form className="admin-panel admin-auth" onSubmit={handleLogin}>
          <h1>Portfolio admin</h1>
          <label>
            Email
            <input value={email} type="email" onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button type="submit" disabled={isBusy}>
            {isBusy ? 'Sending...' : 'Send sign-in link'}
          </button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <h1>Access denied</h1>
          <p>Signed in as {session.user.email}. This admin area is limited to {ADMIN_EMAIL}.</p>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-topbar">
          <div>
            <h1>Portfolio admin</h1>
            <p>{ADMIN_EMAIL}</p>
          </div>
          <a href="/">View site</a>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </header>

        <div className="admin-grid">
          <form className="admin-panel" onSubmit={handleUpload}>
            <h2>Upload image</h2>
            <label>
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label>
              Alt text
              <input value={alt} onChange={(event) => setAlt(event.target.value)} />
            </label>
            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button type="submit" disabled={isBusy || categories.length === 0}>
              Upload
            </button>
          </form>

          <form className="admin-panel" onSubmit={handleCategoryCreate}>
            <h2>Add category</h2>
            <label>
              Name
              <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} />
            </label>
            <button type="submit" disabled={isBusy}>
              Add category
            </button>
          </form>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <section className="admin-panel">
          <h2>Images</h2>
          <div className="admin-photo-list">
            {photos.map((photo) => (
              <article className="admin-photo-row" key={photo.id}>
                <img src={photo.src} alt={photo.alt} />
                <div>
                  <strong>{photo.title}</strong>
                  <span>{photo.category}</span>
                </div>
                <button type="button" disabled={isBusy} onClick={() => void handleDelete(photo)}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function createStoragePath(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${Date.now()}-${safeName || 'portfolio-image'}.${extension}`;
}
