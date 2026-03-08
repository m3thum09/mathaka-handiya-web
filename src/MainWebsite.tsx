import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useSpring, useScroll, useTransform } from 'framer-motion';
import Plasma from './component/Plasma';

// Internal Components
import { Navigation } from './component/Navigation';
import { MobileMenu } from './component/MobileMenu';
import { AnimatedCursor } from './component/AnimatedCursor';
import { ReservationForm } from './component/ReservationForm';
import { Footer } from './component/Footer';

// Performance-First Lazy Loading
const PartnersSection = lazy(() => import('./component/PartnersSection').then(m => ({ default: m.PartnersSection })));
const ComposerSection = lazy(() => import('./component/ComposerSection').then(m => ({ default: m.ComposerSection })));
const ArtistsSection = lazy(() => import('./component/ArtistsSection').then(m => ({ default: m.ArtistsSection })));
const GravityBand = lazy(() => import('./component/GravityBand').then(m => ({ default: m.GravityBand })));

function MainWebsite() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false); 
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-Performance Scroll Engine
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { damping: 55, stiffness: 85, restDelta: 0.001 });

  // Precise Transformations
  const heroOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.08], [1, 0.95]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.02], [1, 0]);

  // Snap Reveal Logic: Smoothly reveals content as it scrolls into view, then fades out as it scrolls past
  const contentY = useTransform(smoothProgress, [0.03, 0.18, 0.42], ["45vh", "0vh", "-15vh"]);
  const contentOpacity = useTransform(smoothProgress, [0.05, 0.15, 0.38, 0.48], [0, 1, 1, 0]);

  // Music Logic: Hybrid Autoplay Engine
  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.muted = false; audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error); }
    }
  }, [isPlaying]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const audio = audioRef.current;
    if (!audio) return;

    const handleAutoplay = async () => {
      try {
        audio.muted = true; await audio.play(); setIsPlaying(true);
        setTimeout(() => { if (audio) { audio.muted = false; audio.volume = 0.4; } }, 1500);
      } catch {
        const unlock = () => { if (audio.paused) { audio.muted = false; audio.play().then(() => setIsPlaying(true)); } };
        window.addEventListener('scroll', unlock, { once: true });
        window.addEventListener('click', unlock, { once: true });
      }
    };
    handleAutoplay();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#05050a] text-white font-['Montserrat',_sans-serif] selection:bg-[#b19eef]/30 outline-none cursor-none sm:cursor-auto overflow-x-hidden">
      <AnimatedCursor />
      <audio ref={audioRef} src="/background-music.mp3" loop preload="auto" />
{/* Plasma Background */}
<div className="fixed inset-0 z-0 pointer-events-none">
  <Plasma
    color="#b19eef"
    speed={0.35}
    scale={1.3}
    opacity={0.6}
  />
</div>

      <Navigation isPlaying={isPlaying} onToggleMusic={toggleMusic} onOpenMenu={() => setIsMenuOpen(true)} onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Hero Section (Fixed Overlay) */}
      <section className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-[10] px-4">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center transform-gpu mt-[-4vh]">
          <div className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[720px] mx-auto">
            <img src="/logo.png" alt="Logo" className="w-full h-auto drop-shadow-[0_0_100px_rgba(177,158,239,0.15)] select-none" />
          </div>
          <p className="mt-4 text-[10px] sm:text-[11px] md:text-[13px] tracking-[0.4em] uppercase font-medium text-white/40 italic font-['Playfair_Display'] max-w-[90vw] md:max-w-[800px] mx-auto leading-relaxed text-center">
            EXPERIENCE THE SOUL OF MUSIC WHERE MEMORIES ECHO THROUGH EVERY NOTE AND MELODY!
          </p>
        </motion.div>
        
        <motion.div style={{ opacity: scrollIndicatorOpacity }} className="absolute bottom-10 sm:bottom-12 flex flex-col items-center gap-3 lg:hidden">
            <span className="text-[9px] tracking-[0.5em] text-[#b19eef] uppercase font-semibold animate-pulse">Swipe to Echo</span>
            <div className="w-[1.5px] h-14 bg-gradient-to-b from-[#b19eef] via-[#b19eef]/20 to-transparent relative overflow-hidden rounded-full">
                <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute inset-0 w-full h-full bg-white/60" />
            </div>
        </motion.div>
      </section>

      <main className="relative z-[20]">
        <section className="h-[80vh] sm:h-[100vh] pointer-events-none" />

        {/* Crafting & Partners (The Sticky Snap Layer) */}
        <section className="relative flex flex-col items-center px-6 sm:px-12 lg:px-24 mb-[15vh]">
          <motion.div style={{ y: contentY, opacity: contentOpacity }} className="sticky top-[25vh] sm:top-[30vh] w-full max-w-[1400px] text-center z-[30] transform-gpu">
            <h3 className="text-4xl sm:text-6xl md:text-8xl font-light leading-snug tracking-tighter mb-10">
              Crafting <span className="text-[#b19eef]/30 italic font-['Playfair_Display']">unforgettable</span> <br className="hidden md:block"/> 
              musical narratives.
            </h3>

            <div className="mt-10 max-w-2xl mx-auto group mb-12">
              <div className="bg-[#0a0a0f]/60 p-10 sm:p-20 rounded-[3rem] border border-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:border-[#b19eef]/30">
                <span className="text-[#b19eef] text-[10px] md:text-[12px] tracking-[0.5em] uppercase mb-4 block font-bold">Tickets Availability</span>
                <h4 className="text-xl sm:text-2xl font-light text-white/60 mb-8 sm:mb-12 leading-relaxed text-center font-['Montserrat']">Secure your presence at the intersection of memory and melody.</h4>
                <button onClick={() => setIsReservationOpen(true)} className="bg-white text-black px-10 py-4 sm:px-14 sm:py-5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-[#b19eef] hover:text-white transition-all transform-gpu hover:scale-105 active:scale-95 mx-auto block">
                  Reserve Your Tickets
                </button>
              </div>
            </div>

            {/* Logo Loop Section: Sticky layer */}
            <div className="relative w-full text-center">
              <span className="text-[#b19eef] text-[10px] tracking-[0.6em] uppercase mb-8 block font-bold opacity-70">In Collaboration With</span>
              <Suspense fallback={<div className="h-20 opacity-0" />}><PartnersSection /></Suspense>
            </div>
          </motion.div>
        </section>

        {/* Core Sections (Staking Scroll Flow) */}
        <section className="relative z-[30] bg-[#05050a] w-full space-y-32 sm:space-y-48 pb-32 pt-20">
            <Suspense fallback={<div className="h-screen" />}><ComposerSection /></Suspense>
            <Suspense fallback={<div className="h-screen" />}><ArtistsSection /></Suspense>
            <Suspense fallback={<div className="h-screen" />}><GravityBand /></Suspense>
        </section>

        {/* Modern Fixed Footer */}
        <footer className="relative bg-[#05050a] border-t border-white/5">
          <div className="sticky bottom-0 w-full bg-[#05050a]/90 backdrop-blur-xl">
             <Footer />
             <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#b19eef]/30 to-transparent" />
          </div>
        </footer>
      </main>

      <AnimatePresence mode='wait'>
        {isReservationOpen && <ReservationForm onClose={() => setIsReservationOpen(false)} />}
        {isMenuOpen && (
          <MobileMenu isPlaying={isPlaying} onToggleMusic={toggleMusic} onClose={() => setIsMenuOpen(false)} onOpenReservation={() => setIsReservationOpen(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainWebsite;