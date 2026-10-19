import Image from "next/image";
import type { Img } from "@/lib/types";

/**
 * next/image with the static-export loader.
 * - `priority`: the page's LCP image (hero): loaded eagerly with fetchPriority="high".
 * - `eager`: above the fold but not the LCP (logo): loaded eagerly, no preload, normal priority.
 * - everything else is lazy-loaded.
 */
export function Picture({
  img,
  className = "",
  sizes = "100vw",
  priority = false,
  eager = false,
  fill = false,
}: {
  img?: Img;
  className?: string;
  sizes?: string;
  priority?: boolean;
  eager?: boolean;
  fill?: boolean;
}) {
  if (!img?.src) return null;
  const loading = priority || eager ? ("eager" as const) : ("lazy" as const);
  const common = { src: img.src, alt: img.alt ?? "", sizes, className, loading, ...(priority ? { fetchPriority: "high" as const } : {}) };
  if (fill || !img.width || !img.height) return <Image {...common} alt={common.alt} fill />;
  return <Image {...common} alt={common.alt} width={img.width} height={img.height} />;
}
