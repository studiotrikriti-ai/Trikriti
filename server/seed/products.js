// /seed/products.js
// Official Trikriti Studio product catalog
// Products are ONLY created via this seed script — admin cannot add/delete products

const products = [
  // ─── REAL PRODUCTS (from official Trikriti Studio product list) ───────────────
  {
    name: "Mini Tumbler Lip Balm Holder Keychain",
    price: 250,
    discount: 40,
    discountedPrice: 150,
    description:
      "Carry your favorite lip balm in style with our Mini Tumbler Lip Balm Holder Keychain — the perfect blend of fashion and function. Designed with a trendy tumbler-inspired look, this adorable accessory keeps your lip balm secure while adding a cute touch to your everyday essentials. Crafted with high-quality 3D printing, this lightweight holder is durable, stylish, and made to stand out.",
    whyLoveIt: [
      "Fits standard lip balm tubes perfectly",
      "Premium 3D printed finish — durable & lightweight",
      "Strong lobster clasp — clips onto bags, keys, purses & backpacks",
      "Trendy tumbler-inspired design that turns heads",
      "Cute gift idea for all ages",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295872/Mini_Tumbler_Lip_Balm_Holder_Keychain_1_g08yfm.jpg",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295872/Mini_Tumbler_Lip_Balm_Holder_Keychain_1_g08yfm.jpg"],
    isCustom: false,
    inStock: true,
    category: "Accessories",
    tags: ["keychain", "lip balm", "3D print", "gift", "accessory"],
  },
  {
    name: "Aurora Prism Lamp",
    price: 2000,
    discount: 40,
    discountedPrice: 1200,
    description:
      "Bring elegance and calm into your space with the Aurora Prism Lamp — a beautifully designed aesthetic table lamp that transforms any room with its soft, ambient glow. Featuring a crystal-inspired geometric pattern, this lamp creates stunning light reflections and a warm, relaxing atmosphere. Crafted with precision using 3D printing technology.",
    whyLoveIt: [
      "Elegant geometric prism design with stunning light reflections",
      "Soft warm ambient lighting — perfect for relaxing evenings",
      "Premium 3D printed finish with a sleek modern base",
      "Ideal for bedroom, desk, living room & gifting",
      "More than a lamp — a glowing statement piece for your space",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777296980/Aurora_Prism_Lamp_3_ib2m0f.png",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295873/Aurora_Prism_Lamp_evegpw.jpg"],
    isCustom: false,
    inStock: true,
    category: "Home Decor & Lighting",
    tags: ["lamp", "3D print", "home decor", "ambient light", "gift", "aesthetic"],
  },
  {
    name: "Luna Swirl Lamp",
    price: 2167,
    discount: 40,
    discountedPrice: 1300,
    description:
      "Elevate your space with the graceful beauty of the Luna Swirl Lamp — an aesthetic statement piece designed to bring warmth, style, and serenity into any room. Inspired by flowing curves and natural movement, its elegant spiral texture creates a soft glowing ambiance. Mounted on a sleek tripod base, the Luna Swirl Lamp adds a premium contemporary touch to any decor.",
    whyLoveIt: [
      "Elegant flowing swirl design inspired by natural curves",
      "Warm soft ambient lighting for a cozy relaxing atmosphere",
      "Premium 3D printed finish with stylish tripod stand base",
      "Perfect for bedroom, desk, living room & as a decor gift",
      "A warm glow wrapped in artful curves — designed to light your mood",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295875/Luna_Swirl_Lamp_df2lb0.jpg",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295875/Luna_Swirl_Lamp_df2lb0.jpg"],
    isCustom: false,
    inStock: true,
    category: "Home Decor & Lighting",
    tags: ["lamp", "3D print", "home decor", "ambient light", "gift", "aesthetic", "swirl"],
  },
  // ─── CUSTOM PRODUCTS ──────────────────────────────────────────────────────────
  {
    name: "Vishwas Blessing Glow Lamp",
    price: 2167,
    discount: 40,
    discountedPrice: 1300,  
   
    description:
      "A warm, octagonal LED-lit plaque featuring a heartfelt Marathi prayer invoking wisdom, health, happiness, and protection. Crafted using precision 3D printing, this lamp creates a calming spiritual ambiance—perfect for desks, पूजा corners, or gifting during special occasions. The soft amber glow enhances the engraved text, making it both decorative and meaningful.",
    whyLoveIt: [
      "Creates a calm, positive atmosphere instantly",
      "Daily reminder of faith, gratitude, and well-being",
      "Soft, eye-soothing light—perfect for night use",
      "Unique handcrafted feel with modern 3D printing",
      "Thoughtful gift for family, elders, or festive occasions",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295869/sadhguru_noq4xa.png",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295869/sadhguru_noq4xa.png"],
    isCustom: true,
    inStock: true,
    category: "Custom Accessories",
    tags: ["Spiritual Decor", "LED Night Lamp", "personalized", "3D print", "Home & Living"],
  },
  {
    name: "Swami Samarth Divine Glow Lamp",
    price: 2167,
    discount: 40,
    discountedPrice: 1300,
  
    description:
      "A serene illuminated plaque featuring the silhouette of Swami Samarth with the comforting message “Bhiu Nakos, Mi Tujhya Pathishi Ahe” (Don’t fear, I am with you). The soft halo lighting highlights the spiritual presence, making it ideal for meditation spaces, bedside tables, or devotional setups.",
    whyLoveIt: [
      "Inspires strength and removes fear in daily life",
      "Radiates peaceful, protective energy",
      "Eye-catching spiritual centerpiece for any room",
      "Ideal for meditation, prayer, or quiet reflection",
      "A deeply meaningful gift for loved ones",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295871/shri_swami_samarth_cs0yvp.png",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295871/shri_swami_samarth_cs0yvp.png"],
    isCustom: true,
    inStock: true,
    category: "Custom Home Decor",
    tags:  ["Spiritual Decor", "LED Night Lamp", "personalized", "3D print", "Home & Living"],
  },
  {
    name: "Shivraj Mudra Glory Lamp",
    price: 2167,
    discount: 40,
    discountedPrice: 1300,
    
    description:
      "A striking illuminated plaque featuring the historic Rajmudra (royal seal) of Chhatrapati Shivaji Maharaj in Sanskrit script. This design symbolizes sovereignty, justice, and the vision of Swarajya. The warm backlit glow enhances the intricate lettering, making it a powerful decor statement rooted in heritage and pride.",
    whyLoveIt: [
      "Represents pride, courage, and legacy of Swarajya",
      "Unique blend of history and modern 3D design",
      "Adds a bold, inspirational touch to your space",
      "Perfect for offices, study rooms, or gifting",
      "A meaningful piece for admirers of Shivaji Maharaj",
    ],
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295870/custom_raj_mudra_qg7oca.png",
    images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295870/custom_raj_mudra_qg7oca.png"],
    isCustom: true,
    inStock: true,
    category: "Custom 3D Prints",
    tags: ["custom", "3D print", "personalized", "gift", "unique"],
  },
  {
  name: "Custom Sunglasses Holder Stand",
  price: 280,
  discount: 40,
  discountedPrice: 169,

  description:
    "A uniquely designed sunglasses holder stand that blends functionality with creativity. Crafted with a modern artistic face structure, this stand securely holds your sunglasses while doubling as a stylish decor piece. Its compact and sturdy design ensures your eyewear stays protected from scratches, misplacement, or damage, making it a perfect addition to your desk, bedside, or workspace.",

  whyLoveIt: [
    "Keeps your sunglasses safe and scratch-free",
    "Creative and eye-catching design adds personality to your space",
    "Compact and durable for everyday use",
    "Perfect for desks, bedside tables, or office setups",
    "Great gifting option for eyewear lovers"
  ],

  image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777357712/custom_sunglasses_holder_t1o9nz.png",
  images: ["https://res.cloudinary.com/dcyclqzvy/image/upload/v1777357712/custom_sunglasses_holder_t1o9nz.png"],

  isCustom: true,
  inStock: true,
  category: "Custom Accessories",
  tags: ["sunglasses holder", "3D print", "custom", "desk decor", "gift", "organizer"]
}
];

module.exports = products;
