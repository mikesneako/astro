import { ArrowDown, ArrowUpRight, Check, ChevronDown, Gift, Globe2, MousePointer2, Rocket, Sparkles } from "lucide-react";
import { config, formatCompactTokens, formatNumber, symbol } from "@/config";
import Navbar from "@/components/Navbar";
import Brand from "@/components/Brand";
import AstronautHero from "@/components/AstronautHero";
import BuyPresale from "@/components/BuyPresale";
import AirdropClaim from "@/components/AirdropClaim";
import MarketChart from "@/components/MarketChart";

const stepIcons = [MousePointer2, Check, Rocket];

export default function Home() {
  return (
    <div id="top" className="site-wrap">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className="shell">
        <section className="hero-grid" aria-label={`${config.brand.name} presale`}>
          <AstronautHero />
        </section>
        <div className="orbit-metrics" aria-label="Presale allocations">
          {config.presale.tiers.slice(0, 3).map((tier) => <a key={tier.sol} href="#presale"><span>{tier.sol} SOL ALLOCATION</span><strong>{formatCompactTokens(tier.tokens)} <small>{symbol}</small></strong><ArrowUpRight size={20} /></a>)}
          <a href="#airdrop"><span>COMMUNITY AIRDROP</span><strong>{formatCompactTokens(config.airdrop.rewardTokens)} <small>PER WALLET</small></strong><Gift size={20} /></a>
        </div>
        <div className="mission-strip"><span><Sparkles size={20} />{config.copy.missionLabel}</span><span>POWERED BY MEMES ✳</span><span>{symbol} TO THE COSMOS</span><a href="#airdrop">FREE SPACE SNACKS <ArrowDown size={18} /></a></div>
        <section id="presale" className="presale-section">
          <div className="presale-intro"><span className="eyebrow">01 / EARLY ORBIT</span><h2>Your next orbit<br /><span>starts here.</span></h2><p>Choose your SOL amount and see your {symbol} allocation. Your presale. Your wallet. Your space in the herd.</p>
        <section id="how-to-buy" className="how-section">
          <div className="section-heading"><div><span className="eyebrow">SMOOTH BRAIN? NO PROBLEM.</span><h2>HOW TO JOIN THE HERD.</h2></div><span className="section-aside">3 STEPS. ZERO ROCKET SCIENCE. ↙</span></div>
          <div className="steps-grid">{config.copy.steps.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return <article className="step" key={step.title}><div className="step-top"><span className="step-icon"><Icon size={20} strokeWidth={1.5} /></span><span className="step-number">0{i + 1}</span></div><h3>{step.title}</h3><p>{step.description}</p></article>;
          })}</div>
        </section>
          </div>
          <BuyPresale />
        </section>
        <AirdropClaim />
        <MarketChart />
        <section id="tokenomics" className="token-section">
          <div className="token-intro"><span className="eyebrow">THE PIE. NO GATEKEEPING.</span><h2>BIG BULL.<br />SMALL PRINT.</h2><p>The whole supply. Every slice. Right here.</p><span className="supply-label">TOTAL {symbol} SUPPLY</span><strong className="supply-value">{formatNumber(config.token.totalSupply)}</strong></div>
          <div className="allocations"><div className="allocation-heading"><span>Made for the whole crew.</span><Globe2 size={21} /></div><div className="allocation-bar" aria-hidden="true">{config.token.allocations.map((item) => <span key={item.name} style={{ width: `${item.percent}%`, background: item.color }} />)}</div><div className="allocation-list">{config.token.allocations.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><strong>{item.percent}%</strong></div>)}</div></div>
        </section>
        <section id="roadmap" className="roadmap-section"><div className="section-heading"><div><span className="eyebrow">WE EVEN HAVE A PLAN. KIND OF.</span><h2>THE ROAD TO “WEN MOON?”</h2></div><span className="roadmap-doodle" aria-hidden="true">↗</span></div><div className="roadmap-grid">{config.roadmap.map((phase) => <article key={phase.phase} className="roadmap-card" style={{ "--phase-color": phase.color } as React.CSSProperties}><div className="roadmap-top"><span>PHASE {phase.phase}</span><span>{phase.status}</span></div><h3>{phase.title}</h3><p>{phase.description}</p><span className="roadmap-star" aria-hidden="true">✳</span></article>)}</div></section>
        <section className="faq-section"><div><span className="eyebrow">THE BULL HAS ANSWERS.</span><h2>WAIT, WHAT?</h2><span className="faq-doodle" aria-hidden="true">?!</span></div><div className="faq-list">{config.copy.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div></section>
        <section className="community-banner"><div><span className="eyebrow">THERE’S ROOM IN THIS ROCKET</span><h2>{config.copy.communityTitle}</h2><p>{config.copy.communityDescription}</p></div><div className="community-links">{config.links.x && <a className="button button-dark" href={config.links.x} target="_blank" rel="noreferrer">Join us on X <ArrowUpRight size={17} /></a>}{config.links.telegram && <a className="text-link" href={config.links.telegram} target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={16} /></a>}{config.links.discord && <a className="text-link" href={config.links.discord} target="_blank" rel="noreferrer">Discord <ArrowUpRight size={16} /></a>}</div></section>
      </main>
      <footer className="site-footer shell"><Brand /><p>{config.copy.footerNote}</p><span>© {new Date().getUTCFullYear()} {config.brand.name}{config.links.whitepaper && <a href={config.links.whitepaper} target="_blank" rel="noreferrer">Whitepaper ↗</a>}</span></footer>
      <a className="mobile-buy button" href="#presale">Buy {symbol}<ArrowUpRight size={18} /></a>
    </div>
  );
}
