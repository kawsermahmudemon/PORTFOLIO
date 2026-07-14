"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Project {
  title: string;
  category: string;
  tech: string[];
  description: string;
}

const projects: Project[] = [
  {
    title: "Zero Trust Architecture",
    category: "Cyber Security",
    tech: ["Linux", "Networking", "Python"],
    description: "A comprehensive zero-trust network implementation designed for enterprise infrastructure.",
  },
  {
    title: "Quantum Key Distribution",
    category: "Research",
    tech: ["C++", "Cryptography"],
    description: "Simulating quantum key distribution protocols for next-generation secure communications.",
  },
  {
    title: "Awwwards Portfolio",
    category: "Creative Dev",
    tech: ["Next.js", "Three.js", "GSAP"],
    description: "Award-winning immersive portfolio with WebGL and cinematic scroll animations.",
  }
];

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full aspect-[4/3] rounded-2xl bg-surface border border-white/5 overflow-hidden group cursor-pointer hover-magnetic"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(-50px)" }}
      />
      
      <div 
        className="absolute inset-0 p-8 flex flex-col justify-between"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex justify-between items-start">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {project.category}
          </span>
          <ArrowUpRight className="text-white/30 group-hover:text-white transition-colors duration-300" />
        </div>

        <div>
          <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">
            {project.title}
          </h3>
          
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <p className="text-neutral-400 text-sm mb-4 mt-2">
              {project.description}
            </p>
            <div className="flex gap-2 flex-wrap">
              {project.tech.map((t, i) => (
                <span key={i} className="text-[10px] uppercase font-mono px-2 py-1 border border-white/10 rounded-full text-white/50">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="relative min-h-screen w-full bg-background py-32 z-10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
            Selected <span className="text-primary italic">Works</span>.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[2000px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
