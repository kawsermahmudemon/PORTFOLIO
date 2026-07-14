"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const pRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      pRefs.current.forEach((p, index) => {
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLParagraphElement) => {
    if (el && !pRefs.current.includes(el)) {
      pRefs.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-surface flex items-center py-32 z-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 ref={textRef} className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
            The Intersection of <span className="text-primary">Security</span> & <span className="text-primary">Design</span>.
          </h2>
          <div className="space-y-6 text-neutral-400 text-lg md:text-xl font-light">
            <p ref={addToRefs}>
              I am MD Emon Sarker, a Cyber Security student at Southeast University in Bangladesh, and a passionate Creative Developer.
            </p>
            <p ref={addToRefs}>
              My work bridges the gap between unbreakable infrastructure and unforgettable user experiences. Whether I'm configuring secure Linux environments or crafting award-winning WebGL interfaces, my goal is always excellence.
            </p>
            <p ref={addToRefs}>
              I believe that true luxury in software is found in the details: a perfectly timed animation, a zero-trust network architecture, and an interface that feels like magic.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            {/* Skills Grid */}
            {[
              "Cyber Security", "Networking", "Linux", 
              "React", "Next.js", "Node.js", 
              "C++", "Java", "Python"
            ].map((skill, index) => (
              <div 
                key={index}
                className="p-6 border border-white/5 rounded-xl bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-500 flex items-center justify-center text-center hover-magnetic"
              >
                <span className="font-mono text-sm tracking-widest text-neutral-300">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
