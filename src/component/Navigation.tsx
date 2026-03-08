import { motion } from 'framer-motion';

interface NavProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  onOpenMenu: () => void;
  onOpenReservation: () => void; // Reservation Modal open Function
}

export const Navigation = ({ isPlaying, onToggleMusic, onOpenMenu, onOpenReservation }: NavProps) => (
  // Navigation Bar with Premium Slide-down Animation
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1], 
      delay: 0.2 
    }}
    className="fixed top-0 w-full z-[100] flex justify-between items-center px-6 md:px-16 py-6 transform-gpu"
  >
    {/* Left: Logo Section */}
    <div className="flex items-center gap-3 md:gap-4 select-none outline-none">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 shadow-inner flex items-center justify-center">
         <img 
            src="/O_Logo_Loop.gif" 
            alt="Mathaka Handiya Logo" 
            className="w-full h-full object-cover pointer-events-none" 
         />
      </div>
      <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase opacity-40 font-medium truncate">
        Mathaka Handiya
      </span>
    </div>

    {/* Right: Desktop Controls */}
    <div className="hidden md:flex items-center gap-8 font-medium">
      {/* My Tickets Button - Triggers Reservation Popup */}
      <motion.button 
        onClick={onOpenReservation} // Click Action
        whileHover={{ scale: 1.05, backgroundColor: "rgba(177, 158, 239, 1)", color: "#000" }}
        whileTap={{ scale: 0.95 }}
        title="Open My Tickets Reservation"
        aria-label="Open My Tickets Reservation"
        className="text-[10px] tracking-[0.3em] uppercase border border-[#b19eef]/40 bg-[#b19eef]/10 text-[#b19eef] px-8 py-3 rounded-full transition-all duration-500 focus:outline-none cursor-pointer shadow-xl shadow-black/40 transform-gpu"
      >
        My Tickets
      </motion.button>
      
      {/* Music Visualizer Control */}
      <button 
        onClick={onToggleMusic} 
        type="button"
        title={isPlaying ? "Pause Background Music" : "Play Background Music"}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        className="flex items-center gap-[3px] h-6 cursor-pointer px-2 opacity-60 hover:opacity-100 transition-opacity focus:outline-none select-none border-none bg-transparent"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i} 
            animate={isPlaying ? { 
              scaleY: [0.3, 1, 0.5, 0.8, 0.3],
              translateY: ["0%", "-10%", "10%", "0%"]
            } : { scaleY: 0.3 }} 
            transition={{ repeat: Infinity, duration: 1.5 + (i * 0.2), ease: "easeInOut" }} 
            className="w-[1.5px] h-5 bg-[#b19eef] rounded-full origin-center pointer-events-none transform-gpu" 
          />
        ))}
      </button>
    </div>

    {/* Mobile: Menu Toggle */}
    <div className="flex md:hidden items-center gap-4">
      <button 
        onClick={onOpenMenu} 
        title="Open Navigation Menu"
        aria-label="Open Navigation Menu"
        className="p-2 flex flex-col gap-1.5 items-end focus:outline-none border-none outline-none cursor-pointer group"
      >
        <div className="w-6 h-[1px] bg-white/60 group-hover:bg-[#b19eef] transition-colors"></div>
        <div className="w-4 h-[1px] bg-white/60 group-hover:bg-[#b19eef] transition-colors"></div>
      </button>
    </div>
  </motion.nav>
);

export default Navigation;