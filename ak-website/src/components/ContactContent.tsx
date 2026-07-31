"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactContent() {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    service: "Battery Backup",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

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

  const contactDetails = [
    {
      icon: <Phone className="w-5 h-5 text-rose-600" />,
      title: "Call Direct",
      value: "+91 88705 34049",
      sub: "Mon - Sun, 8 AM - 9 PM",
      href: "tel:+918870534049",
    },
    {
      icon: <InstagramIcon className="w-5 h-5 text-rose-600" />,
      title: "Instagram",
      value: "@kaviprasath_269",
      sub: "Follow us for updates & offers",
      href: "https://www.instagram.com/kaviprasath_269",
    },
    {
      icon: <Mail className="w-5 h-5 text-rose-600" />,
      title: "Email Support",
      value: "akbattery.ro@gmail.com",
      sub: "General & Sales inquiries",
      href: "mailto:akbattery.ro@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5 text-rose-600" />,
      title: "Service Center",
      value: "Main Road, Kannamangalam",
      sub: "Tiruvannamalai DT, Tamil Nadu - 632311",
      href: "https://maps.google.com/?q=Kannamangalam+Tamil+Nadu",
    },
    {
      icon: <Clock className="w-5 h-5 text-rose-600" />,
      title: "Working Hours",
      value: "8:00 AM - 9:00 PM",
      sub: "Open 6 Days a week",
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-mesh-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-md border border-rose-100 inline-block mb-4">
            Get In Touch
          </span>
          <h1 className="text-gradient text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Have questions about battery pricing, inverter setups, or filter servicing? Write to us or call our dispatch desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">

        {/* Info cards (Left Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <h2 className="text-lg font-extrabold text-[#0B1B3A] mb-4">
            Reach Our Sales & Doorstep Technician Support Desk
          </h2>
          <div className="flex flex-col gap-4">
            {contactDetails.map((detail, idx) => {
              const cardContent = (
                <div className="flex gap-4 p-5 bg-white rounded-md border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.03)] hover:border-rose-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-md bg-rose-50 flex items-center justify-center border border-rose-100/50 flex-shrink-0">
                    {detail.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {detail.title}
                    </h3>
                    <span className="block text-slate-800 font-bold text-base select-all">
                      {detail.value}
                    </span>
                    <span className="text-slate-500 text-xs mt-0.5 block font-medium">
                      {detail.sub}
                    </span>
                  </div>
                </div>
              );

              return detail.href ? (
                <a key={idx} href={detail.href} target="_blank" rel="noopener noreferrer" className="block select-none">
                  {cardContent}
                </a>
              ) : (
                <div key={idx}>{cardContent}</div>
              );
            })}
          </div>
        </div>

        {/* Map Viewport Card (Right Column) */}
        <div className="lg:col-span-7 flex flex-col">
          <h2 className="text-lg font-extrabold text-[#0B1B3A] mb-4">
            Our Store & Service Location in Kannamangalam
          </h2>
          <div className="overflow-hidden rounded-md border border-slate-100/80 bg-white shadow-[0_4px_30px_rgba(15,23,42,0.02)] flex-1 min-h-[350px] lg:min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31131.74113150527!2d79.14472230348446!3d12.748114010933149!2m3!1f0!2f0!3f0!2m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad24da3fd889dd%3A0x4f225e48db513b55!2sKannamangalam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1783667398885!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                title="AK Battery Location"
              />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
