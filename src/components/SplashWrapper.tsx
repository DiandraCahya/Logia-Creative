"use client";

import React, { useState } from "react";
import { SplashScreen } from "./SplashScreen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div style={{ display: showSplash ? "none" : "block" }}>
        {children}
      </div>
    </>
  );
}