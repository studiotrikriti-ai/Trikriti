import { Shield, Truck, Layers, Gift } from "lucide-react";

const reasons = [
  {
    icon: Layers,
    title: "Premium 3D Printing",
    desc: "Every product is precision-crafted using high-quality 3D printing technology — durable, detailed, and designed to stand out.",
  },
  {
    icon: Gift,
    title: "Perfect for Gifting",
    desc: "Personalized keychains, glowing lamps, custom prints — unique gifts for birthdays, anniversaries, and every occasion.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    desc: "We ship across India. Orders dispatched within 3–5 business days with real-time order tracking available.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "100% satisfaction promise. If you're not happy with your order, we make it right — always.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-brand-gray py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">Why Choose Us</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-black">
            The Trikriti Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white p-6 border border-gray-100 hover:border-brand-red transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors duration-300">
                <r.icon size={22} className="text-brand-red group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
