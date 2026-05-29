import type { Lang } from "../i18n/utils";

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
  labelEl?: string;
  handle: string;
  icon?: string;
  description?: string;
  descriptionEl?: string;
}

export interface NavCategory {
  label: string;
  labelEl?: string;
  handle: string;
  slogan?: string;
  sloganEl?: string;
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
    labelEl: "Ιατρικές Συσκευές Υγείας",
    handle: "health-medical-devices", // TODO(shopify)
    slogan: "Trusted devices for home",
    sloganEl: "Αξιόπιστες συσκευές για το σπίτι",
    banner: { image: "/images/categories/health-medical-devices.webp", titlePosition: "bottom-left", accent: "#0f766e" },
    supplierLogos: [
      { src: "/images/suppliers/winix.svg", alt: "Winix" }, // TODO(content)
      { src: "/images/suppliers/lifevac.svg", alt: "LifeVac" }, // TODO(content)
    ],
    children: [
      { label: "Winix - Air Purifiers", labelEl: "Winix - Καθαριστές Αέρα", handle: "clean-air", icon: "/images/subcategories/air-purifier.svg", description: "True-HEPA air purifiers for home and clinic", descriptionEl: "Καθαριστές αέρα True-HEPA για το σπίτι και την κλινική" },
      { label: "Oxygen", labelEl: "Οξυγόνο", handle: "oxygen-new", icon: "/images/subcategories/oxygen.svg", description: "Concentrators and supplemental oxygen units", descriptionEl: "Συμπυκνωτές και μονάδες συμπληρωματικού οξυγόνου" }, // TODO(shopify)
      { label: "LifeVac - Antichocking Device", labelEl: "LifeVac - Συσκευή Αντιμετώπισης Πνιγμού", handle: "lifevac", icon: "/images/subcategories/lifevac.svg", description: "Non-powered choking rescue device", descriptionEl: "Συσκευή διάσωσης από πνιγμό χωρίς ρεύμα" }, // TODO(shopify)
    ],
  },
  {
    label: "Kybun Shoes & Mats",
    labelEl: "Παπούτσια & Τάπητες Kybun",
    handle: "kybun-shoes",
    slogan: "Walk on air, all day",
    sloganEl: "Περπατήστε στον αέρα, όλη μέρα",
    banner: { image: "/images/categories/kybun-shoes.webp", titlePosition: "top-left", accent: "#334155" },
    supplierLogos: [
      { src: "/images/suppliers/kybun.svg", alt: "kybun" },
    ],
    children: [
      { label: "Men's Shoes", labelEl: "Ανδρικά Παπούτσια", handle: "men-shoes-new", icon: "/images/subcategories/mens-shoes.svg", description: "Air-cushioned men's footwear", descriptionEl: "Ανδρικά παπούτσια με μαξιλάρι αέρα" }, // TODO(shopify)
      { label: "Women's Shoes", labelEl: "Γυναικεία Παπούτσια", handle: "womens-shoes", icon: "/images/subcategories/womens-shoes.svg", description: "Air-cushioned women's footwear", descriptionEl: "Γυναικεία παπούτσια με μαξιλάρι αέρα" }, // TODO(shopify)
      { label: "Mats", labelEl: "Τάπητες", handle: "kybun-mats", icon: "/images/subcategories/mats.svg", description: "Active-standing therapy mats", descriptionEl: "Τάπητες ενεργητικής στάσης για θεραπεία" }, // TODO(shopify)
    ],
  },
  {
    label: "Orthopaedics",
    labelEl: "Ορθοπεδικά",
    handle: "orthopedic-braces-supports",
    slogan: "Support, relief, recovery",
    sloganEl: "Στήριξη, ανακούφιση, αποκατάσταση",
    banner: { image: "/images/categories/orthopedics.webp", titlePosition: "bottom-left", accent: "#1e3a5f" },
    supplierLogos: [
      { src: "/images/suppliers/bauerfeind.svg", alt: "Bauerfeind" }, // TODO(content)
      { src: "/images/suppliers/donjoy.svg", alt: "DonJoy" }, // TODO(content)
      { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast" },
    ],
    children: [
      { label: "Neck", labelEl: "Αυχένας", handle: "neck-collars", icon: "/images/subcategories/neck.svg", description: "Cervical collars and neck supports", descriptionEl: "Αυχενικά κολάρα και στηρίγματα αυχένα" },
      { label: "Back & Lumbar", labelEl: "Πλάτη & Οσφύς", handle: "back-lumbar", icon: "/images/subcategories/back.svg", description: "Lumbar belts and posture braces", descriptionEl: "Οσφυϊκές ζώνες και νάρθηκες στάσης" }, // TODO(shopify) – consolidate
      { label: "Knee", labelEl: "Γόνατο", handle: "knee-new", icon: "/images/subcategories/knee.svg", description: "Knee braces, sleeves, stabilizers", descriptionEl: "Νάρθηκες γόνατος, επιγονατίδες, σταθεροποιητές" },
      { label: "Hip", labelEl: "Ισχίο", handle: "hip-new", icon: "/images/subcategories/hip.svg", description: "Hip braces and post-surgery supports", descriptionEl: "Νάρθηκες ισχίου και μετεγχειρητικά στηρίγματα" },
      { label: "Wrist & Thumb", labelEl: "Καρπός & Αντίχειρας", handle: "wrist-thumb-new", icon: "/images/subcategories/wrist.svg", description: "Wrist splints and thumb stabilizers", descriptionEl: "Νάρθηκες καρπού και σταθεροποιητές αντίχειρα" },
      { label: "Ankle", labelEl: "Αστράγαλος", handle: "ankle-new", icon: "/images/subcategories/ankle.svg", description: "Ankle braces and sprain supports", descriptionEl: "Νάρθηκες αστραγάλου και στηρίγματα για διαστρέμματα" },
      { label: "Elbow", labelEl: "Αγκώνας", handle: "elbow-new", icon: "/images/subcategories/elbow.svg", description: "Elbow braces and tennis-elbow straps", descriptionEl: "Νάρθηκες αγκώνα και ζώνες για επικονδυλίτιδα" },
      { label: "Hand", labelEl: "Χέρι", handle: "hand-new", icon: "/images/subcategories/hand.svg", description: "Hand splints and finger supports", descriptionEl: "Νάρθηκες χεριού και στηρίγματα δακτύλων" },
      { label: "Head", labelEl: "Κεφάλι", handle: "head-new", icon: "/images/subcategories/head.svg", description: "Helmets and protective head supports", descriptionEl: "Κράνη και προστατευτικά στηρίγματα κεφαλιού" },
      { label: "Shoulder", labelEl: "Ώμος", handle: "shoulder", description: "Shoulder braces and immobilizers", descriptionEl: "Νάρθηκες και ακινητοποιητές ώμου" },
      { label: "Thoracic", labelEl: "Θωρακικό", handle: "thoracic", description: "Thoracic spine supports and posture braces", descriptionEl: "Στηρίγματα θωρακικής μοίρας και νάρθηκες στάσης" },
      { label: "Thigh", labelEl: "Μηρός", handle: "thigh", description: "Thigh wraps and supports", descriptionEl: "Στηρίγματα και περιτυλίγματα μηρού" },
      { label: "Insoles", labelEl: "Πάτοι", handle: "orthopedic-insoles", description: "Orthopedic insoles for everyday footwear", descriptionEl: "Ορθοπεδικοί πάτοι για καθημερινά υποδήματα" },
    ],
  },
  {
    label: "Home Care & Daily Living",
    labelEl: "Φροντίδα στο Σπίτι & Καθημερινή Ζωή",
    handle: "home-care-daily-living", // TODO(shopify)
    slogan: "Independence at home",
    sloganEl: "Ανεξαρτησία στο σπίτι",
    banner: { image: "/images/categories/home-care.webp", titlePosition: "bottom-right", accent: "#7c3aed" },
    supplierLogos: [
      { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
      { src: "/images/suppliers/etac.svg", alt: "Etac" }, // TODO(content)
    ],
    children: [
      { label: "Hospital Beds", labelEl: "Νοσοκομειακά Κρεβάτια", handle: "hospital-beds-new", icon: "/images/subcategories/hospital-bed.svg", description: "Adjustable beds for home and care", descriptionEl: "Ρυθμιζόμενα κρεβάτια για το σπίτι και τη φροντίδα" },
      { label: "Bathroom", labelEl: "Μπάνιο", handle: "bathroom-safety", icon: "/images/subcategories/bathroom.svg", description: "Shower seats, grab bars, bath aids", descriptionEl: "Καθίσματα ντους, χειρολαβές, βοηθήματα μπάνιου" },
      { label: "Toilet Aids", labelEl: "Βοηθήματα Τουαλέτας", handle: "toilet-aids", icon: "/images/subcategories/toilet-aids.svg", description: "Raised seats and toilet frames", descriptionEl: "Ανυψωμένα καθίσματα και πλαίσια τουαλέτας" },
      { label: "Decubitus Prevention", labelEl: "Πρόληψη Κατακλίσεων", handle: "decubitus-prevention", icon: "/images/subcategories/decubitus.svg", description: "Pressure-relief mattresses and cushions", descriptionEl: "Στρώματα και μαξιλάρια ανακούφισης πίεσης" },
      { label: "Overbed Tables", labelEl: "Τραπεζάκια Κρεβατιού", handle: "overbed-tables", description: "Adjustable bedside and overbed tables", descriptionEl: "Ρυθμιζόμενα τραπεζάκια κρεβατιού και κομοδίνου" },
    ],
  },
  {
    label: "Health & Comfort",
    labelEl: "Υγεία & Άνεση",
    handle: "health-comfort", // TODO(shopify) – or reuse existing "exercise-and-well-being"
    slogan: "Rest, recover, feel better",
    sloganEl: "Ξεκούραση, αποκατάσταση, ευεξία",
    banner: { image: "/images/categories/health-comfort.webp", titlePosition: "top-right", accent: "#0369a1" },
    supplierLogos: [
      { src: "/images/suppliers/medisana.svg", alt: "Medisana" }, // TODO(content)
      { src: "/images/suppliers/beurer.svg", alt: "Beurer" }, // TODO(content)
    ],
    children: [
      { label: "Pillows & Cushions", labelEl: "Μαξιλάρια & Καθίσματα", handle: "pillows-cushions-new", icon: "/images/subcategories/pillow.svg", description: "Posture and recovery cushions", descriptionEl: "Μαξιλάρια στάσης και αποκατάστασης" },
      { label: "Exercise Equipment", labelEl: "Εξοπλισμός Άσκησης", handle: "exercise-equipment-new", icon: "/images/subcategories/exercise.svg", description: "Rehab and at-home fitness gear", descriptionEl: "Εξοπλισμός αποκατάστασης και γυμναστικής στο σπίτι" }, // TODO(shopify)
      { label: "Massage Equipment", labelEl: "Εξοπλισμός Μασάζ", handle: "massage-new", icon: "/images/subcategories/massage.svg", description: "Handheld and seat massagers", descriptionEl: "Συσκευές μασάζ χειρός και καθίσματος" }, // TODO(shopify)
      { label: "Hot & Cold Therapy", labelEl: "Θεραπεία Ζεστού & Κρύου", handle: "hot-cold-therapy-new", icon: "/images/subcategories/hot-cold.svg", description: "Pain-relief packs and wraps", descriptionEl: "Επιθέματα και περιτυλίγματα ανακούφισης πόνου" },
    ],
  },
  {
    label: "Sensory Rooms",
    labelEl: "Αισθητηριακά Δωμάτια",
    handle: "sensory-rooms", // TODO(shopify)
    slogan: "Calming spaces, tailored therapy",
    sloganEl: "Χώροι ηρεμίας, εξατομικευμένη θεραπεία",
    banner: { image: "/images/categories/sensory-rooms.webp", titlePosition: "bottom-left", accent: "#be185d" },
    supplierLogos: [
      { src: "/images/suppliers/rompa.svg", alt: "Rompa" }, // TODO(content)
    ],
    children: [
      { label: "Products", labelEl: "Προϊόντα", handle: "sensory-rooms-products", icon: "/images/subcategories/sensory-products.svg", description: "Individual sensory components", descriptionEl: "Μεμονωμένα αισθητηριακά εξαρτήματα" }, // TODO(shopify)
      { label: "Complete Solutions", labelEl: "Ολοκληρωμένες Λύσεις", handle: "sensory-rooms-solutions", icon: "/images/subcategories/sensory-solutions.svg", description: "Full sensory-room installations", descriptionEl: "Πλήρεις εγκαταστάσεις αισθητηριακών δωματίων" }, // TODO(shopify)
    ],
  },
  {
    label: "Lifting Solutions",
    labelEl: "Λύσεις Ανύψωσης",
    handle: "lifting-solutions", // TODO(shopify)
    slogan: "Safe transfers, accessible homes",
    sloganEl: "Ασφαλείς μεταφορές, προσβάσιμα σπίτια",
    banner: { image: "/images/categories/lifting-solutions.webp", titlePosition: "bottom-left", accent: "#b45309" },
    supplierLogos: [
      { src: "/images/suppliers/lehner.svg", alt: "Lehner" },
      { src: "/images/suppliers/molift.svg", alt: "Molift" }, // TODO(content)
    ],
    children: [
      { label: "Orthostats", labelEl: "Ορθοστάτες", handle: "orthostats", icon: "/images/subcategories/orthostat.svg", description: "Standing frames for upright therapy", descriptionEl: "Πλαίσια ορθοστασίας για όρθια θεραπεία" }, // TODO(shopify)
      { label: "Patient Lifting Hoists", labelEl: "Γερανοί Ανύψωσης Ασθενών", handle: "patient-lifters-hoists", icon: "/images/subcategories/lifting-hoist.svg", description: "Mobile and ceiling-track hoists", descriptionEl: "Κινητοί γερανοί και γερανοί οροφής" },
      { label: "Stair Lifts by Lehner", labelEl: "Ανελκυστήρες Σκάλας Lehner", handle: "stair-lifts-lehner", icon: "/images/subcategories/stair-lift.svg", description: "Straight and curved stair lifts", descriptionEl: "Ευθείς και καμπύλοι ανελκυστήρες σκάλας" }, // TODO(shopify)
      { label: "Lifting Platforms by Lehner", labelEl: "Πλατφόρμες Ανύψωσης Lehner", handle: "lifting-platforms-lehner", icon: "/images/subcategories/lifting-platform.svg", description: "Vertical home-access platforms", descriptionEl: "Κάθετες πλατφόρμες πρόσβασης σπιτιού" }, // TODO(shopify)
    ],
  },
  {
    label: "Walking Aids",
    labelEl: "Βοηθήματα Βάδισης",
    handle: "walking-aids",
    slogan: "Confident steps, every day",
    sloganEl: "Σίγουρα βήματα, κάθε μέρα",
    banner: { image: "/images/categories/walking-aids.webp", titlePosition: "top-left", accent: "#047857" },
    supplierLogos: [
      { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast", href: "https://www.sponaplast.com" },
      { src: "/images/suppliers/fdi.svg", alt: "FDI" },
      { src: "/images/suppliers/alimed.svg", alt: "AliMed", href: "https://www.alimed.com" },
    ],
    children: [
      { label: "Rollators & Walkers", labelEl: "Περιπατητήρες & Rollators", handle: "rollators-walkers-new", icon: "/images/subcategories/rollators.svg", description: "Wheeled support for confident daily mobility", descriptionEl: "Στήριξη με ρόδες για σίγουρη καθημερινή κίνηση" },
      { label: "Crutches", labelEl: "Πατερίτσες", handle: "crutches-new", icon: "/images/subcategories/crutches.svg", description: "Underarm and forearm crutches for recovery", descriptionEl: "Πατερίτσες μασχάλης και πήχη για αποκατάσταση" },
      { label: "Canes & Walking Sticks", labelEl: "Μπαστούνια & Βακτηρίες", handle: "canes-walking-sticks-new", icon: "/images/subcategories/canes.svg", description: "Lightweight canes for everyday balance", descriptionEl: "Ελαφριά μπαστούνια για καθημερινή ισορροπία" },
    ],
  },
  {
    label: "Wheelchairs",
    labelEl: "Αναπηρικά Αμαξίδια",
    handle: "wheelchairs", // TODO(shopify) – or reuse "wheelchairs-and-home-care-aids"
    slogan: "Mobility without compromise",
    sloganEl: "Κινητικότητα χωρίς συμβιβασμούς",
    banner: { image: "/images/categories/wheelchairs.webp", titlePosition: "bottom-right", accent: "#374151" },
    supplierLogos: [
      { src: "/images/suppliers/permobil.svg", alt: "Permobil" }, // TODO(content)
      { src: "/images/suppliers/ottobock.svg", alt: "Ottobock" }, // TODO(content)
      { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
    ],
    children: [
      { label: "Manual Wheelchairs", labelEl: "Χειροκίνητα Αναπηρικά Αμαξίδια", handle: "manual-wheelchairs-new", icon: "/images/subcategories/manual-wheelchair.svg", description: "Lightweight and transport chairs", descriptionEl: "Ελαφριά αμαξίδια και αμαξίδια μεταφοράς" },
      { label: "Electric Wheelchairs", labelEl: "Ηλεκτρικά Αναπηρικά Αμαξίδια", handle: "electric-wheelchairs-new", icon: "/images/subcategories/electric-wheelchair.svg", description: "Powered indoor and outdoor chairs", descriptionEl: "Ηλεκτρικά αμαξίδια εσωτερικού και εξωτερικού χώρου" },
    ],
  },
];

export function findNavCategory(handle: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.handle === handle);
}

export function getCategoryLabel(cat: NavCategory, lang: Lang): string {
  return lang === "el" && cat.labelEl ? cat.labelEl : cat.label;
}

export function getCategorySlogan(
  cat: NavCategory,
  lang: Lang,
): string | undefined {
  return lang === "el" && cat.sloganEl ? cat.sloganEl : cat.slogan;
}

export function getSubLabel(sub: NavSubItem, lang: Lang): string {
  return lang === "el" && sub.labelEl ? sub.labelEl : sub.label;
}

export function getSubDescription(
  sub: NavSubItem,
  lang: Lang,
): string | undefined {
  return lang === "el" && sub.descriptionEl ? sub.descriptionEl : sub.description;
}
