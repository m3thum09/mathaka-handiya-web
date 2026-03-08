"use client";
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* Artists Data */
const ARTISTS = [
  { id: 1, name: "Romesh Sugathapala", role: "Vocals", image: "/Artist/roma.jpeg" },
  { id: 2, name: "Hana Shafa", role: "Vocals", image: "/Artist/hana safa.jpeg" },
  { id: 3, name: "Bhashi Devanga", role: "Vocals", image: "/Artist/bashii.jpg" },
  { id: 4, name: "Ravi Royster", role: "Vocals", image: "/Artist/ravi.jpg" },
  { id: 5, name: "Lavan Abhishek", role: "Vocals", image: "/Artist/lavan.jpg" },
  { id: 6, name: "Irosh Rathnayake", role: "Vocals", image: "/Artist/irosh.jpg" },
];

export const ArtistsSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection logic - Hydration errors avoidance
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 1024);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <section className="relative w-full py-10 md:py-16 overflow-hidden z-[22]">
      {/* Header Block */}
      <div className="px-6 md:px-24 mb-16 max-w-[1400px] mx-auto sm:text-left lg:text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[#b19eef] text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-bold block mb-4 opacity-80">
            The Melodic Ensemble
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white font-['Playfair_Display'] italic">
            Our <span className="opacity-20 not-italic">Featured</span> Artists
          </h2>
        </motion.div>
      </div>

      {/* Fluid Accordion Container */}
      <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[60vh] gap-3 px-4 lg:px-10">
        {ARTISTS.map((artist) => (
          <ArtistCard 
            key={artist.id} 
            artist={artist} 
            isMobile={isMobile} 
            isHovered={hoveredId === artist.id}
            onHover={() => setHoveredId(artist.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </section>
  );
};

const ArtistCard = ({ artist, isMobile, isHovered, onHover, onLeave }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  // Mobile device scroll effect - Transition from grayscale to color as the card enters the viewport
  const grayscale = useTransform(scrollYProgress, [0.3, 0.7], ["grayscale(100%)", "grayscale(0%)"]);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-700 ease-[0.23,1,0.32,1] cursor-pointer 
        ${isMobile ? "min-h-[450px] mb-4 w-full" : "flex-1 lg:h-full"} 
        ${!isMobile && isHovered ? "lg:flex-[3] border-[#b19eef]/20 shadow-2xl" : "lg:flex-[1]"}
      `}
    >
      {/* Visual Engine */}
      <motion.img
        src={artist.image}
        alt={artist.name}
        animate={{ scale: isHovered && !isMobile ? 1.05 : 1 }}
        style={{ filter: isMobile ? grayscale : (isHovered ? 'grayscale(0%)' : 'grayscale(100%)') }}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      />
      
      {/* Gradient Overlay - Plasma theme */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/20 to-transparent transition-opacity duration-700 ${isHovered ? "opacity-80" : "opacity-60"}`} />

      {/* Content Layer */}
      <div className="absolute bottom-8 left-8 right-8 overflow-hidden">
        <div className="flex flex-col">
            <motion.span 
              animate={{ opacity: isHovered || isMobile ? 0.7 : 0, y: isHovered || isMobile ? 0 : 10 }}
              className="text-[#b19eef] text-[8px] tracking-[0.4em] uppercase mb-2"
            >
                {artist.role}
            </motion.span>
            
            <h4 className={`text-white tracking-wider font-light transition-all duration-700 whitespace-nowrap
                ${!isMobile && !isHovered ? "text-sm [writing-mode:vertical-lr] rotate-180 opacity-40" : "text-xl md:text-2xl opacity-100"}
            `}>
                {artist.name}
            </h4>
        </div>
        
        {/* Animated Underline */}
        <motion.div 
          animate={{ width: isHovered || isMobile ? "100%" : "0%" }}
          className="h-[1px] bg-gradient-to-r from-[#b19eef]/40 to-transparent mt-3" 
        />
      </div>

      {/* Border Glow on Hover */}
      <div className={`absolute inset-0 border border-[#b19eef]/10 rounded-[2rem] transition-opacity duration-700 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`} />
    </motion.div>
  );
};