"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { Button } from "./ui/Button";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    service: "Battery Backup",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleClose = () => {
    onClose();
    // Reset state after a short delay so user doesn't see visual jump
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", service: "Battery Backup", message: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-955/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-md bg-white rounded-md p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                  Request an Enquiry
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Enter your details below and our service engineers will contact you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="modal-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full h-11 px-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="modal-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="modal-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 transition-all"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="modal-service" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service Required
                    </label>
                    <select
                      id="modal-service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 bg-white transition-all"
                    >
                      <option value="Battery Backup">Inverter & Battery Purchase/Service</option>
                      <option value="RO Purifier">RO Water Purifier Purchase/Service</option>
                      <option value="Both Services">Both Solutions</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="modal-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message/Requirements (Optional)
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your requirement..."
                      className="w-full px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 resize-none transition-all"
                    />
                  </div>

                  {/* Info Row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Responds within 2 hrs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Certified Engineers</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      className="w-full justify-center"
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                  Enquiry Submitted!
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Thank you, <span className="font-bold text-slate-800">{formData.name}</span>.
                  Our executive will call you on <span className="font-bold text-slate-800">{formData.phone}</span> within 2 hours.
                </p>
                <Button
                  onClick={handleClose}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  Close Window
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
