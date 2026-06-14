import { photos } from '../content/photos';
import type { Photo, PhotoCategory } from '../types';
import { isSupabaseConfigured, PHOTO_BUCKET, supabase } from './supabase';

export const allCategories = ['Weddings', 'Portraits', 'Families', 'Lifestyle', 'Events'] as const;

export type CategoryFilterValue = 'All' | PhotoCategory;

interface PhotoRow {
  id: string;
  title: string;
  alt: string | null;
  category: string;
  storage_path: string;
  featured: boolean | null;
  location: string | null;
  date: string | null;
  camera: string | null;
  lens: string | null;
  created_at: string;
}

export function getPhotos(): Photo[] {
  return photos;
}

export function getPhotosByCategory(category: CategoryFilterValue): Photo[] {
  if (category === 'All') {
    return getPhotos();
  }

  return photos.filter((photo) => photo.category === category);
}

export function getCategories(): CategoryFilterValue[] {
  return ['All', ...allCategories];
}

export async function getRemoteCategories(): Promise<CategoryFilterValue[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getCategories();
  }

  const { data, error } = await supabase.from('categories').select('name').order('name');

  if (error) {
    console.warn('Falling back to local categories:', error.message);
    return getCategories();
  }

  const categoryNames = data.map(({ name }) => name);
  return ['All', ...categoryNames];
}

export async function getRemotePhotos(category: CategoryFilterValue): Promise<Photo[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getPhotosByCategory(category);
  }

  let query = supabase
    .from('photos')
    .select(
      'id,title,alt,category,storage_path,featured,location,date,camera,lens,created_at',
    )
    .order('created_at', { ascending: false });

  if (category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.warn('Falling back to local photos:', error.message);
    return getPhotosByCategory(category);
  }

  return data.map(mapPhotoRow);
}

function mapPhotoRow(row: PhotoRow): Photo {
  const { data } = supabase!.storage.from(PHOTO_BUCKET).getPublicUrl(row.storage_path);

  return {
    id: row.id,
    src: data.publicUrl,
    alt: row.alt || row.title,
    category: row.category,
    title: row.title,
    featured: Boolean(row.featured),
    metadata: {
      location: row.location ?? undefined,
      date: row.date ?? undefined,
      camera: row.camera ?? undefined,
      lens: row.lens ?? undefined,
      cmsAssetId: row.storage_path,
    },
  };
}
