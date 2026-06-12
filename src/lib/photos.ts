import { photos } from '../content/photos';
import type { Photo, PhotoCategory } from '../types';

export const allCategories = ['Weddings', 'Portraits', 'Families', 'Lifestyle', 'Events'] as const;

export type CategoryFilterValue = 'All' | PhotoCategory;

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
