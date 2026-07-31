
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, Phone, Pin } from "lucide-react";

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

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Company */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.svg"
                                alt="AK Batteries Logo"
                                width={36}
                                height={36}
                                className="w-9 h-9 object-contain bg-white rounded-md p-0.5"
                            />
                            <h3 className="text-xl font-bold text-white">
                                AK Batteries & RO Solutions
                            </h3>
                        </div>
                        <p className="text-sm leading-6">
                            Your trusted partner for premium batteries, RO water purifiers,
                            genuine spare parts, installation, and maintenance services.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-5">
                            <a
                                href="https://www.instagram.com/kaviprasath_269"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow AK Batteries on Instagram"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700/80 hover:border-rose-500/40 transition-all duration-300 text-xs font-semibold group shadow-xs"
                            >
                                <InstagramIcon className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                                <span>Follow on Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/batteries-inverters" className="hover:text-rose-400 transition-colors flex items-center gap-1.5 font-medium">
                                    UPS Inverters & Batteries
                                </Link>
                            </li>
                            <li>
                                <Link href="/water-purifier" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-medium">
                                    RO Water Purifier
                                </Link>
                            </li>
                            <li>
                                <Link href="/works" className="hover:text-white transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white my-5">
                            Contact Info
                        </h3>

                        <div className="space-y-4 text-sm">

                            <div className="flex items-start gap-3">
                                <Pin className="w-5 h-5 mt-0.5 text-rose-500 shrink-0" />
                                <span className="leading-6">
                                    Main Road, Kannamangalam, Tiruvannamalai DT, Tamil Nadu - 632311
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 " />
                                <a
                                    href="tel:+918870534049"
                                    className="hover:text-white transition-colors"
                                >
                                    +91 88705 34049
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                <a
                                    href="mailto:akbattery.ro@gmail.com"
                                    className="hover:text-white transition-colors break-all"
                                >
                                    akbattery.ro@gmail.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5" />
                                <span>Mon - Sat : 9:00 AM - 7:00 PM</span>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
                    <p>
                        © {new Date().getFullYear()} AK Batteries & RO Solutions. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}