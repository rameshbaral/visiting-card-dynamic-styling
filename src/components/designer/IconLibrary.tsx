import React from "react";

export interface IconDefinition {
  id: string;
  name: string;
  category: string;
  svg: string;
  keywords: string[];
}

// Comprehensive icon library for business cards
export const iconLibrary: IconDefinition[] = [
  // Contact Icons
  {
    id: "phone",
    name: "Phone",
    category: "contact",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
    keywords: ["phone", "call", "contact", "telephone"],
  },
  {
    id: "email",
    name: "Email",
    category: "contact",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    keywords: ["email", "mail", "contact", "message"],
  },
  {
    id: "location",
    name: "Location",
    category: "contact",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    keywords: ["location", "address", "map", "place"],
  },
  {
    id: "website",
    name: "Website",
    category: "contact",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    keywords: ["website", "web", "internet", "url", "link"],
  },

  // Social Media Icons
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    keywords: ["linkedin", "social", "professional", "network"],
  },
  {
    id: "twitter",
    name: "Twitter",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
    keywords: ["twitter", "social", "tweet", "x"],
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    keywords: ["instagram", "social", "photo", "insta"],
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    keywords: ["facebook", "social", "fb"],
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "social",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    keywords: ["youtube", "social", "video", "yt"],
  },

  // Business Icons
  {
    id: "building",
    name: "Building",
    category: "business",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
    keywords: ["building", "office", "company", "business"],
  },
  {
    id: "briefcase",
    name: "Briefcase",
    category: "business",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 16V8h4v8h-4zm10-9h-4.35c-.54 0-.98.44-.98.98V16h2v-6h2v6h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-16 0c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2v-6h2v6h2V7.98c0-.54-.44-.98-.98-.98H4z"/></svg>`,
    keywords: ["briefcase", "work", "business", "job"],
  },
  {
    id: "handshake",
    name: "Handshake",
    category: "business",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.83 8.6l-.66-.66c-.42-.42-.42-1.1 0-1.52l.66-.66c.42-.42 1.1-.42 1.52 0l.66.66c.42.42.42 1.1 0 1.52l-.66.66c-.42.42-1.1.42-1.52 0zm6.78-4.5c-.19-.19-.51-.19-.71 0l-1.06 1.06c-.19.19-.19.51 0 .71l.35.35c.19.19.19.51 0 .71l-2.12 2.12c-.19.19-.51.19-.71 0l-.35-.35c-.19-.19-.51-.19-.71 0L12.24 9.7c-.19.19-.19.51 0 .71l.35.35c.19.19.19.51 0 .71l-1.06 1.06c-.19.19-.19.51 0 .71l.35.35c.19.19.51.19.71 0l1.06-1.06c.19-.19.51-.19.71 0l.35.35c.19.19.51.19.71 0l2.12-2.12c.19-.19.19-.51 0-.71l-.35-.35c-.19-.19-.19-.51 0-.71l1.06-1.06c.19-.19.19-.51 0-.71l-.36-.35z"/></svg>`,
    keywords: ["handshake", "partnership", "deal", "agreement"],
  },

  // Technology Icons
  {
    id: "laptop",
    name: "Laptop",
    category: "technology",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
    keywords: ["laptop", "computer", "technology", "work"],
  },
  {
    id: "smartphone",
    name: "Smartphone",
    category: "technology",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`,
    keywords: ["smartphone", "mobile", "phone", "device"],
  },
  {
    id: "wifi",
    name: "WiFi",
    category: "technology",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>`,
    keywords: ["wifi", "internet", "connection", "wireless"],
  },

  // Creative Icons
  {
    id: "palette",
    name: "Palette",
    category: "creative",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 .83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-5.52-4.48-10-10-10z"/></svg>`,
    keywords: ["palette", "art", "design", "creative", "color"],
  },
  {
    id: "camera",
    name: "Camera",
    category: "creative",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2l-1 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-4l-1-2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`,
    keywords: ["camera", "photo", "photography", "picture"],
  },

  // Service Icons
  {
    id: "support",
    name: "Support",
    category: "service",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z"/></svg>`,
    keywords: ["support", "help", "headset", "service", "customer"],
  },
  {
    id: "star",
    name: "Star",
    category: "service",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    keywords: ["star", "rating", "quality", "favorite", "premium"],
  },

  // Transportation Icons
  {
    id: "car",
    name: "Car",
    category: "transportation",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
    keywords: ["car", "vehicle", "transportation", "auto"],
  },
  {
    id: "delivery",
    name: "Delivery",
    category: "transportation",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/><circle cx="17" cy="17" r="2"/></svg>`,
    keywords: ["delivery", "truck", "shipping", "logistics"],
  },
];

// Group icons by category
export const iconCategories = {
  contact: iconLibrary.filter((icon) => icon.category === "contact"),
  social: iconLibrary.filter((icon) => icon.category === "social"),
  business: iconLibrary.filter((icon) => icon.category === "business"),
  technology: iconLibrary.filter((icon) => icon.category === "technology"),
  creative: iconLibrary.filter((icon) => icon.category === "creative"),
  service: iconLibrary.filter((icon) => icon.category === "service"),
  transportation: iconLibrary.filter(
    (icon) => icon.category === "transportation"
  ),
};

interface IconDisplayProps {
  icon: IconDefinition;
  size?: number;
  color?: string;
  className?: string;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({
  icon,
  size = 24,
  color = "currentColor",
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color }}
      dangerouslySetInnerHTML={{
        __html: icon.svg.replace('fill="currentColor"', `fill="${color}"`),
      }}
    />
  );
};

export default iconLibrary;
