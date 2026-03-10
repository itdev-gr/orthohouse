export interface NavSubItem {
  label: string;
  handle: string;
}

export interface NavCategory {
  label: string;
  handle: string;
  children: NavSubItem[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Orthopaedics",
    handle: "orthopedic-braces-supports",
    children: [
      { label: "Hip", handle: "hip" },
      { label: "Head", handle: "head" },
      { label: "Lumbar", handle: "lumbar" },
      { label: "Neck", handle: "cervical" },
      { label: "Knee", handle: "knee" },
      { label: "Hand", handle: "hand" },
      { label: "Fingers", handle: "fingers" },
      { label: "Elbow", handle: "elbow" },
      { label: "Shoulder", handle: "shoulder" },
      { label: "Foot", handle: "foot" },
      { label: "Calf", handle: "calf" },
      { label: "Thigh", handle: "thigh" },
      { label: "Thoracic", handle: "thoracic" },
      { label: "Ankle", handle: "ankle" },
      { label: "Lower Limb", handle: "lower-limb" },
      { label: "Upper Limb", handle: "upper-limb" },
      { label: "Trunk & Lumbar", handle: "trunk-lumbar-supports" },
      { label: "Wrist & Thumb", handle: "wrist-thumb-supports" },
      { label: "Knee Braces", handle: "knee-braces" },
      { label: "Orthopedic Insoles", handle: "orthopedic-insoles" },
    ],
  },
  {
    label: "Walking Aids",
    handle: "walking-aids",
    children: [
      { label: "Canes & Walking Sticks", handle: "canes" },
      { label: "Rollators & Walkers", handle: "rollators" },
      { label: "Walking Frames", handle: "walkers" },
      { label: "Crutches", handle: "crutches" },
    ],
  },
  {
    label: "Wheelchairs & Home Care",
    handle: "wheelchairs-and-home-care-aids",
    children: [
      { label: "Manual Wheelchairs", handle: "manual-wheelchairs" },
      { label: "Electric Wheelchairs", handle: "wheelchairs-1" },
      { label: "Wheelchair", handle: "wheelchair" },
      { label: "Hospital Beds", handle: "hospital-beds" },
      { label: "Patient Lifters & Hoists", handle: "patient-lifters-hoists" },
      { label: "Bathroom Safety", handle: "bathroom-aids" },
      { label: "Toilet Aids", handle: "toilets-aids" },
    ],
  },
  {
    label: "Comfort & Well Being",
    handle: "exercise-and-well-being",
    children: [
      { label: "Pillows & Cushions", handle: "pillows-and-cushions" },
      { label: "Orthopedic Mattresses", handle: "orthopedic-mattresses" },
      { label: "Orthopedic Pillows", handle: "orthopedic-pillows" },
      { label: "Seat Cushions", handle: "seat-cushion" },
      { label: "Cushions & Seat Supports", handle: "cushions-seat-supports" },
      { label: "Hot & Cold Therapy", handle: "hot-cold-therapy" },
      { label: "Exercise Bands & Balls", handle: "exercise-bands-balls" },
      { label: "Decubitus Aids", handle: "decubitus-aids" },
      { label: "Purifiers", handle: "purifiers" },
    ],
  },
  {
    label: "Kybun Shoes",
    handle: "kybun-shoes",
    children: [],
  },
];
