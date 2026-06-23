import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.remove('knd-route-in');
      void ref.current.offsetWidth; // reflow
      ref.current.classList.add('knd-route-in');
    }
  }, [pathname]);

  return (
    <div ref={ref} className="knd-route-in">
      {children}
    </div>
  );
}
