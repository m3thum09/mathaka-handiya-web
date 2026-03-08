import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const PartnersSection = () => {
  const partners = useMemo(() => [
    { src: '/Partners_logos/sltc.png', alt: 'SLTC' },
    { src: '/Partners_logos/media-unit.png', alt: 'SLTC Media Unit' },
    { src: '/Partners_logos/major-events.png', alt: 'Major Events' },
  ], []);

  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (seqWidth > 0 && trackRef.current) {
      offsetRef.current = (offsetRef.current + 0.8) % seqWidth;
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [seqWidth]);

  const updateDimensions = useCallback(() => {
    if (seqRef.current) {
      const sequenceWidth = seqRef.current.getBoundingClientRect().width;
      if (sequenceWidth > 0) setSeqWidth(Math.ceil(sequenceWidth));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateDimensions, animate]);

  return (
    <section className="relative w-full bg-transparent py-2 overflow-hidden z-[45]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <div ref={trackRef} className="flex w-max will-change-transform select-none transform-gpu items-center py-6">
            {[1, 2, 3, 4].map((i) => (
              <ul key={i} ref={i === 1 ? seqRef : undefined} className="flex items-center space-x-12 md:space-x-24 pr-12 md:pr-24" role="list">
                {partners.map((logo, idx) => (
                  <li key={`${i}-${idx}`} className="flex-none transition-all duration-700 hover:scale-110 flex items-center justify-center">
                    <div className="w-24 md:w-40 h-10 sm:h-12 md:h-14 flex items-center justify-center group">
                      <img 
                        src={logo.src} 
                        alt={logo.alt}
                        className="max-w-full max-h-full w-auto h-auto opacity-30 grayscale filter transition-all duration-700 object-contain pointer-events-none group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100" 
                        loading="lazy"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};