"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { config, symbol } from "@/config";
import Brand from "./Brand";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header shell">
      <Brand />
      <nav className={`nav-links ${open ? "is-open" : ""}`} id="main-navigation" aria-label="Main navigation">
        {config.navigation.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </nav>
      <a href="#presale" className="button header-cta">Buy {symbol}<ArrowUpRight size={16} /></a>
      <button className="menu-button icon-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </header>
  );
}
