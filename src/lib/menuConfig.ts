export type TitlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface SupplierLogo {
  src: string;
  alt: string;
  href?: string;
}

export interface NavSubItem {
  label: string;
  handle: string;
  icon?: string;
  description?: string;
}

export interface NavCategory {
  label: string;
  handle: string;
  slogan?: string;
  banner?: {
    image?: string;
    titlePosition?: TitlePosition;
    accent?: string;
  };
  supplierLogos?: SupplierLogo[];
  children: NavSubItem[];
}

// Handles marked with TODO(shopify) do not yet map to an existing Shopify
// collection. Confirm the slug with the store admin, or create the collection,
// before this category ships to production.
export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Health & Medical Devices",
    handle: "health-medical-devices", // TODO(shopify)
    slogan: "Trusted devices for home",
    banner: { image: "/images/categories/health-medical-devices.webp", titlePosition: "bottom-left", accent: "#0f766e" },
    children: [
      { label: "Winix - Air Purifiers", handle: "purifiers" },
      { label: "Oxygen", handle: "oxygen" }, // TODO(shopify)
      { label: "LifeVac - Antichocking Device", handle: "lifevac" }, // TODO(shopify)
    ],
  },
  {
    label: "Kybun Shoes & Mats",
    handle: "kybun-shoes",
    slogan: "Walk on air, all day",
    banner: { image: "/images/categories/kybun-shoes.webp", titlePosition: "top-left", accent: "#334155" },
    children: [
      { label: "Men's Shoes", handle: "kybun-mens-shoes" }, // TODO(shopify)
      { label: "Women's Shoes", handle: "kybun-womens-shoes" }, // TODO(shopify)
      { label: "Mats", handle: "kybun-mats" }, // TODO(shopify)
    ],
  },
  {
    label: "Orthopaedics",
    handle: "orthopedic-braces-supports",
    slogan: "Support, relief, recovery",
    banner: { image: "/images/categories/orthopedics.webp", titlePosition: "bottom-left", accent: "#1e3a5f" },
    children: [
      { label: "Neck", handle: "cervical" },
      { label: "Back & Lumbar", handle: "back-lumbar" }, // TODO(shopify) – consolidate: lumbar + trunk-lumbar-supports + thoracic
      { label: "Knee", handle: "knee" },
      { label: "Hip", handle: "hip" },
      { label: "Wrist & Thumb", handle: "wrist-thumb-supports" },
      { label: "Ankle", handle: "ankle" },
      { label: "Elbow", handle: "elbow" },
      { label: "Hand", handle: "hand" },
      { label: "Head", handle: "head" },
    ],
  },
  {
    label: "Home Care & Daily Living",
    handle: "home-care-daily-living", // TODO(shopify)
    slogan: "Independence at home",
    banner: { image: "/images/categories/home-care.webp", titlePosition: "bottom-right", accent: "#7c3aed" },
    children: [
      { label: "Hospital Beds", handle: "hospital-beds" },
      { label: "Bathroom", handle: "bathroom-aids" },
      { label: "Toilet Aids", handle: "toilets-aids" },
      { label: "Decubitus Prevention", handle: "decubitus-aids" },
    ],
  },
  {
    label: "Health & Comfort",
    handle: "health-comfort", // TODO(shopify) – or reuse existing "exercise-and-well-being"
    slogan: "Rest, recover, feel better",
    banner: { image: "/images/categories/health-comfort.webp", titlePosition: "top-right", accent: "#0369a1" },
    children: [
      { label: "Pillows & Cushions", handle: "pillows-and-cushions" },
      { label: "Exercise Equipment", handle: "exercise-equipment" }, // TODO(shopify)
      { label: "Massage Equipment", handle: "massage-equipment" }, // TODO(shopify)
      { label: "Hot & Cold Therapy", handle: "hot-cold-therapy" },
    ],
  },
  {
    label: "Sensory Rooms",
    handle: "sensory-rooms", // TODO(shopify)
    slogan: "Calming spaces, tailored therapy",
    banner: { image: "/images/categories/sensory-rooms.webp", titlePosition: "bottom-left", accent: "#be185d" },
    children: [
      { label: "Products", handle: "sensory-rooms-products" }, // TODO(shopify)
      { label: "Complete Solutions", handle: "sensory-rooms-solutions" }, // TODO(shopify)
    ],
  },
  {
    label: "Lifting Solutions",
    handle: "lifting-solutions", // TODO(shopify)
    slogan: "Safe transfers, accessible homes",
    banner: { image: "/images/categories/lifting-solutions.webp", titlePosition: "bottom-left", accent: "#b45309" },
    children: [
      { label: "Orthostats", handle: "orthostats" }, // TODO(shopify)
      { label: "Patient Lifting Hoists", handle: "patient-lifters-hoists" },
      { label: "Stair Lifts by Lehner", handle: "stair-lifts-lehner" }, // TODO(shopify)
      { label: "Lifting Platforms by Lehner", handle: "lifting-platforms-lehner" }, // TODO(shopify)
    ],
  },
  {
    label: "Walking Aids",
    handle: "walking-aids",
    slogan: "Confident steps, every day",
    banner: { image: "/images/categories/walking-aids.webp", titlePosition: "top-left", accent: "#047857" },
    supplierLogos: [
      { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast", href: "https://www.sponaplast.com" },
      { src: "/images/suppliers/fdi.svg", alt: "FDI" },
      { src: "/images/suppliers/alimed.svg", alt: "AliMed", href: "https://www.alimed.com" },
    ],
    children: [
      { label: "Rollators & Walkers", handle: "rollators" },
      { label: "Crutches", handle: "crutches" },
      { label: "Canes & Walking Sticks", handle: "canes" },
    ],
  },
  {
    label: "Wheelchairs",
    handle: "wheelchairs", // TODO(shopify) – or reuse "wheelchairs-and-home-care-aids"
    slogan: "Mobility without compromise",
    banner: { image: "/images/categories/wheelchairs.webp", titlePosition: "bottom-right", accent: "#374151" },
    children: [
      { label: "Manual Wheelchairs", handle: "manual-wheelchairs" },
      { label: "Electric Wheelchairs", handle: "wheelchairs-1" },
    ],
  },
];

export function findNavCategory(handle: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.handle === handle);
}
