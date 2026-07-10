"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";
import { Button } from "./ui/Button";


export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
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
    { name: "Works", href: "/works" },
    { name: "About us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const activeItem = React.useMemo(() => {
    const current = navItems.find((item) => item.href === pathname);
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
              className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 select-none transition-transform hover:scale-105 inline-block"
            >
              AK
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => (
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
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                window.open("https://wa.me/918870534049?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20your%20Battery%20and%20RO%20services.", "_blank", "noopener,noreferrer");
              }}
            >
              Enquire now
            </Button>
          </div>

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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
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
          ))}
          <div className="pt-4 border-t border-slate-100 px-4">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center shadow-sm"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Enquire now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
