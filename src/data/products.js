// PRINTORA Master Product Catalogue
// Rule: Never invent prices. Products without confirmed prices have price: null (displays "REQUEST A QUOTE").

export const CATEGORIES = [
  {
    id: "apparel",
    slug: "apparel",
    name: "Apparel",
    description: "Tailored everyday luxury crafted from combed, pre-shrunk cotton with precision digital & screen printing.",
    heroImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    itemCount: 8
  },
  {
    id: "sportswear",
    slug: "sportswear",
    name: "Sportswear",
    description: "Pro-grade sublimation jerseys engineered with lightweight moisture-wicking dry-fit poly mesh.",
    heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    itemCount: 4
  },
  {
    id: "bags",
    slug: "bags",
    name: "Bags",
    description: "Structured canvas totes, reinforced rucksacks and minimalist tech backpacks built for everyday utility.",
    heroImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    itemCount: 6
  },
  {
    id: "drinkware",
    slug: "drinkware",
    name: "Drinkware",
    description: "Double-walled thermal tumblers, ceramic artisan mugs and heat-activated color-changing drinkware.",
    heroImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    itemCount: 7
  },
  {
    id: "personalized-gifts",
    slug: "personalized-gifts",
    name: "Personalized Gifts",
    description: "Timeless keepsakes, curated luxury gift sets, archival photo frames and engraved leather accessories.",
    heroImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    itemCount: 9
  },
  {
    id: "stationery",
    slug: "stationery",
    name: "Stationery",
    description: "Hardbound corporate journals, premium debossed notebooks and matte die-cut precision branding stickers.",
    heroImage: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80",
    itemCount: 7
  },
  {
    id: "corporate-merchandise",
    slug: "corporate-merchandise",
    name: "Corporate & Business",
    description: "Turnkey branded executive merchandise, smart wearable NFC/transparent ID cards and corporate identity packs.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    itemCount: 9
  },
  {
    id: "tech-accessories",
    slug: "tech-accessories",
    name: "Tech Accessories",
    description: "Sleek shockproof phone casings and protective neoprene laptop sleeves customized for modern creators.",
    heroImage: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80",
    itemCount: 3
  }
];

