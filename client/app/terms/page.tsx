export const metadata = { title: "Terms & Conditions — Trikriti Studio" };

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the Trikriti Studio website or placing an order, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.`,
    },
    {
      title: "2. Products & Orders",
      content: `All products are subject to availability. We reserve the right to limit quantities. Product images are for illustrative purposes and may vary slightly from the actual product. For custom orders, the final product will be based on the design/instructions provided by you. We are not responsible for errors in customer-provided designs.`,
    },
    {
      id: "shipping",
      title: "3. Shipping Policy",
      content: `We ship pan-India. Standard delivery takes 5–8 business days from dispatch. Custom orders are dispatched within 3–7 business days of order confirmation. Trikriti Studio is not responsible for delays caused by shipping partners or events beyond our control. Shipping is free on all orders unless otherwise stated.`,
    },
    {
      id: "refund",
      title: "4. Refund & Exchange Policy",
      content: `We accept exchange requests within 7 days of delivery for manufacturing defects or incorrect items. Custom-printed products are non-refundable unless defective. To initiate an exchange, contact us at studiotrikriti@gmail.com with your order ID and photos of the issue. Refunds, if approved, are processed within 7–10 business days.`,
    },
    {
      title: "5. Payments",
      content: `We accept UPI and Cash on Delivery (COD). For UPI payments, orders are confirmed only after payment verification. We reserve the right to cancel orders where payment verification fails. Prices are in Indian Rupees (INR) inclusive of applicable taxes.`,
    },
    {
      title: "6. Intellectual Property",
      content: `All content on this website including logos, graphics, product designs, and text is the property of Trikriti Studio. You may not reproduce, distribute, or use our content without explicit written permission. By submitting custom design artwork, you represent that you own or have rights to use such designs. Trikriti Studio is not liable for copyright infringement in customer-provided artwork.`,
    },
    {
      title: "7. Limitation of Liability",
      content: `Trikriti Studio shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our maximum liability shall not exceed the amount paid for the specific order in question.`,
    },
    {
      title: "8. Governing Law",
      content: `These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.`,
    },
    {
      title: "9. Contact",
      content: `For any questions regarding these terms, contact us at studiotrikriti@gmail.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-white">
      <div className="bg-brand-black text-white py-14 px-4 sm:px-6 text-center">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-3">Terms & Conditions</h1>
        <p className="text-gray-400 text-sm">Last updated: June 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-brand-red/5 border-l-4 border-brand-red p-5 mb-10">
          <p className="text-sm text-gray-700 leading-relaxed">
            Please read these terms carefully before using our website or placing an order with <strong>Trikriti Studio</strong>.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} id={s.id}>
              <h2 className="font-heading font-bold text-xl mb-3 text-brand-black">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
