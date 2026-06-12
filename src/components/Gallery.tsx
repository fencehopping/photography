import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCameraSetting } from '../lib/cameraSettings';
import type { CameraSetting, Photo } from '../types';
import { PhotoGrid } from './PhotoGrid';
import { PhotoModal } from './PhotoModal';
import { ViewfinderOverlay } from './ViewfinderOverlay';

interface GalleryProps {
  photos: Photo[];
  cameraSetting: CameraSetting;
}

export function Gallery({ photos, cameraSetting }: GalleryProps) {
  const galleryRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const modalFrameRef = useRef<number | null>(null);
  const latestPoint = useRef({ x: 0, y: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const setting = useMemo(() => getCameraSetting(cameraSetting), [cameraSetting]);

  const updateCursor = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) {
      return;
    }

    gallery.style.setProperty('--cursor-x', `${latestPoint.current.x}px`);
    gallery.style.setProperty('--cursor-y', `${latestPoint.current.y}px`);
    frameRef.current = null;
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const gallery = galleryRef.current;
      if (!gallery || event.pointerType === 'touch') {
        return;
      }

      const rect = gallery.getBoundingClientRect();
      latestPoint.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursor);
      }
    },
    [updateCursor],
  );

  const handlePhotoSelect = useCallback((photo: Photo) => {
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }

    if (modalFrameRef.current !== null) {
      window.cancelAnimationFrame(modalFrameRef.current);
    }

    setIsFlashing(true);
    modalFrameRef.current = window.requestAnimationFrame(() => {
      setSelectedPhoto(photo);
      modalFrameRef.current = null;
    });

    flashTimerRef.current = window.setTimeout(() => {
      setIsFlashing(false);
      flashTimerRef.current = null;
    }, 520);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }

      if (modalFrameRef.current !== null) {
        window.cancelAnimationFrame(modalFrameRef.current);
      }
    };
  }, []);

  return (
    <main
      ref={galleryRef}
      className={`gallery ${setting.className}${isFlashing ? ' is-flashing' : ''}`}
      onPointerMove={handlePointerMove}
      aria-label="Photography portfolio"
    >
      <div className="gallery-layer gallery-layer-blur">
        <PhotoGrid photos={photos} onPhotoSelect={handlePhotoSelect} />
      </div>
      <div className="gallery-layer gallery-layer-sharp">
        <PhotoGrid photos={photos} layerLabel="sharp" />
      </div>
      <ViewfinderOverlay />
      {selectedPhoto ? <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} /> : null}
    </main>
  );
}
