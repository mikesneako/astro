"use client";

import React, { useState, useEffect } from "react";
import { SpaceCanvas } from "./SpaceCanvas";

export default function GlobalBackground() {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 500,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <SpaceCanvas cursorPos={cursorPos} />
      <div className="ambient-glow-top" />
      <div className="ambient-glow-purple" />
    </div>
  );
}
