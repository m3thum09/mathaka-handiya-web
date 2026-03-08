import { motion } from 'framer-motion';

// Mobile Menu
interface MobileMenuProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  onClose: () => void;
  onOpenReservation: () => void; 
}

export const MobileMenu = ({ isPlaying, onToggleMusic, onClose, onOpenReservation }: MobileMenuProps) => {
  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      // Glassmorphism: backdrop-blur-3xl and bg-white/[0.03] ensures premium look
      className="fixed inset-y-0 right-0 z-[200] w-[80%] bg-white/[0.03] backdrop-blur-3xl border-l border-white/10 flex flex-col items-center justify-center shadow-2xl md:hidden outline-none transform-gpu"
    >
      {/* Top bar: Music Control & Close Button */}
      <div className="absolute top-6 w-full px-8 flex justify-between items-center outline-none">
        
        {/* MOBILE MUSIC VISUALIZER CONTROL */}
        <div 
          onClick={onToggleMusic} 
          title={isPlaying ? "Pause Music" : "Play Music"}
          className="flex items-center gap-[3px] h-5 cursor-pointer focus:outline-none border-none group"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              animate={isPlaying ? { 
                scaleY: [0.4, 1, 0.4] 
              } : { scaleY: 0.4 }} 
              transition={{ 
                repeat: Infinity, 
                duration: 1 + (i * 0.1), 
                ease: "easeInOut" 
              }} 
              className="w-[2px] h-4 bg-[#b19eef] rounded-full origin-center pointer-events-none transform-gpu" 
            />
          ))}
        </div>

        {/* CLOSE BUTTON WITH ACCESSIBILITY */}
        <button 
          onClick={onClose} 
          title="Close Menu"
          aria-label="Close Navigation Menu"
          className="text-white/60 text-3xl font-light focus:outline-none border-none outline-none cursor-pointer hover:text-[#b19eef] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* --- MENU CONTENT --- */}
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/20 tracking-[1em] uppercase text-[10px] mb-12 select-none font-medium"
      >
        Menu
      </motion.h2>

      <div className="flex flex-col gap-5 w-full px-12 font-semibold">
<motion.button 
  onClick={() => {
    onOpenReservation(); // Reservation Form open
    onClose();           // Close Menu
  }}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 }}
  className="w-full bg-[#b19eef] text-black py-4 rounded-xl uppercase tracking-[0.2em] text-[11px] shadow-[0_10px_30px_rgba(177,158,239,0.2)] focus:outline-none border-none cursor-pointer active:scale-95 transition-transform"
>
  My Tickets
</motion.button>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white/5 border border-white/10 text-white/70 py-4 rounded-xl uppercase tracking-[0.2em] text-[11px] focus:outline-none cursor-pointer hover:bg-white/10 transition-colors"
        >
          Contact Us
        </motion.button>
      </div>

      {/* FOOTER DECORATION */}
      <div className="absolute bottom-10 opacity-10 select-none">
        <span className="text-[8px] tracking-[0.5em] uppercase font-medium">Mathaka Handiya</span>
      </div>
    </motion.div>
  );
};

export default MobileMenu;