"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Which inverter battery is best for my home?",
    answer: "The right inverter battery depends on your power requirements, backup duration, and inverter capacity. Our experts can help you choose the best battery for your needs.",
  },
  {
    question: "Why should I use an RO water purifier?",
    answer: "An RO water purifier removes dissolved impurities, harmful chemicals, bacteria, and viruses, providing clean and safe drinking water.",
  },
  {
    question: "How often should RO filters be replaced?",
    answer: "Sediment and carbon filters are generally replaced every 6–12 months, while the RO membrane typically lasts 2–3 years, depending on water quality.",
  },
  {
    question: "Does an RO purifier remove bacteria and viruses?",
    answer: "Yes. RO purification, combined with UV or UF technology (depending on the model), effectively removes bacteria, viruses, and other harmful contaminants.",
  },
  {
    question: "Which RO purifier is suitable for my home?",
    answer: "The ideal purifier depends on your water source, TDS level, and daily water consumption. We can recommend the best model after assessing your needs.",
  },
  {
    question: "Can I replace RO filters myself?",
    answer: "Some filters are easy to replace, but professional servicing is recommended to ensure proper installation and system performance.",
  },
  {
    question: "Do you provide original RO membranes?",
    answer: "Yes. We supply high-quality, genuine RO membranes designed for efficient purification and long-lasting performance.",
  },
  {
    question: "Are your spare parts compatible with all RO brands?",
    answer: "We stock spare parts compatible with most major RO purifier brands. Contact us to confirm compatibility with your model.",
  },
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFBFD] border-t border-slate-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-rose-500/5 rounded-md blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-md blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-gradient text-3xl sm:text-4xl font-extrabold tracking-tight font-serif mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-semibold leading-relaxed">
            Find answers to common questions about our battery inverter backups, RO water purifiers, and doorstep maintenance services.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/50 rounded-md overflow-hidden shadow-[0_2px_15px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_25px_rgba(15,23,42,0.02)] transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex items-center justify-center w-8 h-8 rounded-md border shrink-0 ${isOpen
                      ? "bg-rose-50 border-rose-100 text-rose-600"
                      : "bg-slate-50 border-slate-200/60 text-slate-400"
                      }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-6 text-sm sm:text-base font-semibold text-slate-500 leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
