import type { ImageMetadata } from 'astro';
import suneung from '../assets/journal/suneung-exam-room.png';
import qualification from '../assets/journal/qualification-exam-review.png';
import wireless from '../assets/journal/wireless-device-signals.png';

// Illustrative editorial images, shared by each article's Korean and English versions.
export const journalThumbnails: Record<string, ImageMetadata> = {
  'suneung-device-checks-2027': suneung,
  'tax-accountant-exam-ai-cheating': qualification,
  'what-the-app-can-observe': wireless,
};
