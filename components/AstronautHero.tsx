"use client";

import React, { useEffect, useState, useRef } from "react";
import { AstronautCountdownRing } from "./AstronautCountdownRing";

interface AstronautHeroProps {
  cursorPos: { x: number; y: number };
  isSurging?: boolean;
}

export const AstronautHero: React.FC<AstronautHeroProps> = ({
  cursorPos,
  isSurging = false,
}) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    let currentRx = 0;
    let currentRy = 0;
    let currentTx = 0;
    let currentTy = 0;

    const updateParallax = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const nx = (cursorPos.x - centerX) / (centerX || 1);
      const ny = (cursorPos.y - centerY) / (centerY || 1);

      const targetRy = nx * 5;
      const targetRx = -ny * 4;
      const targetTx = nx * 10;
      const targetTy = ny * 8;

      currentRx += (targetRx - currentRx) * 0.05;
      currentRy += (targetRy - currentRy) * 0.05;
      currentTx += (targetTx - currentTx) * 0.05;
      currentTy += (targetTy - currentTy) * 0.05;

      setTilt({
        rx: currentRx,
        ry: currentRy,
        tx: currentTx,
        ty: currentTy,
      });

      animRef.current = requestAnimationFrame(updateParallax);
    };

    animRef.current = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animRef.current);
  }, [cursorPos]);

  return (
    <div
      className="astronaut-scene-wrapper"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Expanding shockwave ring on surge */}
      {isSurging && (
        <div
          className="shockwave-ring"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "2px solid #00ff66",
            boxShadow: "0 0 30px #00ff66, inset 0 0 20px #00ff66",
            animation: "shockwaveRing 1.4s cubic-bezier(0.1, 0.8, 0.2, 1) forwards",
            pointerEvents: "none",
            zIndex: 15,
          }}
        />
      )}

      {/* Main Astronaut Anchor */}
      <div
        className="astronaut-anchor"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
      >
        {/* Soft atmospheric radial green aura behind head and chest */}
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: isSurging
              ? "radial-gradient(circle, rgba(0, 255, 102, 0.35) 0%, rgba(0, 255, 102, 0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(0, 255, 102, 0.14) 0%, rgba(0, 255, 102, 0.03) 55%, transparent 75%)",
            filter: "blur(35px)",
            transition: "background 0.5s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Circular Mission Countdown encircling the floating character */}
        <AstronautCountdownRing isSurging={isSurging} />

        {/* Levitating Bull Character Wrapper */}
        <div
          className="astronaut-levitate"
          style={{
            position: "relative",
            animation: "zeroGLevitate 5.8s ease-in-out infinite",
            zIndex: 5,
            filter: isSurging
              ? "drop-shadow(0 0 38px rgba(0, 255, 102, 0.95)) brightness(1.35)"
              : "drop-shadow(0 0 16px rgba(0, 255, 102, 0.28)) drop-shadow(0 0 35px rgba(0, 255, 102, 0.12))",
            transition: "filter 0.4s ease",
          }}
        >
          {/* Transparent PNG Cutout - Exact sizing from space-bull */}
          <img
            src="/bull-astronaut-floating.png"
            alt="DemoBull ($DEMOBULL) Astronaut"
            className="astronaut-hero-image"
            draggable={false}
            style={{
              display: "block",
              userSelect: "none",
            }}
          />

          {/* Dual Thruster Glow under boots */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "36%",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#00ff66",
              boxShadow: "0 0 20px #00ff66, 0 0 40px #00ff66",
              filter: "blur(4px)",
              animation: "bootThrusterGlow 2.8s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "34%",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#00ff66",
              boxShadow: "0 0 20px #00ff66, 0 0 40px #00ff66",
              filter: "blur(4px)",
              animation: "bootThrusterGlow 2.8s ease-in-out infinite 0.4s",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Floating Elliptical Green Energy Field Under Character */}
        <div
          className="astronaut-energy-disk"
          style={{
            position: "absolute",
            bottom: "-45px",
            width: "260px",
            height: "95px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(0, 255, 102, 0.5) 0%, rgba(0, 255, 102, 0.22) 40%, rgba(0, 255, 102, 0.05) 70%, transparent 85%)",
            border: "1px solid rgba(0, 255, 102, 0.35)",
            boxShadow:
              "0 0 25px rgba(0, 255, 102, 0.3), inset 0 0 15px rgba(0, 255, 102, 0.3)",
            animation: "energyFieldPulse 4.2s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};
