import type { CSSProperties } from "react";
import { config } from "@/config";

export default function Confetti() {
  const colors = [config.site.accent, config.site.secondary, config.site.pink, "#ffda64", "#ffffff"];
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 64 }, (_, i) => <i key={i} style={{ "--x": `${(i * 37) % 100}vw`, "--delay": `${(i % 9) * 0.065}s`, "--drift": `${((i * 23) % 280) - 140}px`, "--spin": `${(i % 2 ? 1 : -1) * (360 + i * 9)}deg`, background: colors[i % colors.length], borderRadius: i % 3 === 0 ? "50%" : "0" } as CSSProperties} />)}</div>;
}
