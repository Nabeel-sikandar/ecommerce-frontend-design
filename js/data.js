/* ============================================================
   DATA.JS — Product Data & Categories
   Shared across all pages. Edit products here.
   ============================================================ */

const products = [
  {
    id: 1,
    name: "Men's Classic Polo T-Shirt — Teal Blue",
    price: 10.30,
    oldPrice: null,
    image: "images/cloth/tshirt-blue.png",
    rating: 4.2,
    orders: 154,
    brand: "H&M",
    category: "Clothes",
    description: "Premium cotton polo t-shirt with a comfortable regular fit. Features ribbed collar, two-button placket, and side vents for ease of movement. Machine washable.",
    specs: {
      Model: "PL-2024-TL",
      Style: "Polo Classic",
      Material: "100% Cotton",
      Size: "S / M / L / XL",
      Color: "Teal Blue"
    }
  },
  {
    id: 2,
    name: "Men's Denim Shorts — Light Blue Wash",
    price: 18.50,
    oldPrice: 24.00,
    image: "images/cloth/shorts.png",
    rating: 4.0,
    orders: 89,
    brand: "Levi's",
    category: "Clothes",
    description: "Comfortable denim shorts with a relaxed fit. Five-pocket styling with zip fly and button closure. Perfect for summer casual wear.",
    specs: {
      Model: "DS-550-LB",
      Style: "Relaxed Fit",
      Material: "98% Cotton, 2% Elastane",
      Size: "30 / 32 / 34 / 36",
      Color: "Light Blue"
    }
  },
  {
    id: 3,
    name: "Men's Winter Puffer Jacket — Brown",
    price: 45.00,
    oldPrice: 62.50,
    image: "images/cloth/jacket.png",
    rating: 4.5,
    orders: 67,
    brand: "Zara",
    category: "Clothes",
    description: "Warm padded puffer jacket with stand collar. Water-resistant outer shell, zip pockets, and elasticated cuffs. Ideal for cold weather layering.",
    specs: {
      Model: "WJ-887-BR",
      Style: "Puffer",
      Material: "Polyester Shell, Polyester Fill",
      Size: "M / L / XL / XXL",
      Color: "Brown"
    }
  },
  {
    id: 4,
    name: "Canvas Travel Duffle Bag — Olive Green",
    price: 34.00,
    oldPrice: null,
    image: "images/cloth/bag.png",
    rating: 4.3,
    orders: 45,
    brand: "Nike",
    category: "Clothes",
    description: "Spacious canvas duffle bag with adjustable shoulder strap and reinforced handles. Multiple interior pockets and durable zip closure.",
    specs: {
      Model: "DB-120-OL",
      Dimensions: "50cm x 28cm x 25cm",
      Material: "Heavy Duty Canvas",
      Capacity: "35 Liters",
      Color: "Olive Green"
    }
  },
  {
    id: 5,
    name: "Genuine Leather Bi-Fold Wallet — Dark Brown",
    price: 29.00,
    oldPrice: null,
    image: "images/cloth/wallet.png",
    rating: 4.6,
    orders: 120,
    brand: "Tommy Hilfiger",
    category: "Clothes",
    description: "Handcrafted genuine leather wallet with 8 card slots, 2 bill compartments, and ID window. Slim profile fits comfortably in pocket.",
    specs: {
      Model: "WL-GEN-DB",
      Style: "Bi-Fold",
      Material: "Genuine Cowhide Leather",
      Dimensions: "11cm x 9cm",
      Color: "Dark Brown"
    }
  },
  {
    id: 6,
    name: "Canon EOS 2000D DSLR Camera — 10x Zoom",
    price: 998.00,
    oldPrice: 1128.00,
    image: "images/tech/camera.png",
    rating: 4.7,
    orders: 154,
    brand: "Canon",
    category: "Electronics",
    description: "Entry-level DSLR with 24.1MP APS-C sensor and DIGIC 4+ processor. Built-in Wi-Fi and NFC for easy sharing. Includes 18-55mm IS II lens kit.",
    specs: {
      Model: "EOS 2000D",
      Sensor: "24.1MP APS-C CMOS",
      ISO: "100-6400",
      Video: "Full HD 1080p",
      Connectivity: "Wi-Fi, NFC"
    }
  },
  {
    id: 7,
    name: "Xiaomi Redmi Note 12 — Midnight Black",
    price: 199.00,
    oldPrice: 249.00,
    image: "images/tech/phone-black.png",
    rating: 4.4,
    orders: 312,
    brand: "Xiaomi",
    category: "Electronics",
    description: "6.67-inch AMOLED display with 120Hz refresh rate. Snapdragon 685, 6GB RAM, 128GB storage. 50MP triple camera with 5000mAh battery.",
    specs: {
      Model: "Redmi Note 12",
      Display: "6.67\" AMOLED 120Hz",
      Processor: "Snapdragon 685",
      RAM: "6GB",
      Storage: "128GB"
    }
  },
  {
    id: 8,
    name: "iPhone 12 (PRODUCT)RED — 64GB",
    price: 599.00,
    oldPrice: 799.00,
    image: "images/tech/phone-red.png",
    rating: 4.8,
    orders: 534,
    brand: "Apple",
    category: "Electronics",
    description: "Super Retina XDR 6.1-inch display. A14 Bionic chip. 12MP dual camera system. 5G capable with Ceramic Shield front cover.",
    specs: {
      Model: "iPhone 12",
      Display: "6.1\" Super Retina XDR",
      Chip: "A14 Bionic",
      Camera: "12MP Dual System",
      Storage: "64GB"
    }
  },
  {
    id: 9,
    name: "Xiaomi Pad 5 Tablet — 11\" Display",
    price: 349.00,
    oldPrice: 399.00,
    image: "images/tech/tablet.png",
    rating: 4.3,
    orders: 198,
    brand: "Xiaomi",
    category: "Electronics",
    description: "11-inch WQHD+ 120Hz display with Dolby Vision. Snapdragon 860, 6GB RAM. Quad speakers with Dolby Atmos. 8720mAh battery.",
    specs: {
      Model: "Pad 5",
      Display: "11\" WQHD+ 120Hz",
      Processor: "Snapdragon 860",
      RAM: "6GB",
      Battery: "8720mAh"
    }
  },
  {
    id: 10,
    name: "MacBook Pro 13\" M1 — Space Gray",
    price: 1299.00,
    oldPrice: 1499.00,
    image: "images/tech/laptop.png",
    rating: 4.9,
    orders: 276,
    brand: "Apple",
    category: "Electronics",
    description: "Apple M1 chip with 8-core CPU and 8-core GPU. 13.3-inch Retina display, 8GB unified memory, 256GB SSD. Up to 20 hours battery.",
    specs: {
      Model: "MacBook Pro 13\" M1",
      Display: "13.3\" Retina",
      Chip: "Apple M1",
      RAM: "8GB Unified",
      Storage: "256GB SSD"
    }
  },
  {
    id: 11,
    name: "Gaming Headset with Microphone — Blue/Black",
    price: 39.50,
    oldPrice: 55.00,
    image: "images/tech/headphones-gaming.png",
    rating: 4.1,
    orders: 421,
    brand: "HyperX",
    category: "Electronics",
    description: "Over-ear gaming headset with 50mm drivers and noise-cancelling mic. Memory foam ear cushions. Works with PC, PS5, Xbox, Switch.",
    specs: {
      Model: "Cloud Stinger",
      Driver: "50mm Neodymium",
      Frequency: "18Hz-23kHz",
      Microphone: "Noise-cancelling",
      Compatibility: "PC, PS, Xbox, Switch"
    }
  },
  {
    id: 12,
    name: "Amazfit GTS 2 Mini Smartwatch — Silver",
    price: 89.00,
    oldPrice: 109.00,
    image: "images/tech/smartwatch.png",
    rating: 4.2,
    orders: 187,
    brand: "Amazfit",
    category: "Electronics",
    description: "1.55-inch AMOLED always-on display. 70+ sports modes, heart rate, SpO2. 14-day battery with GPS. 5ATM water resistance.",
    specs: {
      Model: "GTS 2 Mini",
      Display: "1.55\" AMOLED",
      Battery: "14 Days",
      Water: "5ATM",
      Sensors: "Heart Rate, SpO2, GPS"
    }
  },
  {
    id: 13,
    name: "Men's Gray Crew Neck T-Shirt — Organic Cotton",
    price: 8.99,
    oldPrice: null,
    image: "images/cloth/tshirt-gray.png",
    rating: 4.0,
    orders: 230,
    brand: "Uniqlo",
    category: "Clothes",
    description: "Essential crew neck t-shirt from soft organic cotton. Regular fit with reinforced shoulder seams. Pre-shrunk and color-fast.",
    specs: {
      Model: "CN-ORG-GR",
      Style: "Crew Neck",
      Material: "100% Organic Cotton",
      Size: "S / M / L / XL",
      Color: "Heather Gray"
    }
  },
  {
    id: 14,
    name: "Stainless Steel Electric Kettle — 1.7L",
    price: 25.00,
    oldPrice: 35.00,
    image: "images/tech/kettle.png",
    rating: 4.4,
    orders: 98,
    brand: "Philips",
    category: "Home",
    description: "1.7-liter stainless steel kettle with rapid boil. Auto shut-off with boil-dry protection. 360° rotational base with cord storage.",
    specs: {
      Model: "HD9350",
      Capacity: "1.7 Liters",
      Power: "2200W",
      Material: "Stainless Steel",
      Feature: "Auto Shut-off"
    }
  },
  {
    id: 15,
    name: "Ceramic Cooking Pot — Traditional Design",
    price: 19.50,
    oldPrice: null,
    image: "images/tech/pot.png",
    rating: 4.1,
    orders: 55,
    brand: "Generic",
    category: "Home",
    description: "Handcrafted ceramic cooking pot with traditional design. Heat-resistant and suitable for slow cooking. Comes with matching lid.",
    specs: {
      Model: "CP-TRAD-01",
      Capacity: "3 Liters",
      Material: "Glazed Ceramic",
      Oven: "Safe up to 250°C",
      Dishwasher: "Safe"
    }
  }
];

/* --- Categories for sidebar links --- */
const categories = [
  { name: "Automobiles",      slug: "all" },
  { name: "Clothes and wear", slug: "clothes" },
  { name: "Home interiors",   slug: "home" },
  { name: "Computer and tech", slug: "electronics" },
  { name: "Tools, equipments", slug: "all" },
  { name: "Sports and outdoor", slug: "all" },
  { name: "Animal and pets",  slug: "all" },
  { name: "Machinery tools",  slug: "all" },
  { name: "More category",    slug: "all" }
];
