"use client";

import { motion } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

export default function HeroSection() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const socialLinks = [
    { icon: <FaGithub size={20} />, href: "https://github.com", label: "GitHub" },
    { icon: <FaLinkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaFacebook size={20} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaInstagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Mail size={20} />, href: "mailto:hello@example.com", label: "Email" },
  ];

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center z-10 pointer-events-none">
      <div className="container mx-auto px-6 lg:px-20 text-center flex flex-col items-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-primary tracking-[0.3em] uppercase text-sm mb-4 font-mono pointer-events-auto"
        >
          Cyber Security & Creative Developer
        </motion.p>
        
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-5xl md:text-7xl lg:text-9xl font-display font-bold tracking-tighter mb-6 pointer-events-auto hover-magnetic"
        >
          MD Emon
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
            Sarker
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-neutral-400 max-w-xl mx-auto text-lg md:text-xl font-light pointer-events-auto"
        >
          Building secure infrastructure and immersive digital experiences at Southeast University, Bangladesh.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-wrap justify-center gap-6 mt-12 pointer-events-auto"
        >
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="p-4 rounded-full border border-white/10 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover-magnetic"
            >
              {link.icon}
            </a>
          ))}
          <a
            href="/resume.pdf"
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover-magnetic"
          >
            <Download size={20} />
            Resume
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-500">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
