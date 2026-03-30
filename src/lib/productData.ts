export interface ProductExtendedData {
  breadcrumbs?: { label: string; href: string }[];
  brand?: { name: string; logoUrl: string };
  sizingGuideHtml?: string;
  financialAssistancePdfUrl?: string;
  certificateLogos?: { label: string; imageUrl: string; pdfUrl?: string }[];
  woltDeliveryPdfUrl?: string;
  specifications?: { label: string; value: string }[];
  infoIcons?: { iconUrl: string; label: string }[];
  documents?: { title: string; type: string; url: string }[];
  videoUrl?: string;
  additionalContent?: {
    heading?: string;
    html: string;
    imageUrl?: string;
    imagePosition?: "left" | "right";
  }[];
  faqs?: { question: string; answer: string }[];
}

const PRODUCT_DATA: Record<string, ProductExtendedData> = {
  // ── Example: Knee Support ──
  sp14029: {
    brand: { name: "Orthohouse", logoUrl: "/product-assets/brands/orthohouse.png" },
    sizingGuideHtml: `
      <h3>How to measure your knee</h3>
      <p>Measure the circumference of your knee at the widest point while standing with your leg slightly bent.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
        <thead>
          <tr><th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">Size</th><th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">Circumference (cm)</th></tr>
        </thead>
        <tbody>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">S</td><td style="padding:0.5rem;border:1px solid #ddd;">33–36</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">M</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">36–39</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">L</td><td style="padding:0.5rem;border:1px solid #ddd;">39–42</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">XL</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">42–46</td></tr>
        </tbody>
      </table>
    `,
    financialAssistancePdfUrl: "/product-assets/documents/financial-assistance-info.pdf",
    certificateLogos: [
      {
        label: "CE Certified",
        imageUrl: "/product-assets/certificates/ce-mark.png",
        pdfUrl: "/product-assets/documents/ce-certificate-sp14029.pdf",
      },
    ],
    woltDeliveryPdfUrl: "/product-assets/documents/wolt-delivery-info.pdf",
    specifications: [
      { label: "Material", value: "Neoprene with silicone padding" },
      { label: "Side Stabilizers", value: "Yes, bilateral" },
      { label: "Closure", value: "Adjustable velcro straps" },
      { label: "Sizes Available", value: "S, M, L, XL" },
      { label: "Color", value: "Blue / Black" },
      { label: "Weight", value: "250g" },
      { label: "Washable", value: "Hand wash at 30\u00b0C" },
      { label: "Latex Free", value: "Yes" },
    ],
    infoIcons: [
      { iconUrl: "/product-assets/icons/breathable.svg", label: "Breathable" },
      { iconUrl: "/product-assets/icons/stabilizer.svg", label: "Side Stabilizers" },
      { iconUrl: "/product-assets/icons/silicone.svg", label: "Silicone Padding" },
      { iconUrl: "/product-assets/icons/adjustable.svg", label: "Adjustable Fit" },
      { iconUrl: "/product-assets/icons/latex-free.svg", label: "Latex Free" },
      { iconUrl: "/product-assets/icons/washable.svg", label: "Washable" },
    ],
    documents: [
      { title: "Product Brochure", type: "pdf", url: "/product-assets/documents/sp14029-brochure.pdf" },
      { title: "CE Certificate", type: "pdf", url: "/product-assets/documents/ce-certificate-sp14029.pdf" },
      { title: "User Manual", type: "pdf", url: "/product-assets/documents/sp14029-manual.pdf" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    additionalContent: [
      {
        heading: "Enhanced Stability for Knee Support",
        html: "<p>This knee brace is equipped with bilateral side stabilizers, providing substantial support and stability to the knee area. It's particularly effective for individuals who require additional support due to knee pain or instability.</p>",
        imageUrl: "/product-assets/icons/stabilizer.svg",
        imagePosition: "right",
      },
    ],
    faqs: [
      {
        question: "How do I choose the right size?",
        answer: "Measure the circumference of your knee at the widest point while standing. Refer to our sizing guide for the correct size.",
      },
      {
        question: "Can I wash this knee support?",
        answer: "Yes, hand wash at 30\u00b0C with mild soap. Do not bleach or tumble dry. Air dry in shade.",
      },
      {
        question: "Is this product eligible for financial assistance?",
        answer: "Yes, this product may be eligible for financial assistance through government social insurance schemes. Click 'Eligible to Financial Assistance' for more details.",
      },
    ],
  },

  // ── Example: Electric Wheelchair ──
  the158: {
    brand: { name: "Mobiak", logoUrl: "/product-assets/brands/mobiak.png" },
    specifications: [
      { label: "Frame", value: "Foldable aluminium" },
      { label: "Color", value: "Black" },
      { label: "Seat", value: "Upholstered" },
      { label: "Backrest", value: "Foldable, upholstered" },
      { label: "Front Wheels", value: '10" solid' },
      { label: "Rear Wheels", value: '10" offroad parallel' },
      { label: "Max Speed", value: "6km/h" },
      { label: "Range", value: "25km" },
      { label: "Max Incline", value: "10\u00b0" },
      { label: "Motor", value: "200W x 24V x 2 (dual)" },
      { label: "Battery", value: "20Ah x 24V x 1, Li-ion, 6 months" },
      { label: "Charger", value: "29.4V x 4AMP" },
      { label: "Braking", value: "Electromagnetic" },
    ],
    certificateLogos: [
      {
        label: "CE Certified",
        imageUrl: "/product-assets/certificates/ce-mark.png",
        pdfUrl: "/product-assets/documents/ce-certificate-the158.pdf",
      },
    ],
    documents: [
      { title: "Product Catalogue", type: "pdf", url: "/product-assets/documents/the158-catalogue.pdf" },
      { title: "CE Certificate", type: "pdf", url: "/product-assets/documents/ce-certificate-the158.pdf" },
      { title: "User Manual", type: "pdf", url: "/product-assets/documents/the158-manual.pdf" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: [
      {
        question: "What is the maximum weight capacity?",
        answer: "The maximum user weight capacity is 120kg.",
      },
      {
        question: "How long does the battery last?",
        answer: "The battery provides a range of approximately 25km on a single charge, depending on terrain and user weight.",
      },
    ],
  },
};

export function getProductExtendedData(handle: string): ProductExtendedData {
  return PRODUCT_DATA[handle] ?? {};
}