export const INITIAL_PRODUCTS = [
  // ==========================================
  // A. APPAREL
  // ==========================================
  {
    id: "prn-app-01",
    slug: "round-neck-t-shirt",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Round Neck T-shirt",
    subtitle: "Everyday Staple • 180 GSM Pure Bio-Washed Cotton",
    description: "Our signature classic crewneck crafted from 100% bio-washed super-combed cotton. Ultra-smooth surface engineered for high-definition vibrant print longevity and soft all-day comfort.",
    price: 499,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "/assets/mockups/tshirt_crewneck.png",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", hex: "#111111" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Sand Beige", hex: "#D8CABA" },
      { name: "Charcoal Heather", hex: "#4A4A4A" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      allowModel: true,
      allowUpload: true,
      placementOptions: ["Left Chest", "Center Chest", "Full Back", "Sleeve Print"]
    }
  },
  {
    id: "prn-app-02",
    slug: "premium-t-shirt",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Premium T-shirt",
    subtitle: "220 GSM Heavyweight Luxury Cotton",
    description: "A tailored luxury essential constructed from heavyweight 220 GSM single-jersey cotton. Features refined lycra ribbed collar, twin-needle hem finishing, and silicon soft-feel wash.",
    price: 599,
    originalPrice: 899,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Obsidian Black", hex: "#0D0D0D" },
      { name: "Off White", hex: "#F5F3EF" },
      { name: "Warm Olive", hex: "#555D50" },
      { name: "Midnight Navy", hex: "#1E2A38" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      placementOptions: ["Left Chest Minimal", "Center Minimal", "Back Arch"]
    }
  },
  {
    id: "prn-app-03",
    slug: "oversized-t-shirt",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Oversized T-shirt",
    subtitle: "240 GSM Boxy Drop-Shoulder Streetwear Fit",
    description: "Contemporary streetwear drop-shoulder fit with relaxed drape, thick ribbed crew collar and heavyweight French terry cotton. Perfect for bold back prints and minimal chest branding.",
    price: 799,
    originalPrice: 1199,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "/assets/mockups/tshirt_oversized.png",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Charcoal", hex: "#2B2B2B" },
      { name: "Bone White", hex: "#EAE7DF" },
      { name: "Earth Khaki", hex: "#9E8E76" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      placementOptions: ["Center Chest", "Giant Back Typography", "Pocket Placement"]
    }
  },
  {
    id: "prn-app-04",
    slug: "polo-t-shirt",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Polo T-shirt",
    subtitle: "230 GSM Pique Knit • Clean Formal & Smart Casual",
    description: "Classic honeycomb pique polo with double-button mother-of-pearl placket and structured ribbed knit collar. Ideal for corporate branding, golf tournaments, and executive teams.",
    price: 599,
    originalPrice: 849,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1625910513413-5963957f83fb?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Jet Black", hex: "#121212" },
      { name: "Royal Navy", hex: "#152238" },
      { name: "Ivory Pearl", hex: "#F3EFE6" },
      { name: "Slate Grey", hex: "#5C5C5C" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      placementOptions: ["Left Chest Embroidery/Print", "Right Sleeve Emblem"]
    }
  },
  {
    id: "prn-app-05",
    slug: "hoodie",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Hoodie",
    subtitle: "320 GSM Heavy Brushed Fleece • Double Lined Hood",
    description: "Cozy thermal hoodie manufactured from 320 GSM brushed fleece with kangaroo front pouch, thick flat drawstrings with metal aglets, and ribbed stretch cuffs. Ultimate premium warm comfort.",
    price: 949,
    originalPrice: 1499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "/assets/mockups/hoodie.png",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Pitch Black", hex: "#0E0E0E" },
      { name: "Desert Sand", hex: "#D4C7B5" },
      { name: "Heather Grey", hex: "#8A8D8F" },
      { name: "Forest Green", hex: "#233D2D" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      placementOptions: ["Center Chest", "Full Back", "Wrist Badge"]
    }
  },
  {
    id: "prn-app-06",
    slug: "sweatshirts",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Sweatshirts",
    subtitle: "300 GSM Brushed Terry Crewneck",
    description: "Minimalist crewneck fleece sweatshirt tailored with athletic raglan cuts, seamless side hems, and durable stitch detailing. Custom manufactured for clubs, colleges, and company winter drops.",
    price: 899,
    originalPrice: 1299,
    originalPrice: 1299,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Classic Black", hex: "#111111" },
      { name: "Beige Cream", hex: "#EBE5D8" },
      { name: "Navy Blue", hex: "#16233B" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-app-07",
    slug: "tank-tops",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Tank Tops",
    subtitle: "180 GSM Breathable Summer Athletic Cut",
    description: "Deep cut armholes and athletic scoop neck engineered for gyms, summer runs and high intensity training. 100% moisture-absorbent combed cotton.",
    price: 399,
    originalPrice: 599,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Midnight Black", hex: "#111111" },
      { name: "Bright White", hex: "#FFFFFF" },
      { name: "Steel Grey", hex: "#686868" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-app-08",
    slug: "custom-caps",
    categoryId: "apparel",
    categoryName: "Apparel",
    name: "Cap",
    subtitle: "6-Panel Structured Cotton Twill • Metal Buckle",
    description: "Structured 6-panel profile with pre-curved visor, stitched ventilation eyelets and premium antiqued brass sliding buckle strap. Customized with high-density 3D embroidery or precision laser patch.",
    price: 399,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size (Adjustable)"],
    colors: [
      { name: "Matte Black", hex: "#151515" },
      { name: "Desert Khaki", hex: "#C7B299" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Deep Navy", hex: "#192841" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      placementOptions: ["Front Crown Center", "Side Temple", "Back Arch Strap"]
    }
  },

  // ==========================================
  // B. SPORTSWEAR
  // ==========================================
  {
    id: "prn-spt-01",
    slug: "custom-jerseys",
    categoryId: "sportswear",
    categoryName: "Sportswear",
    name: "Custom Jersey",
    subtitle: "Full Sublimation • Dry-Fit Honeycomb Mesh",
    description: "Professional grade custom team jerseys with vibrant all-over sublimation printing that never fades or peels. Complete personalization included: your custom player name on back, jersey number, team chest badge, front sponsor graphics, and back artwork.",
    price: 499,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Stealth Black & Gold", hex: "#151515" },
      { name: "Royal Blue & White", hex: "#0047AB" },
      { name: "Crimson Red & Black", hex: "#990000" },
      { name: "Emerald & Gold", hex: "#0B5345" },
      { name: "Pure White & Silver", hex: "#F8F9FA" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      isJerseyCustomizer: true,
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true,
      allowFrontBack: true
    }
  },
  {
    id: "prn-spt-02",
    slug: "team-jerseys",
    categoryId: "sportswear",
    categoryName: "Sportswear",
    name: "Team Jerseys",
    subtitle: "Bulk Team Kits with Multi-Player Roster Printing",
    description: "Designed for full cricket squads, football teams, basketball clubs and sports tournaments. Includes individual player names, assigned numbers, sponsor logos and matching team colorways.",
    price: 499,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy & Neon", hex: "#0C1B33" },
      { name: "Black & Scarlet", hex: "#1E1E1E" },
      { name: "Sky Blue & White", hex: "#5DADE2" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      isJerseyCustomizer: true,
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-spt-03",
    slug: "sports-t-shirts",
    categoryId: "sportswear",
    categoryName: "Sportswear",
    name: "Sports T-shirts",
    subtitle: "Breathable Micro-Poly Activewear",
    description: "Lightweight 160 GSM anti-bacterial dry-fit fabric designed for endurance sports, marathon contingents, gym workout sessions, and athletic camps.",
    price: 499,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Carbon Grey", hex: "#333333" },
      { name: "Active Navy", hex: "#1C3144" },
      { name: "Bright White", hex: "#FFFFFF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-spt-04",
    slug: "customized-team-uniforms",
    categoryId: "sportswear",
    categoryName: "Sportswear",
    name: "Customized Team Uniforms",
    subtitle: "Full Uniform Sets (Jersey + Shorts / Warmup Tracksuits)",
    description: "Complete professional athletic kits including sublimated jerseys, coordinated athletic shorts with drawstrings, and optional zippered warmup jackets for colleges, universities, and corporate sports leagues.",
    price: 499,
    originalPrice: 799,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Full Custom Colorway", hex: "#111111" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // C. BAGS
  // ==========================================
  {
    id: "prn-bag-01",
    slug: "tote-bags",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Tote Bag",
    subtitle: "340 GSM Heavy Canvas • Reinforced Cross-Stitched Handles",
    description: "Eco-friendly, reusable premium natural cotton canvas tote bag. Generous main compartment fits laptops up to 15-inch, books and daily essentials. Printed with high-contrast durable inks.",
    price: 449,
    originalPrice: 649,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard 15x16 inch"],
    colors: [
      { name: "Natural Ecru", hex: "#EFECE4" },
      { name: "Onyx Black", hex: "#111111" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-bag-02",
    slug: "gym-bags",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Gym Bags",
    subtitle: "Water-Resistant Duffle with Dedicated Shoe Compartment",
    description: "Rugged gym and weekend duffle bag made from high-density nylon polyester. Includes segregated ventilated footwear compartment, padded shoulder strap, and internal zipper pouch.",
    price: 599,
    originalPrice: 899,
    originalPrice: 899,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["45L Duffle"],
    colors: [
      { name: "All Black", hex: "#1A1A1A" },
      { name: "Charcoal & Orange", hex: "#3A3A3A" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-bag-03",
    slug: "laptop-bags",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Laptop Bags",
    subtitle: "Padded Executive Briefcase with Organizer",
    description: "Streamlined professional briefcase featuring shock-absorbent foam padding for 15.6\" laptops, water-resistant exterior coating, luggage trolley sleeve, and custom debossed or printed corporate emblem.",
    price: 699,
    originalPrice: 999,
    originalPrice: 999,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Fits up to 15.6 inch"],
    colors: [
      { name: "Executive Grey", hex: "#4B4E54" },
      { name: "Midnight Black", hex: "#181818" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-bag-04",
    slug: "jute-bags",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Jute Bags",
    subtitle: "100% Biodegradable Golden Fiber with Cotton Webbing",
    description: "Laminated natural golden jute bags perfect for corporate conferences, retail shopping, wedding hampers, and sustainable exhibitions. Custom screen printed with single or multi-color graphics.",
    price: 499,
    originalPrice: 699,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Medium", "Large"],
    colors: [
      { name: "Natural Golden Jute", hex: "#C2A379" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-bag-05",
    slug: "rucksack-bags",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Rucksack Bags",
    subtitle: "Rugged Roll-Top Weatherproof Exploration Pack",
    description: "Roll-top expandable volume rucksack with heavy-duty clip closures, ergonomically contoured shoulder straps, and modular utility loops. Designed for adventurous lifestyle merchandise.",
    price: 999,
    originalPrice: 1499,
    originalPrice: 1499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["35L - 45L"],
    colors: [
      { name: "Olive Drab", hex: "#4A5240" },
      { name: "Stealth Black", hex: "#1C1C1C" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-bag-06",
    slug: "backpacks",
    categoryId: "bags",
    categoryName: "Bags",
    name: "Backpacks",
    subtitle: "Sleek Everyday College & Commuter Daypack",
    description: "Minimalist urban silhouette backpack with dual bottle pockets, internal tech sleeves, padded breathable mesh back panel, and discrete front zipper for easy branding.",
    price: 999,
    originalPrice: 1499,
    originalPrice: 1499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["25L Everyday"],
    colors: [
      { name: "Monochrome Black", hex: "#121212" },
      { name: "Steel Heather", hex: "#63676C" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // D. DRINKWARE
  // ==========================================
  {
    id: "prn-drk-01",
    slug: "coffee-mug",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Coffee Mug",
    subtitle: "325ml Premium Grade-A Ceramic • Gloss Finish",
    description: "High-grade microwave and dishwasher-safe white ceramic coffee mug. Features an ergonomic C-handle and non-fade wrap-around sublimation printing for photos, typography, and logos.",
    price: 299,
    originalPrice: 449,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542556398-971c26c117d0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["325ml (11oz)"],
    colors: [
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Two-Tone Black Inner", hex: "#111111" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-02",
    slug: "personalized-mugs",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Personalized Mugs",
    subtitle: "Custom Photo Collage & Name Ceramic Mug",
    description: "Make every morning coffee special. Print personal family photos, memorable anniversary dates, or company logos with rich 300+ DPI sublimation clarity.",
    price: 299,
    originalPrice: 449,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["325ml (11oz)"],
    colors: [
      { name: "White Ceramic", hex: "#FFFFFF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-03",
    slug: "magic-mug",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Magic Mug",
    subtitle: "Heat-Sensitive Color Changing Ceramic Mug",
    description: "Appears solid matte black when cold. Pour in hot coffee, tea or water, and watch your secret photo, heartfelt message or custom artwork magically reveal itself before your eyes!",
    price: 399,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["325ml (11oz)"],
    colors: [
      { name: "Matte Reveal Black", hex: "#1E1E1E" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-04",
    slug: "tumblers-500ml",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "500ml Tumbler",
    subtitle: "Double-Wall Vacuum Insulated 304 Stainless Steel",
    description: "Sleek travel tumbler engineered to keep hot beverages steaming for 8 hours and iced cold drinks chilled for 18 hours. Features spill-proof slider lid and sweat-free powder coated exterior with precision laser engraving.",
    price: 549,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["500ml"],
    colors: [
      { name: "Matte Stealth Black", hex: "#181818" },
      { name: "Brushed Steel", hex: "#C7C7C7" },
      { name: "Cream White", hex: "#F3EFE6" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-05",
    slug: "flask-bottles",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Flask Bottles",
    subtitle: "Temperature Display Smart Insulated Flask",
    description: "Smart thermos flask with built-in LED touch temperature display on cap. Double-vacuum stainless steel construction with removable tea infuser mesh basket.",
    price: null,
    isQuoteOnly: true,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["500ml Smart LED"],
    colors: [
      { name: "Midnight Black", hex: "#151515" },
      { name: "Crimson Red", hex: "#8A1C14" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-06",
    slug: "steel-bottles",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Steel Bottles",
    subtitle: "Single-Walled Ergonomic Everyday Sports Bottle",
    description: "Lightweight 750ml food-grade 18/8 stainless steel bottle with leakproof threaded bamboo or steel cap. Customized with laser engraving or rotary UV color print.",
    price: null,
    isQuoteOnly: true,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["750ml"],
    colors: [
      { name: "Silver Metal", hex: "#D1D5DB" },
      { name: "Matte Black", hex: "#1F2937" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-drk-07",
    slug: "sippers",
    categoryId: "drinkware",
    categoryName: "Drinkware",
    name: "Sippers",
    subtitle: "BPA-Free Gym Shaker & Infuser Sipper",
    description: "Multi-purpose active sipper with flip spout, integrated carrying loop, and internal protein blending ball. Custom printed with gym logos, names, or team badges.",
    price: null,
    isQuoteOnly: true,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["650ml"],
    colors: [
      { name: "Smoky Black", hex: "#222222" },
      { name: "Frosted Clear", hex: "#E5E7EB" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // E. PERSONALIZED GIFTS
  // ==========================================
  {
    id: "prn-gft-01",
    slug: "photo-frame",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Photo Frame",
    subtitle: "Solid Wood Finish Frame with Archival Matte Print",
    description: "Minimalist wooden wall and tabletop photo frame with high-transparency glass. Your personal high-resolution photograph is color-calibrated and printed on archival 260 GSM textured art paper.",
    price: 499,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["6x8 inch", "8x10 inch", "12x18 inch"],
    colors: [
      { name: "Matte Black Wood", hex: "#1E1E1E" },
      { name: "Natural Oak", hex: "#C79D67" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-02",
    slug: "gift-boxes",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Gift Box",
    subtitle: "Custom Curated Rigid Keepsake Box with Ribbon",
    description: "Handcrafted magnetic-closure rigid gift boxes customized with gold foil debossing. Perfect for birthdays, weddings, festive celebrations, and executive appreciation.",
    price: 799,
    originalPrice: 1199,
    isQuoteOnly: false,
    isOnwards: true, // "Starting ₹799"
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Compact (2 items)", "Deluxe (4 items)", "Grand (6 items)"],
    colors: [
      { name: "Luxury Black & Gold", hex: "#141414" },
      { name: "Warm Champagne", hex: "#E8DEC9" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-03",
    slug: "personalized-wallets",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Personalized Wallets",
    subtitle: "Genuine Top-Grain Leather with Engraved Name & Charm",
    description: "Handcrafted slim bifold leather wallet customized with the recipient's laser-engraved name and metal charm. Features RFID blocking technology and multiple card slots.",
    price: 399,
    originalPrice: 599,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Slim Bifold"],
    colors: [
      { name: "Tan Vintage", hex: "#8B5A2B" },
      { name: "Midnight Black", hex: "#1B1B1B" },
      { name: "Deep Brown", hex: "#3D2314" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-04",
    slug: "keychains",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Keychains",
    subtitle: "Laser-Cut Acrylic, Leather & Polished Metal Keyrings",
    description: "Custom engraved metal keychains, hotel-tag style acrylic fobs, and stitched leather loops with personalized names, vehicle plate numbers, or custom emblems.",
    price: 199,
    originalPrice: 299,
    originalPrice: 299,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Compact Loop"],
    colors: [
      { name: "Gunmetal Finish", hex: "#4A4D52" },
      { name: "Cognac Leather", hex: "#9E5A2A" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-05",
    slug: "cushions",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Cushions",
    subtitle: "Soft Satin Cushion with Polyfill Insert (16x16 inch)",
    description: "Plush decorative sofa cushion with seamless edge-to-edge sublimation photo printing and concealed zipper enclosure. Includes hypoallergenic polyfill insert.",
    price: 299,
    originalPrice: 499,
    originalPrice: 499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["16x16 inch"],
    colors: [
      { name: "Custom Print Fabric", hex: "#EAE7DF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-06",
    slug: "personalized-pillows",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Personalized Pillows",
    subtitle: "Heart Shape & LED Magic Glow Pillows",
    description: "Special occasion memory pillows customized with intimate portraits and sweet typography. Soft touch fabric that maintains comfort wash after wash.",
    price: 399,
    originalPrice: 599,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Heart Shape / Square"],
    colors: [
      { name: "Romantic Red / White", hex: "#C0392B" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-07",
    slug: "acrylic-photo-frames",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Acrylic Photo Frames",
    subtitle: "Frameless 8mm Ultra-Clear High Gloss Acrylic Glass",
    description: "Direct UV back-printed ultra-clear crystal acrylic block with polished diamond-cut bevel edges and brushed stainless steel standoffs.",
    price: 699,
    originalPrice: 999,
    originalPrice: 999,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["5x7 inch", "8x10 inch", "12x18 inch"],
    colors: [
      { name: "Crystal Acrylic", hex: "#F3F4F6" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-08",
    slug: "posters",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Posters",
    subtitle: "300 GSM Museum-Grade Fine Art Matte Paper",
    description: "Crisp wall art prints with rich pigment saturation. Ideal for movie fanart, motivational quotes, team achievements, or personal photographic prints.",
    price: 499,
    originalPrice: 799,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["A4", "A3", "18x24 inch"],
    colors: [
      { name: "Matte White Stock", hex: "#FFFFFF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-gft-09",
    slug: "personalized-accessories",
    categoryId: "personalized-gifts",
    categoryName: "Personalized Gifts",
    name: "Personalized Accessories",
    subtitle: "Custom Passport Covers, Luggage Tags & Cardholders",
    description: "Curated lifestyle travel accessories tailored with metal charms and customized names for frequent flyers, honeymooners, and luxury events.",
    price: 499,
    originalPrice: 699,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard Fit"],
    colors: [
      { name: "Tan / Brown / Grey", hex: "#9E7B54" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // F. STATIONERY
  // ==========================================
  {
    id: "prn-stn-01",
    slug: "corporate-diary",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Corporate Diary",
    subtitle: "Hardbound PU Leather with Debossed Foil Year & Logo",
    description: "Executive 200-page dated and ruled journal crafted with 80 GSM acid-free natural shade paper, ribbon bookmark, pen loop, and magnetic strap closure. Customized with blind debossing or metallic foil stamping.",
    price: 399,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["A5 Hardbound"],
    colors: [
      { name: "Onyx Black", hex: "#1A1A1A" },
      { name: "Cognac Tan", hex: "#8A5A30" },
      { name: "Navy Blue", hex: "#1C2B42" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-02",
    slug: "notebook",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Notebook",
    subtitle: "Softbound / Spiral Wire-O Journal • 100 GSM Paper",
    description: "Versatile creative notebook featuring 160 pages of ink-bleed-resistant unruled or dotted sheets. High-quality 350 GSM matte laminated front cover with personalized cover design.",
    price: 429,
    originalPrice: 599,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["A5 Spiral", "A5 Perfect Bound"],
    colors: [
      { name: "Minimalist Beige", hex: "#EAE5DB" },
      { name: "Matte Charcoal", hex: "#2B2B2B" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-03",
    slug: "stickers",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Stickers",
    subtitle: "Precision Die-Cut Waterproof Vinyl Stickers",
    description: "Waterproof, weatherproof, and UV-resistant matte vinyl stickers. Perfect for branding laptops, water bottles, packaging boxes, skateboards, and retail bags.",
    price: 299,
    originalPrice: 399,
    isQuoteOnly: false,
    isOnwards: true, // "Starting ₹299"
    images: [
      "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Pack of 10", "Pack of 50", "Custom Roll"],
    colors: [
      { name: "Matte Finish Vinyl", hex: "#FFFFFF" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-04",
    slug: "diaries",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Diaries",
    subtitle: "Custom Casebound Undated Personal Journal",
    description: "Personalized lifestyle diaries with customizable cover typography, gold foil spine details, and lay-flat Smyth-sewn binding for seamless writing.",
    price: 299,
    originalPrice: 449,
    originalPrice: 449,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["A5"],
    colors: [
      { name: "Burgundy", hex: "#631A24" },
      { name: "Deep Teal", hex: "#174447" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-05",
    slug: "customized-stationery",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Customized Stationery",
    subtitle: "Notepads, Sticky Notes & Desk Planners",
    description: "Daily planner pads, memo sheets, and branded adhesive sticky note cubes customized with company colors and motivational headers.",
    price: 199,
    originalPrice: 299,
    originalPrice: 299,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1583521214690-73421a1829a9?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Desk Pad"],
    colors: [
      { name: "White Bond Paper", hex: "#FAFAFA" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-06",
    slug: "customized-pens",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Customized Pens",
    subtitle: "Metal Rollerball & Twist Action Laser-Engraved Pens",
    description: "Heavy metal body luxury pens with smooth German ink refills. Laser-engraved with employee names, company branding, or commemorative dates.",
    price: null,
    isQuoteOnly: true,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1585336261026-62c76508006e?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard Rollerball"],
    colors: [
      { name: "Matte Black & Gold Clip", hex: "#141414" },
      { name: "Brushed Silver", hex: "#C7C7C7" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-stn-07",
    slug: "office-stationery",
    categoryId: "stationery",
    categoryName: "Stationery",
    name: "Office Stationery",
    subtitle: "Complete Branded Desk & Supply Set",
    description: "Customized desk organizers, paperweights, branded envelopes, document clips, and conference folders designed for cohesive office aesthetics.",
    price: null,
    isQuoteOnly: true,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard Office Pack"],
    colors: [
      { name: "Corporate Monochrome", hex: "#222222" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // G. CORPORATE AND BUSINESS PRODUCTS
  // ==========================================
  {
    id: "prn-crp-01",
    slug: "customized-t-shirts",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Customized T-shirts",
    subtitle: "Uniform & Event Branded Cotton Shirts",
    description: "High-volume standardized cotton t-shirts customized for company team outings, startup hackathons, tech conferences, and staff uniforms.",
    price: 499,
    originalPrice: 699,
    isQuoteOnly: false,
    isOnwards: true,
    images: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Corporate Black", hex: "#121212" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy Blue", hex: "#18263B" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-02",
    slug: "id-cards",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "ID Cards",
    subtitle: "Pack of 10 Pieces (₹500) • High-Def Thermal PVC",
    description: "Standard credit-card thickness PVC identity cards with high-definition digital thermo-transfer printing, barcode/QR code support, and optional RFID chips.",
    price: 500,
    originalPrice: 750,
    originalPrice: 750,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard CR80 (85.6 x 54 mm)"],
    colors: [
      { name: "Full Color PVC", hex: "#FFFFFF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-03",
    slug: "transparent-id-cards",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Transparent ID Cards with Wearable Tags",
    subtitle: "Pack of 10 Pieces with Tags (₹600)",
    description: "Ultra-modern transparent and frosted PET cards paired with custom 20mm heat-transfer printed satin neck lanyards and heavy alloy dog clips.",
    price: 600,
    originalPrice: 900,
    originalPrice: 900,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Standard Badge + 20mm Lanyard"],
    colors: [
      { name: "Frosted Transparent", hex: "#E5E7EB" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-04",
    slug: "visiting-cards",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Visiting Cards",
    subtitle: "Pack of 100 (₹299) • Pack of 500 (₹499) • Pack of 1000 (₹599)",
    description: "Distinguished business cards printed on ultra-thick imported card stock. Upgrades include raised spot UV gloss, gold or silver foil edges, and velvet lamination.",
    price: 299,
    originalPrice: 499,
    originalPrice: 499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1589078695029-7b4b41933813?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Pack of 100", "Pack of 500", "Pack of 1000"],
    colors: [
      { name: "Matte Black & Gold", hex: "#111111" },
      { name: "Minimal Pearl", hex: "#F7F5F0" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-05",
    slug: "letterheads",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Letterheads",
    subtitle: "100 GSM Alabaster Textured Corporate Bond Paper",
    description: "Official executive stationery guaranteed to run seamlessly through laser and inkjet office printers without curling or smudging.",
    price: 299,
    originalPrice: 499,
    originalPrice: 499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["A4 (210 x 297 mm)"],
    colors: [
      { name: "Bond White", hex: "#FFFFFF" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: false,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-06",
    slug: "presentation-folders",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Presentation Folders",
    subtitle: "350 GSM Die-Cut Dual Pocket Folders with Card Slot",
    description: "Professional client presentation folders with reinforced spine, matte film lamination, internal document slots, and visiting card slit.",
    price: 199,
    originalPrice: 349,
    originalPrice: 349,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Fits A4 Documents"],
    colors: [
      { name: "Corporate Midnight", hex: "#1A2530" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: false,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-07",
    slug: "corporate-gift-sets",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Corporate Gift Sets",
    subtitle: "Executive Welcome Kit: Diary + Pen + Bottle + Keychain",
    description: "Pre-assembled luxury onboarding welcome kits in customized foam-padded presentation boxes. Tailored for new employee joining packs, festival Diwali hampers, and client appreciation.",
    price: 299,
    originalPrice: 499,
    originalPrice: 499,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["4-in-1 Kit", "5-in-1 Kit"],
    colors: [
      { name: "Matte Black & Gold", hex: "#151515" }
    ],
    isFeatured: true,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-08",
    slug: "bulk-merchandise",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Bulk Merchandise",
    subtitle: "Bulk Orders • Mail to printora256@gmail.com",
    description: "Complete merchandising support for companies scaling up: customized backpacks, stainless flasks, apparel, and stationery packed and shipped directly to multiple regional offices.",
    price: null,
    isQuoteOnly: true,
    quoteEmail: "printora256@gmail.com",
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Bulk 50+ to 5000+ units"],
    colors: [
      { name: "Custom Brand PMS Colors", hex: "#111111" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: true,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-crp-09",
    slug: "event-merchandise",
    categoryId: "corporate-merchandise",
    categoryName: "Corporate & Business",
    name: "Event Merchandise",
    subtitle: "Event Merchandise • Mail to printora256@gmail.com",
    description: "Fast-track printing of event lanyards, delegate badges, customized volunteer apparel, wristbands, and commemorative mementos.",
    price: null,
    isQuoteOnly: true,
    quoteEmail: "printora256@gmail.com",
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Event Quantities"],
    colors: [
      { name: "Multi-Color Custom", hex: "#222222" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },

  // ==========================================
  // H. TECH ACCESSORIES
  // ==========================================
  {
    id: "prn-tch-01",
    slug: "phone-cases",
    categoryId: "tech-accessories",
    categoryName: "Tech Accessories",
    name: "Phone Cases",
    subtitle: "Enter Phone Model & Upload Photo • ₹699",
    description: "Shock-absorbing TPU inner lining coupled with an ultra-tough scratch-resistant polycarbonate backplate. Wrap-around 3D sublimation print with raised bezels to protect camera lenses and screens.",
    price: 699,
    originalPrice: 999,
    originalPrice: 999,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["iPhone 13 - 16 Pro Max", "Samsung S22 - S25 Ultra", "OnePlus Models"],
    colors: [
      { name: "Gloss Polycarbonate", hex: "#111111" },
      { name: "Matte Frosted", hex: "#555555" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true,
      allowModel: true,
      allowUpload: true
    }
  },
  {
    id: "prn-tch-02",
    slug: "laptop-sleeves",
    categoryId: "tech-accessories",
    categoryName: "Tech Accessories",
    name: "Laptop Sleeves",
    subtitle: "High-Density Neoprene with Microfiber Fleece Lining",
    description: "Slim, weather-resistant neoprene laptop envelope case with smooth gliding dual zippers and anti-scratch interior cushioning. Custom printed with high-resolution edge-to-edge artwork.",
    price: 499,
    originalPrice: 799,
    originalPrice: 799,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["13-14 inch", "15-16 inch"],
    colors: [
      { name: "Stealth Black", hex: "#191919" },
      { name: "Minimal Grey", hex: "#63676C" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  },
  {
    id: "prn-tch-03",
    slug: "customized-tech-accessories",
    categoryId: "tech-accessories",
    categoryName: "Tech Accessories",
    name: "Customized Tech Accessories",
    subtitle: "Mousepads, Cable Organizers & Earphone Cases",
    description: "Customized speed-weave gaming and desk mousepads (up to 900x400mm), leather magnetic cable organizers, and customized silicone AirPods cases.",
    price: 599,
    originalPrice: 899,
    isQuoteOnly: false,
    isOnwards: false,
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Desk Mat (900x400mm)", "Earphone Case"],
    colors: [
      { name: "Matte Black Surface", hex: "#121212" }
    ],
    isFeatured: false,
    isAvailable: true,
    customization: {
      allowName: true,
      allowNumber: false,
      allowLogo: true,
      allowNotes: true
    }
  }
];
