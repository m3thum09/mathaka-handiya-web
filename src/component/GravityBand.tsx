import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const GravityBand = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect for the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#05050a] pt-16 pb-8 sm:pt-20 sm:pb-10 px-6 sm:px-10 overflow-hidden border-t border-white/5"
    >
      {/* Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b19eef]/30 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content Box */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 z-10 text-center lg:text-left"
          >
            <div>
              <span className="text-[#b19eef] text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-bold block mb-4 opacity-80">
                Live Performance By
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-none mb-6">
                The <span className="font-serif italic text-[#b19eef]/60">Gravity</span> <br className="hidden md:block" /> Band
              </h2>
            </div>
            
            <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light italic tracking-wide">
              "Bringing the weight of every note to life. An orchestral experience that transcends time, exclusively at Mathaka Handiya."
            </p>

            <div className="flex justify-center lg:justify-start items-center gap-4 opacity-30">
              <div className="w-12 h-[1px] bg-[#b19eef]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#b19eef] animate-pulse" />
              <div className="w-12 h-[1px] bg-[#b19eef]" />
            </div>
          </motion.div>

          {/* Image Box (Modern Floating Frame) */}
          <motion.div 
            style={{ y: imageY, opacity }}
            className="relative group"
          >
            {/* Background Decorative Blur */}
            <div className="absolute inset-0 bg-[#b19eef]/10 blur-[80px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
            
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <motion.img 
                src="Band/DSC09121 a.png" 
                alt="The Gravity Band"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-110 group-hover:scale-100"
              />
              {/* Overlapping Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Float Element */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block">
               <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-2 right-2" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Symphonic Resonance</span>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};