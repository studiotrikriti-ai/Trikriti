export const metadata = { title: "Privacy Policy — Trikriti Studio" };

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `When you place an order or contact us, we collect personal information including your name, email address, phone number, and delivery address. We also collect order and transaction details necessary to fulfill your purchase. If you use optional Firebase login, we receive your authentication data from Google/Firebase.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to: (a) process and fulfill your orders; (b) communicate order updates and delivery status; (c) respond to your queries and support requests; (d) improve our products and services; (e) comply with legal obligations. We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
    },
    {
      title: "3. Data Storage & Security",
      content: `Your data is stored securely on our servers using industry-standard encryption. Payment transactions via UPI are processed externally and we do not store card or UPI credentials. We retain your order data for up to 2 years for legal and dispute resolution purposes.`,
    },
    {
      title: "4. Cookies",
      content: `We use minimal cookies to maintain your shopping cart session and improve your browsing experience. We do not use tracking cookies for advertising. You may disable cookies in your browser settings, though this may affect some site functionality.`,
    },
    {
      title: "5. Third-Party Services",
      content: `We use the following third-party services: Firebase (authentication), Cloudinary (image storage), and shipping partners for order delivery. Each of these services has their own privacy policies. We recommend reviewing them independently.`,
    },
    {
      title: "6. Your Rights",
      content: `You have the right to access, correct, or delete your personal data. To make a request, contact us at studiotrikriti@gmail.com. We will respond within 30 days. You may also opt out of marketing communications at any time.`,
    },
    {
      title: "7. Children's Privacy",
      content: `Our services are not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
    },
    {
      title: "8. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised date. Continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: "9. Contact Us",
      content: `For any privacy-related questions or concerns, please contact us at: studiotrikriti@gmail.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-white">
      <div className="bg-brand-black text-white py-14 px-4 sm:px-6 text-center">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-3">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: June 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-brand-red/5 border-l-4 border-brand-red p-5 mb-10">
          <p className="text-sm text-gray-700 leading-relaxed">
            At <strong>Trikriti Studio</strong>, we respect your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-heading font-bold text-xl mb-3 text-brand-black">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
