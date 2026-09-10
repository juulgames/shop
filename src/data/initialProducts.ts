import { Product, StoreSettings, Filament } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "juuls3dexpress",
  tagline: "Precision 3D printed models, articulated dragons, gaming gear & custom maker prints.",
  currencySymbol: "$",
  currencyCode: "USD",
  supportEmail: "orders@juuls3dexpress.com",
  bannerNotice: "⚡ Express Dispatch: Most 3D prints ship within 24-48 hours • Free Delivery",
  logoUrl: "/icon.jpg",
  paypalUsernameOrEmail: "paypal.me/juuls3dexpress",
  freeShippingThreshold: 45,
  leadTimeDays: 1,
  customDomain: "juuls3dexpress.com",
  accessGate: {
    enabled: true,
    storePassword: "juuls3dexpress",
    allowLocationAccess: true,
    locationType: 'radius',
    workshopCity: "Local Service Zone",
    workshopLat: 52.0,
    workshopLng: 5.0,
    radiusKm: 50,
    allowedPostalCodes: ["1000", "2000", "90210"],
    allowedCity: "Local Service City",
    allowedCountry: "NL",
    headline: "Juuls 3D Express — Member & Local Access",
    subheadline: "This 3D print workshop is private: access is unlocked with your store password or if you reside in our local printing & delivery zone.",
  },
  adminPin: "1234",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "3d-1",
    title: "Articulated Crystal Dragon (Silk Rainbow)",
    description: "Multi-jointed flexible crystal dragon printed in premium dual-color silk PLA. Features fully fluid body segments, crystal spikes along the spine, and posable claws. Zero assembly required.",
    price: 32,
    category: "Articulated & Fidgets",
    imageUrl: "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800&auto=format&fit=crop&q=80",
    inventory: 15,
    material: "Silk Multi-Color PLA",
    colorOptions: ["Rainbow Shift", "Galaxy Purple", "Emerald & Gold", "Obsidian Black"],
    dimensions: "45 cm (17.7 in) length",
    printTimeHours: 16,
    badge: "Bestseller",
    rating: 5.0,
    reviewsCount: 68,
    createdAt: "2026-02-01T10:00:00Z"
  },
  {
    id: "3d-2",
    title: "Low-Poly Geometric Succulent Planter",
    description: "Modern architectural faceted desktop planter with internal hidden drainage insert and matching drip tray. Printed in durable matte stone composite PLA with zero layer defects.",
    price: 24,
    category: "Home & Desk Decor",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
    inventory: 22,
    material: "Matte Stone PLA",
    colorOptions: ["Marble White", "Concrete Gray", "Matte Terracotta", "Sage Green"],
    dimensions: "11 × 11 × 9.5 cm",
    printTimeHours: 7,
    badge: "Popular",
    rating: 4.9,
    reviewsCount: 41,
    createdAt: "2026-02-05T12:00:00Z"
  },
  {
    id: "3d-3",
    title: "Under-Desk Headphone & Controller Mount",
    description: "High-load structural mount designed for mechanical stability. Features an arched silicone-safe headphone rest and front hook for braided cables or a gaming controller. Includes mounting screws and heavy-duty 3M VHB tape.",
    price: 19,
    category: "Gaming & Setup",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    inventory: 35,
    material: "Heavy-Duty PETG (100% Solid Core)",
    colorOptions: ["Stealth Matte Black", "Cyber Cyan", "Signal Orange", "Frost White"],
    dimensions: "12 × 8 × 6 cm",
    printTimeHours: 5,
    badge: "Essential",
    rating: 4.8,
    reviewsCount: 53,
    createdAt: "2026-02-10T14:00:00Z"
  },
  {
    id: "3d-4",
    title: "Mechanical Iris Aperture Fidget Box",
    description: "Precision-engineered interlocking 8-blade aperture mechanism. Twist the knurled outer ring clockwise to smoothly retract the blades and reveal the inner storage capsule for rings, dice, or SD cards.",
    price: 28,
    category: "Mechanical & Gadgets",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    inventory: 14,
    material: "Precision Tough PLA",
    colorOptions: ["Gunmetal & Copper", "Black & Gold", "Electric Blue & Silver"],
    dimensions: "8.5 cm diameter × 4 cm height",
    printTimeHours: 11,
    badge: "Satisfying",
    rating: 5.0,
    reviewsCount: 39,
    createdAt: "2026-02-15T09:00:00Z"
  },
  {
    id: "3d-5",
    title: "Spiral Castle Dice Roller Tower",
    description: "Compact medieval fantasy fortress with an internal spiral tumbling staircase that guarantees randomized, fair dice rolls every throw. Features a walled catch tray with velvet-dampened bottom.",
    price: 38,
    category: "Gaming & Setup",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    inventory: 8,
    material: "Textured Basalt PLA",
    colorOptions: ["Aged Stone Gray", "Dungeon Moss Green", "Burnt Bronze"],
    dimensions: "18 cm height × 12 cm base",
    printTimeHours: 19,
    badge: "Tabletop Gear",
    rating: 4.9,
    reviewsCount: 27,
    createdAt: "2026-02-20T16:00:00Z"
  },
  {
    id: "3d-6",
    title: "Cyberpunk Low-Poly Skull Headphone Stand",
    description: "Full-scale geometric skull sculpt balanced to comfortably display gaming headsets and studio monitoring cans without stretching the headband. Heavy 25% gyroid infill base prevents tipping.",
    price: 44,
    category: "Gaming & Setup",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    inventory: 6,
    material: "Silk Carbon Fiber PLA",
    colorOptions: ["Silk Silver", "Matte Carbon Black", "Neon Cyber Purple"],
    dimensions: "24 cm height × 16 cm depth",
    printTimeHours: 26,
    badge: "Showstopper",
    rating: 5.0,
    reviewsCount: 19,
    createdAt: "2026-02-25T11:00:00Z"
  },
  {
    id: "3d-7",
    title: "Articulated Pocket Slug Sensory Fidget (Pack of 2)",
    description: "Ultra-flexible, soothing desk toy made from concentric interlocking arcs. Emits a gentle ASMR clack when wiggled and conforms comfortably to hands for tactile stress relief.",
    price: 15,
    category: "Articulated & Fidgets",
    imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd74b0ae?w=800&auto=format&fit=crop&q=80",
    inventory: 40,
    material: "Eco-Friendly PLA+",
    colorOptions: ["Glow in the Dark", "Pastel Rainbow", "Aqua Blue", "Lava Orange"],
    dimensions: "15 cm length",
    printTimeHours: 4,
    rating: 4.8,
    reviewsCount: 84,
    createdAt: "2026-02-28T13:00:00Z"
  },
  {
    id: "3d-8",
    title: "Tabletop Fantasy Miniatures (8K UV Resin Set)",
    description: "Set of 4 tabletop RPG characters (Warrior, Mage, Rogue, Paladin) cured in ultra-high resolution 8K UV photopolymer resin at 0.03mm layer height for microscopically crisp armor, weapons, and facial expressions.",
    price: 34,
    category: "Miniatures & Resin",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    inventory: 11,
    material: "8K Tough Photopolymer Resin",
    colorOptions: ["Unpainted Primer Gray", "Obsidian Black Resin"],
    dimensions: "32mm standard tabletop scale",
    printTimeHours: 9,
    badge: "High-Res 8K",
    rating: 4.9,
    reviewsCount: 33,
    createdAt: "2026-03-01T08:00:00Z"
  }
];

