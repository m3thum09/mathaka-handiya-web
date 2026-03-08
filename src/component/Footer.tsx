import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="relative bg-[#05050a] pt-16 md:pt-24 pb-12 px-6 md:px-12 overflow-hidden border-t border-white/5 font-sans">
      
      {/* Background Mammoth Text */}
      <div className="absolute bottom-[-2%] md:bottom-[-8%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 opacity-[0.03]">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-[14vw] md:text-[16vw] font-black text-white leading-none uppercase tracking-tighter"
          style={{ letterSpacing: '-0.001em' }}
        >
          Mathaka Handiya
        </motion.h2>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/[0.05]">
          
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6 text-left">
            <h3 className="text-white text-2xl tracking-[0.2em] uppercase font-light">
              Mathaka <span className="text-[#b19eef]/80 italic font-serif">Handiya</span>
            </h3>
            <p className="text-white/30 text-sm leading-relaxed font-light max-w-sm italic">
              "An evening of cinematic melodies and symphonic storytelling. Join us for a journey through sound where every note echoes a memory."
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            
            {/* Follow Us Section */}
            <div className="space-y-4 text-left">
              <h4 className="text-[#b19eef] text-[10px] tracking-[0.4em] uppercase font-bold opacity-80">Follow Us</h4>
              <ul className="space-y-3 font-light text-sm">
                <li><a href="https://wa.me/94703162494" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#b19eef] transition-colors duration-300 block">WhatsApp</a></li>
                <li><a href="https://www.facebook.com/share/19j9RX1D5J/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#b19eef] transition-colors duration-300 block">Facebook</a></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="space-y-4 text-left">
              <h4 className="text-[#b19eef] text-[10px] tracking-[0.4em] uppercase font-bold opacity-80">Legal</h4>
              <ul className="space-y-3 font-light text-sm text-white/40">
                <li><a href="#" className="hover:text-[#b19eef] transition-colors block">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#b19eef] transition-colors block">Terms of Service</a></li>
              </ul>
            </div>

            {/* Architected Section */}
            <div className="space-y-4 col-span-2 md:col-span-1 text-left">
              <h4 className="text-[#b19eef] text-[10px] tracking-[0.4em] uppercase font-bold opacity-80">Architected</h4>
              <a href="https://www.linkedin.com/in/methummandinu" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-start leading-tight">
                <span className="text-white/30 text-[9px] uppercase tracking-widest mb-1 block">Digitally Crafted by</span>
                <span className="text-white/50 group-hover:text-[#b19eef] text-[11px] font-medium tracking-wider transition-colors block">@m3thum.09</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col items-center gap-3 w-full">
          <div className="text-[11px] md:text-[12px] tracking-[0.4em] uppercase text-white/10 font-medium text-center">
            Crafted for Symphonic Excellence
          </div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-white/15 font-light italic text-center">
            © 2026 Mathaka Handiya
          </div>
        </div>
      </div>
    </footer>
  );
};