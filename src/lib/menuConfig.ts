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
    supplierLogos: [
      { src: "/images/suppliers/winix.svg", alt: "Winix" }, // TODO(content)
      { src: "/images/suppliers/lifevac.svg", alt: "LifeVac" }, // TODO(content)
    ],
    children: [
      { label: "Winix - Air Purifiers", handle: "purifiers", icon: "/images/subcategories/air-purifier.svg", description: "True-HEPA air purifiers for home and clinic" },
      { label: "Oxygen", handle: "oxygen", icon: "/images/subcategories/oxygen.svg", description: "Concentrators and supplemental oxygen units" }, // TODO(shopify)
      { label: "LifeVac - Antichocking Device", handle: "lifevac", icon: "/images/subcategories/lifevac.svg", description: "Non-powered choking rescue device" }, // TODO(shopify)
    ],
  },
  {
    label: "Kybun Shoes & Mats",
    handle: "kybun-shoes",
    slogan: "Walk on air, all day",
    banner: { image: "/images/categories/kybun-shoes.webp", titlePosition: "top-left", accent: "#334155" },
    supplierLogos: [
      { src: "/images/suppliers/kybun.svg", alt: "kybun" },
    ],
    children: [
      { label: "Men's Shoes", handle: "kybun-mens-shoes", icon: "/images/subcategories/mens-shoes.svg", description: "Air-cushioned men's footwear" }, // TODO(shopify)
      { label: "Women's Shoes", handle: "kybun-womens-shoes", icon: "/images/subcategories/womens-shoes.svg", description: "Air-cushioned women's footwear" }, // TODO(shopify)
      { label: "Mats", handle: "kybun-mats", icon: "/images/subcategories/mats.svg", description: "Active-standing therapy mats" }, // TODO(shopify)
    ],
  },
  {
    label: "Orthopaedics",
    handle: "orthopedic-braces-supports",
    slogan: "Support, relief, recovery",
    banner: { image: "/images/categories/orthopedics.webp", titlePosition: "bottom-left", accent: "#1e3a5f" },
    supplierLogos: [
      { src: "/images/suppliers/bauerfeind.svg", alt: "Bauerfeind" }, // TODO(content)
      { src: "/images/suppliers/donjoy.svg", alt: "DonJoy" }, // TODO(content)
      { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast" },
    ],
    children: [
      { label: "Neck", handle: "cervical", icon: "/images/subcategories/neck.svg", description: "Cervical collars and neck supports" },
      { label: "Back & Lumbar", handle: "back-lumbar", icon: "/images/subcategories/back.svg", description: "Lumbar belts and posture braces" }, // TODO(shopify) – consolidate
      { label: "Knee", handle: "knee", icon: "/images/subcategories/knee.svg", description: "Knee braces, sleeves, stabilizers" },
      { label: "Hip", handle: "hip", icon: "/images/subcategories/hip.svg", description: "Hip braces and post-surgery supports" },
      { label: "Wrist & Thumb", handle: "wrist-thumb-supports", icon: "/images/subcategories/wrist.svg", description: "Wrist splints and thumb stabilizers" },
      { label: "Ankle", handle: "ankle", icon: "/images/subcategories/ankle.svg", description: "Ankle braces and sprain supports" },
      { label: "Elbow", handle: "elbow", icon: "/images/subcategories/elbow.svg", description: "Elbow braces and tennis-elbow straps" },
      { label: "Hand", handle: "hand", icon: "/images/subcategories/hand.svg", description: "Hand splints and finger supports" },
      { label: "Head", handle: "head", icon: "/images/subcategories/head.svg", description: "Helmets and protective head supports" },
    ],
  },
  {
    label: "Home Care & Daily Living",
    handle: "home-care-daily-living", // TODO(shopify)
    slogan: "Independence at home",
    banner: { image: "/images/categories/home-care.webp", titlePosition: "bottom-right", accent: "#7c3aed" },
    supplierLogos: [
      { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
      { src: "/images/suppliers/etac.svg", alt: "Etac" }, // TODO(content)
    ],
    children: [
      { label: "Hospital Beds", handle: "hospital-beds", icon: "/images/subcategories/hospital-bed.svg", description: "Adjustable beds for home and care" },
      { label: "Bathroom", handle: "bathroom-aids", icon: "/images/subcategories/bathroom.svg", description: "Shower seats, grab bars, bath aids" },
      { label: "Toilet Aids", handle: "toilets-aids", icon: "/images/subcategories/toilet-aids.svg", description: "Raised seats and toilet frames" },
      { label: "Decubitus Prevention", handle: "decubitus-aids", icon: "/images/subcategories/decubitus.svg", description: "Pressure-relief mattresses and cushions" },
    ],
  },
  {
    label: "Health & Comfort",
    handle: "health-comfort", // TODO(shopify) – or reuse existing "exercise-and-well-being"
    slogan: "Rest, recover, feel better",
    banner: { image: "/images/categories/health-comfort.webp", titlePosition: "top-right", accent: "#0369a1" },
    supplierLogos: [
      { src: "/images/suppliers/medisana.svg", alt: "Medisana" }, // TODO(content)
      { src: "/images/suppliers/beurer.svg", alt: "Beurer" }, // TODO(content)
    ],
    children: [
      { label: "Pillows & Cushions", handle: "pillows-and-cushions", icon: "/images/subcategories/pillow.svg", description: "Posture and recovery cushions" },
      { label: "Exercise Equipment", handle: "exercise-equipment", icon: "/images/subcategories/exercise.svg", description: "Rehab and at-home fitness gear" }, // TODO(shopify)
      { label: "Massage Equipment", handle: "massage-equipment", icon: "/images/subcategories/massage.svg", description: "Handheld and seat massagers" }, // TODO(shopify)
      { label: "Hot & Cold Therapy", handle: "hot-cold-therapy", icon: "/images/subcategories/hot-cold.svg", description: "Pain-relief packs and wraps" },
    ],
  },
  {
    label: "Sensory Rooms",
    handle: "sensory-rooms", // TODO(shopify)
    slogan: "Calming spaces, tailored therapy",
    banner: { image: "/images/categories/sensory-rooms.webp", titlePosition: "bottom-left", accent: "#be185d" },
    supplierLogos: [
      { src: "/images/suppliers/rompa.svg", alt: "Rompa" }, // TODO(content)
    ],
    children: [
      { label: "Products", handle: "sensory-rooms-products", icon: "/images/subcategories/sensory-products.svg", description: "Individual sensory components" }, // TODO(shopify)
      { label: "Complete Solutions", handle: "sensory-rooms-solutions", icon: "/images/subcategories/sensory-solutions.svg", description: "Full sensory-room installations" }, // TODO(shopify)
    ],
  },
  {
    label: "Lifting Solutions",
    handle: "lifting-solutions", // TODO(shopify)
    slogan: "Safe transfers, accessible homes",
    banner: { image: "/images/categories/lifting-solutions.webp", titlePosition: "bottom-left", accent: "#b45309" },
    supplierLogos: [
      { src: "/images/suppliers/lehner.svg", alt: "Lehner" },
      { src: "/images/suppliers/molift.svg", alt: "Molift" }, // TODO(content)
    ],
    children: [
      { label: "Orthostats", handle: "orthostats", icon: "/images/subcategories/orthostat.svg", description: "Standing frames for upright therapy" }, // TODO(shopify)
      { label: "Patient Lifting Hoists", handle: "patient-lifters-hoists", icon: "/images/subcategories/lifting-hoist.svg", description: "Mobile and ceiling-track hoists" },
      { label: "Stair Lifts by Lehner", handle: "stair-lifts-lehner", icon: "/images/subcategories/stair-lift.svg", description: "Straight and curved stair lifts" }, // TODO(shopify)
      { label: "Lifting Platforms by Lehner", handle: "lifting-platforms-lehner", icon: "/images/subcategories/lifting-platform.svg", description: "Vertical home-access platforms" }, // TODO(shopify)
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
      { label: "Rollators & Walkers", handle: "rollators", icon: "/images/subcategories/rollators.svg", description: "Wheeled support for confident daily mobility" },
      { label: "Crutches", handle: "crutches", icon: "/images/subcategories/crutches.svg", description: "Underarm and forearm crutches for recovery" },
      { label: "Canes & Walking Sticks", handle: "canes", icon: "/images/subcategories/canes.svg", description: "Lightweight canes for everyday balance" },
    ],
  },
  {
    label: "Wheelchairs",
    handle: "wheelchairs", // TODO(shopify) – or reuse "wheelchairs-and-home-care-aids"
    slogan: "Mobility without compromise",
    banner: { image: "/images/categories/wheelchairs.webp", titlePosition: "bottom-right", accent: "#374151" },
    supplierLogos: [
      { src: "/images/suppliers/permobil.svg", alt: "Permobil" }, // TODO(content)
      { src: "/images/suppliers/ottobock.svg", alt: "Ottobock" }, // TODO(content)
      { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
    ],
    children: [
      { label: "Manual Wheelchairs", handle: "manual-wheelchairs", icon: "/images/subcategories/manual-wheelchair.svg", description: "Lightweight and transport chairs" },
      { label: "Electric Wheelchairs", handle: "wheelchairs-1", icon: "/images/subcategories/electric-wheelchair.svg", description: "Powered indoor and outdoor chairs" },
    ],
  },
];

export function findNavCategory(handle: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.handle === handle);
}
