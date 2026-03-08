import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ComposerSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection logic
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 1024);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Mobile Scroll tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Mobile Scroll Transform
  const mobileGrayscale = useTransform(
    scrollYProgress, 
    [0.4, 0.6], 
    ["grayscale(100%)", "grayscale(0%)"]
  );

  return (

    <section className="relative w-full py-0 px-10 sm:px-16 lg:px-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center justify-center">
          
          {/* Right (Text Content) */}
          <div className="space-y-8 md:space-y-12 order-1 lg:order-2 w-full text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-4 md:space-y-6"
            >
              <span className="text-[#b19eef] text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-bold block opacity-90">
                The Visionary Maestro
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-tight text-white">
                Nimesh <br />
                <span className="text-white/20 font-serif italic font-normal">Kulasinghe</span>
              </h2>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <p className="text-white/40 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm font-light italic tracking-wide mx-auto lg:mx-0">
                "Music is the bridge between what we remember and what we feel. His melodies are the heartbeat of Mathaka Handiya."
              </p>
            </motion.div>
          </div>

          {/* Left (Image Section) */}
          <motion.div 
            ref={targetRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative group order-2 lg:order-1 flex justify-center w-full"
          >
            {/* Image Box size optimized for center view */}
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] rounded-[3rem] overflow-hidden border border-white/5 aspect-[4/5] bg-white/[0.02] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              <motion.img 
                src="/Nimesh Kulasinghe.jpeg" // path එක Artist folder එක ඇතුළට මාරු කළා
                alt="Maestro Nimesh Kulasinghe" 
                style={{ filter: isMobile ? mobileGrayscale : 'none' }}
                className={`
                  w-full h-full object-cover transition-all duration-1000 ease-out transform group-hover:scale-105 pointer-events-none
                  ${!isMobile ? "lg:grayscale lg:hover:grayscale-0" : ""}
                `}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};