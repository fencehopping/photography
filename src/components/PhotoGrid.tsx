import type { Photo } from '../types';
import { PhotoTile } from './PhotoTile';

interface PhotoGridProps {
  photos: Photo[];
  layerLabel?: string;
  onPhotoSelect?: (photo: Photo) => void;
}

export function PhotoGrid({ photos, layerLabel, onPhotoSelect }: PhotoGridProps) {
  return (
    <div className="photo-grid" aria-hidden={layerLabel ? true : undefined}>
      {photos.map((photo) => (
        <PhotoTile
          key={`${layerLabel ?? 'base'}-${photo.id}`}
          photo={photo}
          onSelect={layerLabel ? undefined : onPhotoSelect}
        />
      ))}
    </div>
  );
}
