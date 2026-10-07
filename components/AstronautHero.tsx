import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { config, symbol } from "@/config";
import HeroWallet from "./HeroWallet";

export default function AstronautHero() {
  return (
    <div className="hero-story">
      <div className="eyebrow"><span className="status-dot" />{config.copy.heroBadge}</div>
      <h1>{config.brand.headline[0]}<br /><span>{config.brand.headline[1]}</span></h1>
      <p className="hero-description">{config.brand.description}</p>
      <div className="astronaut-scene">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="space-cross cross-one" aria-hidden="true">+</div><div className="space-cross cross-two" aria-hidden="true">+</div>
        <span className="scene-coordinate coordinate-top">CERTIFIED SPACE DEGEN</span>
        <span className="scene-coordinate coordinate-bottom">EARTH WAS BORING ANYWAY.</span>
        <div className="floating-astronaut"><Image src={config.brand.astronaut} alt={`${config.brand.name} bull astronaut floating in space`} width={681} height={1024} preload sizes="(max-width: 600px) 230px, 320px" draggable={false} /></div>
        <div className="astronaut-shadow" />
        <div className="orbit-tag"><span className="tag-icon"><Sparkles size={20} /></span><div><small>MOOD: PERMANENTLY</small><strong>BULLISH. <ArrowUpRight size={16} /></strong></div></div>
        <span className="coin-tag">WEN MOON?<span>ASK THE BULL. ↗</span></span>
        <span className="mascot-symbol">{symbol}</span>
      </div>
      <div className="hero-caption"><span className="solana-mark" aria-hidden="true"><i /><i /><i /></span>Powered by {config.network.name}<span className="caption-line" /><span>{config.brand.tagline}</span></div>
      <HeroWallet />
    </div>
  );
}
