export default function MarqueeStrip() {
  const items = [
    "3D Printed Products",
    "Mini Tumbler Keychains",
    "Aurora Prism Lamps",
    "Luna Swirl Lamps",
    "Custom Name Gifts",
    "40% Off Live Now",
    "Pan-India Delivery",
    "Premium 3D Printing",
    "Unique Gift Ideas",
    "Handcrafted With Care",
  ];

  return (
    <div className="bg-brand-red text-white py-3 overflow-hidden">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="px-6 text-sm font-body font-medium tracking-wide whitespace-nowrap">
            {item}
            <span className="mx-6 opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
