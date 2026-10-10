import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowToBuy from "@/components/HowToBuy";
import PresaleDashboard from "@/components/PresaleDashboard";
import AirdropClaim from "@/components/AirdropClaim";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";
import GlobalBackground from "@/components/GlobalBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full max-w-[100vw] overflow-x-hidden selection:bg-[#00ff66]/40 selection:text-black">
      <GlobalBackground />
      {/* Top Fixed Terminal Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden pb-20 md:pb-0">
        {/* Section 1: Interactive Deep Space Astronaut Hero */}
        <Hero />

        <div className="section-divider" />

        {/* Section 2: Presale Dashboard (Progress, Stats, Countdown, Tier Matrix, Buy Module) */}
        <PresaleDashboard />

        <div className="section-divider" />

        {/* Section 3: How to Buy Guide */}
        <HowToBuy />

        <div className="section-divider" />

        {/* Section 4: Community Airdrop Portal */}
        <AirdropClaim />

        <div className="section-divider" />

        {/* Section 5: Tokenomics (10B Supply Breakdown) */}
        <Tokenomics />

        <div className="section-divider" />

        {/* Section 6: Mission Roadmap */}
        <Roadmap />

        <div className="section-divider" />

        {/* Section 7: Regulatory & Volatility Disclaimer */}
        <Disclaimer />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Call to Action */}
      <StickyMobileCta />
    </div>
  );
}
