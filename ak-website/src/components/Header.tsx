"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { EnquiryModal } from "./EnquiryModal";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      href: "/works",
      dropdown: [
        { name: "RO Purifiers", href: "/water-purifier" },
        { name: "Batteries & Inverters", href: "/batteries-inverters" },
      ],
    },
    { name: "About us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const activeItem = React.useMemo(() => {
    const current = navItems.find(
      (item) =>
        item.href === pathname ||
        (item.dropdown && item.dropdown.some((sub) => sub.href === pathname))
    );
    return current ? current.name : "Home";
  }, [pathname]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-md shadow-[0_2px_20px_rgba(15,23,42,0.03)] border-b border-slate-100"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 select-none transition-transform hover:scale-105"
            >
              <Image
                src="/logo.svg"
                alt="AK Batteries Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              if (item.dropdown) {
                const isDropdownActive = item.dropdown.some((sub) => sub.href === pathname);
                return (
                  <div key={item.name} className="relative group flex items-center h-full py-4">
                    <button
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1 text-slate-600 hover:text-rose-600 hover:bg-slate-50 focus:outline-none ${isDropdownActive ? "text-rose-600 bg-rose-50/50" : ""
                        }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 hidden group-hover:block bg-white border border-slate-100 rounded-2xl shadow-xl py-2 w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={handleNavClick}
                          className={`block px-4 py-2.5 text-xs font-bold transition-colors uppercase tracking-wider ${pathname === sub.href ? "text-rose-600 bg-rose-50/20" : "text-slate-600 hover:text-rose-600 hover:bg-slate-50"
                            }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeItem === item.name
                    ? "text-rose-600 bg-rose-50/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>


          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${isOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.name} className="space-y-1">
                  <div className="px-4 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                    {item.name}
                  </div>
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={handleNavClick}
                      className={`block px-6 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${pathname === sub.href
                        ? "text-rose-600 bg-rose-50 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors duration-200 ${activeItem === item.name
                  ? "text-rose-600 bg-rose-50 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 px-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full justify-center shadow-sm"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
