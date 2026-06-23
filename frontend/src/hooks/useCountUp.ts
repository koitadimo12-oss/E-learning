import { useEffect, useState } from "react";

export function useCountUp(target: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const start = performance.now();
    const from = 0;
    const to = target;

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, durationMs));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (to - from) * eased);
      setValue(next);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, enabled, target]);

  return value;
}
