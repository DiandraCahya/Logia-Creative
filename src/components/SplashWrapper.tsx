"use client";

import React, { useState } from "react";
import SplashScreen from "./SplashScreen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div style={{ display: showSplash ? "none" : "block" }}>
        {children}
      </div>
    </>
  );
}