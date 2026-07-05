export const CATEGORIES = [
  "Amplifiers",
  "Speaker Cabinets",
  "Cables",
  "Strings",
  "Straps",
  "Accessories",
  "Merch",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Categories shown in the dedicated "Amps & Cabs" section (not the gear grid). */
export const AMP_CATEGORIES: readonly Category[] = [
  "Amplifiers",
  "Speaker Cabinets",
];

export const STATUSES = [
  "In stock",
  "Low stock",
  "Sold out",
  "Special order",
] as const;
export type Status = (typeof STATUSES)[number];

export const MEDIA_KINDS = ["photo", "video_file", "youtube", "vimeo"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export interface Luthier {
  id: string;
  name: string;
  town: string;
  county: string;
  badge: string | null;
  bio: string;
  specialties: string[];
  sort_order: number;
  created_at: string;
}

export interface LuthierMedia {
  id: string;
  luthier_id: string;
  kind: MediaKind;
  storage_path: string | null;
  external_id: string | null;
  alt_text: string;
  sort_order: number;
}

export interface LuthierWithMedia extends Luthier {
  media: LuthierMedia[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  status: Status;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface ProductPhoto {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
}

export interface ProductWithPhotos extends Product {
  photos: ProductPhoto[];
}

/** Media item as edited in admin forms (not yet persisted). */
export interface MediaInput {
  kind: MediaKind;
  storage_path: string | null;
  external_id: string | null;
  alt_text: string;
}

export interface PhotoInput {
  storage_path: string;
  alt_text: string;
}

export const SITE = {
  name: "Onslow Guitar Co.",
  tagline: "Handbuilt Instruments · Jacksonville, NC",
  address: {
    street: "212 Court Street",
    city: "Jacksonville",
    state: "NC",
    zip: "28540",
  },
  phone: "(910) 555-0164",
  phoneHref: "+19105550164",
  email: "hello@onslowguitar.co",
  hours: [
    { days: "Tue – Fri", open: "10 am – 6 pm" },
    { days: "Saturday", open: "10 am – 4 pm" },
    { days: "Sun – Mon", open: "Closed" },
  ],
} as const;