export const PRESET_IMAGE_SUGGESTIONS = [
  { label: "Silk Dragon / Articulated", url: "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800&auto=format&fit=crop&q=80" },
  { label: "Geometric Planter / Decor", url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80" },
  { label: "Headphone Mount / PETG", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" },
  { label: "Mechanical Aperture Gadget", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80" },
  { label: "Gaming Dice Tower / Fantasy", url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80" },
  { label: "Cyber Headphone Stand", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" },
  { label: "Articulated Fidget Slug", url: "https://images.unsplash.com/photo-1566576912321-d58ddd74b0ae?w=800&auto=format&fit=crop&q=80" },
  { label: "8K Resin RPG Miniature", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80" },
  { label: "3D Printer Hotend / Bed", url: "https://images.unsplash.com/photo-1631556097152-c39479bbfb11?w=800&auto=format&fit=crop&q=80" },
  { label: "Filament Spool / Materials", url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80" }
];

export const INITIAL_FILAMENTS: Filament[] = [
  {
    id: "fil-1",
    name: "petg translucent",
    material: "High-Strength PETG",
    colorHex: "#77EDD7",
    brand: "Bambu Lab",
    inStock: true,
    notes: "can't mix with pla"
  },
  {
    id: "fil-2",
    name: "pla matte",
    material: "Silk PLA",
    colorHex: "#F7D959",
    brand: "Bambu Lab",
    inStock: true
  },
  {
    id: "fil-3",
    name: "pla glow",
    material: "Silk PLA",
    colorHex: "#A1FFAC",
    brand: "Bambu Lab",
    inStock: true
  },
  {
    id: "fil-4",
    name: "pla silk",
    material: "Silk PLA",
    colorHex: "#B6A29E",
    brand: "Bambu Lab",
    inStock: true,
    notes: "ziet er niet zo uit"
  },
  {
    id: "fil-5",
    name: "pla matte",
    material: "PLA+",
    colorHex: "#004D65",
    brand: "Bambu Lab",
    inStock: true
  },
  {
    id: "fil-6",
    name: "pla silk blue Hawaii",
    material: "Silk PLA",
    colorHex: "#56C4C4",
    brand: "Bambu Lab",
    inStock: true
  },
  {
    id: "fil-7",
    name: "play basic",
    material: "Silk PLA",
    colorHex: "#F97316",
    brand: "Bambu Lab",
    inStock: true
  },
  {
    id: "fil-8",
    name: "pla basic",
    material: "PLA+",
    colorHex: "#18181B",
    brand: "Bambu Lab",
    inStock: true
  }
];

