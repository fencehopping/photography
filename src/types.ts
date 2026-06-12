export type PhotoCategory =
  | 'Weddings'
  | 'Portraits'
  | 'Families'
  | 'Lifestyle'
  | 'Events';

export type CameraSetting =
  | 'standard'
  | 'black-white'
  | 'contact-sheet'
  | 'high-iso'
  | 'golden-hour'
  | 'cool-editorial'
  | 'soft-focus';

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: PhotoCategory;
  title: string;
  featured: boolean;
  metadata?: {
    location?: string;
    date?: string;
    camera?: string;
    lens?: string;
    cmsAssetId?: string;
  };
}
