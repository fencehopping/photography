import type { Photo } from '../types';

interface PhotoTileProps {
  photo: Photo;
  onSelect?: (photo: Photo) => void;
}

export function PhotoTile({ photo, onSelect }: PhotoTileProps) {
  const content = (
    <>
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
      <figcaption>
        <span>{photo.title}</span>
        <span>{photo.category}</span>
      </figcaption>
    </>
  );

  return (
    <figure className={onSelect ? 'photo-tile photo-tile-interactive' : 'photo-tile'}>
      {onSelect ? (
        <button
          className="photo-button"
          type="button"
          aria-label={`Open ${photo.title}`}
          onClick={() => onSelect(photo)}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </figure>
  );
}
