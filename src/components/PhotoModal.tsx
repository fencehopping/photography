import { useEffect, useRef } from 'react';
import type { Photo } from '../types';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="photo-modal" role="dialog" aria-modal="true" aria-label={photo.title}>
      <button className="photo-modal-backdrop" type="button" aria-label="Close photo" onClick={onClose} />
      <div className="photo-modal-panel">
        <button ref={closeButtonRef} className="photo-modal-close" type="button" onClick={onClose}>
          Close
        </button>
        <img className="photo-modal-image" src={photo.src} alt={photo.alt} />
      </div>
    </div>
  );
}
