"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-background border-t border-white/5 py-20 z-10 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-10 md:mb-0 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            Let's build something <span className="text-primary italic">secure</span>.
          </h2>
          <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">
            Available for freelance opportunities
          </p>
        </div>
        
        <a 
          href="mailto:hello@example.com"
          className="group relative flex items-center justify-center w-40 h-40 bg-surface rounded-full border border-white/10 hover:border-primary hover:bg-primary/5 transition-colors duration-500 hover-magnetic"
        >
          <span className="font-display font-semibold tracking-wide text-white group-hover:text-primary transition-colors flex items-center gap-2">
            Get in touch <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </div>
      
      <div className="container mx-auto px-6 lg:px-20 mt-20 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-neutral-600 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} MD Emon Sarker.</p>
        <p>Awwwards Worthy Architecture.</p>
      </div>
    </footer>
  );
}
