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
  const decayFrameRef = useRef<number | null>(null);
  const latestPoint = useRef({ x: 0, y: 0 });
  const previousPoint = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastMoveTime = useRef(0);
  const lastDecayTime = useRef(0);
  const motionFocus = useRef(0);
  const targetMotionFocus = useRef(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const setting = useMemo(() => getCameraSetting(cameraSetting), [cameraSetting]);

  const setMotionFocus = useCallback((value: number) => {
    const gallery = galleryRef.current;
    const clampedValue = Math.min(Math.max(value, 0), 1);

    motionFocus.current = clampedValue;
    gallery?.style.setProperty('--motion-focus', clampedValue.toFixed(3));
  }, []);

  const animateMotionFocus = useCallback(() => {
    const now = performance.now();
    const timeSinceMove = now - lastMoveTime.current;
    const delta = Math.min(now - lastDecayTime.current, 50);
    const frameRatio = delta / 16.7;

    lastDecayTime.current = now;

    if (timeSinceMove > 260) {
      const targetDecay = Math.pow(0.985, frameRatio);
      targetMotionFocus.current *= targetDecay;
    }

    const easing = 1 - Math.pow(0.88, frameRatio);
    const nextFocus = motionFocus.current + (targetMotionFocus.current - motionFocus.current) * easing;

    setMotionFocus(nextFocus);

    if (motionFocus.current > 0.004 || targetMotionFocus.current > 0.004) {
      decayFrameRef.current = window.requestAnimationFrame(animateMotionFocus);
      return;
    }

    targetMotionFocus.current = 0;
    setMotionFocus(0);
    decayFrameRef.current = null;
  }, [setMotionFocus]);

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
      const nextPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const now = performance.now();
      const previous = previousPoint.current;

      latestPoint.current = nextPoint;
      lastMoveTime.current = now;

      if (previous) {
        const distance = Math.hypot(nextPoint.x - previous.x, nextPoint.y - previous.y);
        const delta = Math.max(now - previous.time, 8);
        const speed = distance / delta;
        const nextTargetFocus = distance > 0 ? Math.min(Math.max((speed - 0.015) / 0.65, 0.45), 1) : 0;

        targetMotionFocus.current += (nextTargetFocus - targetMotionFocus.current) * 0.55;
      }

      previousPoint.current = { ...nextPoint, time: now };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursor);
      }

      if (decayFrameRef.current === null) {
        lastDecayTime.current = now;
        decayFrameRef.current = window.requestAnimationFrame(animateMotionFocus);
      }
    },
    [animateMotionFocus, updateCursor],
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

      if (decayFrameRef.current !== null) {
        window.cancelAnimationFrame(decayFrameRef.current);
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
      <div className="gallery-layer gallery-layer-full-sharp">
        <PhotoGrid photos={photos} layerLabel="full-sharp" />
      </div>
      <div className="gallery-layer gallery-layer-sharp">
        <PhotoGrid photos={photos} layerLabel="sharp" />
      </div>
      <ViewfinderOverlay />
      {selectedPhoto ? <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} /> : null}
    </main>
  );
}
