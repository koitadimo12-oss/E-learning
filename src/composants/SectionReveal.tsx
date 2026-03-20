import type { PropsWithChildren } from "react";

import { useInViewOnce } from "../hooks/useInViewOnce";

export default function SectionReveal({ children }: PropsWithChildren) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <div
      ref={ref}
      className={visible ? "w-full animate-knd-fade-up" : "w-full opacity-0"}
    >
      {children}
    </div>
  );
}
