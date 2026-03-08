import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export const AnimatedCursor = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useSpring(0, { damping: 25, stiffness: 250 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      setShouldRender(true);
      const moveCursor = (e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };
      const handleHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        setIsHovered(!!(target.closest('button') || target.closest('a') || target.classList.contains('cursor-pointer')));
      };
      window.addEventListener('mousemove', moveCursor);
      window.addEventListener('mouseover', handleHover);
      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('mouseover', handleHover);
      };
    }
  }, [cursorX, cursorY]);

  if (!shouldRender) return null;

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full backdrop-blur-[1px]"
        style={{ translateX: cursorX, translateY: cursorY, left: -10, top: -10 }}
        animate={{
          width: isHovered ? 45 : 20,
          height: isHovered ? 45 : 20,
          backgroundColor: isHovered ? 'rgba(177, 158, 239, 0.3)' : 'rgba(177, 158, 239, 0.1)',
          border: '1px solid rgba(177, 158, 239, 0.4)',
        }}
      />
      <motion.div
        className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-[9999]"
        style={{ translateX: cursorX, translateY: cursorY, left: -2, top: -2 }}
      />
    </>
  );
};