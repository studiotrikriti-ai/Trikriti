"use client";

import { useState } from "react";
import { contactAPI } from "@/lib/api";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await contactAPI.send(form);
      toast.success("Message sent! We'll reply shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Header */}
      <div className="bg-brand-black text-white py-16 px-4 sm:px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-3">Get In Touch</p>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">Contact Us</h1>
        <p className="text-gray-400 font-body max-w-md mx-auto">
          Have a question or a custom order request? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          <h2 className="font-heading font-bold text-2xl mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                Message <span className="text-brand-red">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your project or enquiry..."
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2 w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-6">Contact Information</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                  <a href="mailto:studiotrikriti@gmail.com" className="text-sm font-medium hover:text-brand-red transition-colors">
                    studiotrikriti@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Phone / WhatsApp</p>
                  <p className="text-sm font-medium">+91 9175825605</p>
                  <p className="text-sm font-medium">+91 7841059939</p>
                  <p className="text-xs text-gray-400 mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-sm font-medium">India</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pan-India delivery available</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/trikriti.studio?igsh=eWZwNzBlaDZtcHZu" },
                
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-12 h-12 border-2 border-gray-200 flex items-center justify-center hover:border-brand-red hover:bg-brand-red hover:text-white transition-all duration-200 text-gray-500"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="bg-brand-gray p-6 border border-gray-100">
            <h3 className="font-heading font-semibold mb-3">Common Queries</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📦 Order takes 3–5 business days to dispatch</li>
              <li>🎨 Custom orders may take 5–7 business days</li>
              <li>💳 We accept UPI & Cash on pickup</li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
