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
  // ── Demo Showcase: Kybun Shoes ──
  kfm2003a: {
    brand: { name: "Kybun", logoUrl: "/product-assets/brands/kybun.svg" },
    sizingGuideHtml: `
      <h3>How to find your perfect size</h3>
      <p>Stand on a piece of paper and trace the outline of your foot. Measure the longest distance from heel to toe in centimeters, then use the chart below.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
        <thead>
          <tr>
            <th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">EU Size</th>
            <th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">Foot Length (cm)</th>
            <th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">US Size</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">39</td><td style="padding:0.5rem;border:1px solid #ddd;">24.5</td><td style="padding:0.5rem;border:1px solid #ddd;">6.5</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">40</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">25.0</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">7</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">41</td><td style="padding:0.5rem;border:1px solid #ddd;">25.5</td><td style="padding:0.5rem;border:1px solid #ddd;">8</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">42</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">26.5</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">8.5</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">43</td><td style="padding:0.5rem;border:1px solid #ddd;">27.0</td><td style="padding:0.5rem;border:1px solid #ddd;">9.5</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">44</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">27.5</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">10</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">45</td><td style="padding:0.5rem;border:1px solid #ddd;">28.5</td><td style="padding:0.5rem;border:1px solid #ddd;">11</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">46</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">29.0</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">12</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">47</td><td style="padding:0.5rem;border:1px solid #ddd;">29.5</td><td style="padding:0.5rem;border:1px solid #ddd;">12.5</td></tr>
        </tbody>
      </table>
      <p style="margin-top:1rem;font-size:0.85rem;color:#888;"><strong>Tip:</strong> If you are between sizes, we recommend choosing the larger size for optimal comfort.</p>
    `,
    financialAssistancePdfUrl: "/product-assets/documents/placeholder.pdf",
    certificateLogos: [
      {
        label: "CE Certified",
        imageUrl: "/product-assets/certificates/ce-mark.svg",
        pdfUrl: "/product-assets/documents/placeholder.pdf",
      },
      {
        label: "Swiss Made",
        imageUrl: "/product-assets/certificates/swiss-made.svg",
        pdfUrl: "/product-assets/documents/placeholder.pdf",
      },
    ],
    woltDeliveryPdfUrl: "/product-assets/documents/placeholder.pdf",
    specifications: [
      { label: "Brand", value: "Kybun" },
      { label: "Model", value: "Airolo Moon Rock M" },
      { label: "Item No.", value: "KFM2003" },
      { label: "Upper Material", value: "Leather and Mesh" },
      { label: "Lining", value: "Microfiber and Mesh" },
      { label: "Insole", value: "Mesh, removable" },
      { label: "Sole", value: "PU, Strato technology" },
      { label: "Weight (per shoe)", value: "~320g (size 42)" },
      { label: "Available Sizes", value: "EU 39 \u2013 49" },
      { label: "Color", value: "Beige / Moon Rock" },
      { label: "Closure", value: "Lace-up" },
      { label: "Origin", value: "Designed in Switzerland" },
      { label: "Medical Device Class", value: "Class I (CE marked)" },
    ],
    infoIcons: [
      { iconUrl: "/product-assets/icons/breathable.svg", label: "Breathable Mesh" },
      { iconUrl: "/product-assets/icons/shock-absorbing.svg", label: "Shock Absorbing" },
      { iconUrl: "/product-assets/icons/lightweight.svg", label: "Lightweight" },
      { iconUrl: "/product-assets/icons/washable.svg", label: "Easy Care" },
      { iconUrl: "/product-assets/icons/ergonomic.svg", label: "Ergonomic Fit" },
      { iconUrl: "/product-assets/icons/swiss-made.svg", label: "Swiss Design" },
    ],
    documents: [
      { title: "Product Brochure", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "Shoe Size Guide", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "Care Instructions", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "CE Declaration of Conformity", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
    ],
    videoUrl: "https://www.youtube.com/embed/Wjy3o0XOIUQ",
    additionalContent: [
      {
        heading: "Kybun Strato Sole Technology",
        html: "<p>The Airolo Moon Rock features Kybun's revolutionary Strato sole technology. Unlike conventional shoes that restrict natural foot movement, the elastic springy sole allows the foot to sink in gently and spring back with every step. This creates a natural, unstable surface that activates muscles, improves posture, and reduces joint strain.</p><p>The multi-layered PU sole provides superior shock absorption while maintaining energy return, making every step feel effortless \u2014 whether you're walking, standing, or on your feet all day.</p>",
        imagePosition: "right",
      },
      {
        heading: "Breathable Comfort for All-Day Wear",
        html: "<p>Designed with a premium leather and mesh upper, the Airolo Moon Rock delivers exceptional breathability. The mesh panels allow continuous airflow to keep your feet cool and dry, while the leather sections provide structure and durability.</p><p>The removable mesh insole adds another layer of comfort and can be replaced with custom orthotics if needed. The microfiber lining wicks moisture away from the skin, preventing odor and maintaining a fresh feel throughout the day.</p>",
        imagePosition: "left",
      },
    ],
    faqs: [
      {
        question: "How do I choose the right size for Kybun shoes?",
        answer: "We recommend measuring your foot length in centimeters and using our sizing guide. Stand on a piece of paper, trace your foot outline, and measure from heel to longest toe. If you're between sizes, choose the larger size. Kybun shoes generally fit true to size, but the unique sole may feel different at first.",
      },
      {
        question: "Is there a break-in period for Kybun shoes?",
        answer: "Yes, we recommend a gradual break-in period of 1\u20132 weeks. Start by wearing them for 1\u20132 hours per day and gradually increase. The soft, elastic sole activates muscles that may not be used in conventional shoes, so your body needs time to adjust. Most people feel the full benefits after 2\u20134 weeks of regular use.",
      },
      {
        question: "How do I care for and clean my Kybun shoes?",
        answer: "Remove the insoles and laces before cleaning. Use a soft brush to remove loose dirt, then wipe with a damp cloth and mild soap. Do not machine wash or tumble dry. Allow shoes to air dry at room temperature, away from direct heat or sunlight. For leather sections, use a suitable leather conditioner periodically.",
      },
      {
        question: "Can I use custom orthotics with Kybun shoes?",
        answer: "Yes, the insole is removable and can be replaced with your own custom orthotics. However, keep in mind that thicker orthotics may change the fit \u2014 in that case, you may want to order a half size larger. We recommend consulting with your orthotist to ensure compatibility with the Kybun sole technology.",
      },
    ],
  },

  // ── Example: Knee Support ──
  sp14029: {
    brand: { name: "Orthohouse", logoUrl: "/product-assets/brands/orthohouse.svg" },
    sizingGuideHtml: `
      <h3>How to measure your knee</h3>
      <p>Measure the circumference of your knee at the widest point while standing with your leg slightly bent.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
        <thead>
          <tr><th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">Size</th><th style="padding:0.5rem;border:1px solid #ddd;background:#1e3a5f;color:#fff;">Circumference (cm)</th></tr>
        </thead>
        <tbody>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">S</td><td style="padding:0.5rem;border:1px solid #ddd;">33\u201336</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">M</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">36\u201339</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;">L</td><td style="padding:0.5rem;border:1px solid #ddd;">39\u201342</td></tr>
          <tr><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">XL</td><td style="padding:0.5rem;border:1px solid #ddd;background:#f8fafc;">42\u201346</td></tr>
        </tbody>
      </table>
    `,
    financialAssistancePdfUrl: "/product-assets/documents/placeholder.pdf",
    certificateLogos: [
      {
        label: "CE Certified",
        imageUrl: "/product-assets/certificates/ce-mark.svg",
        pdfUrl: "/product-assets/documents/placeholder.pdf",
      },
    ],
    woltDeliveryPdfUrl: "/product-assets/documents/placeholder.pdf",
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
      { title: "Product Brochure", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "CE Certificate", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "User Manual", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
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
    brand: { name: "Mobiak", logoUrl: "/product-assets/brands/orthohouse.svg" },
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
        imageUrl: "/product-assets/certificates/ce-mark.svg",
        pdfUrl: "/product-assets/documents/placeholder.pdf",
      },
    ],
    documents: [
      { title: "Product Catalogue", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "CE Certificate", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
      { title: "User Manual", type: "pdf", url: "/product-assets/documents/placeholder.pdf" },
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
