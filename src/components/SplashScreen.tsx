"use client";
import { useState, useEffect } from 'react';
import Logo3D from './Logo3D';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const fullText = 'Logia';
  const typingSpeed = 120; // ms per huruf

  // Typing animation
  useEffect(() => {
    let currentIndex = 0;
    let timerId: NodeJS.Timeout;

    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
        timerId = setTimeout(typeText, typingSpeed);
      }
    };

    typeText();
    return () => clearTimeout(timerId);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, []);

  // Auto-hide setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onFinish(), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => onFinish(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 transition-opacity duration-500 splash-screen ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* 3D Logo - PAKAI LOGO.PNG! */}
        <div className="mb-8">
          <Logo3D />
        </div>

        {/* Typing text */}
        <div className="text-6xl md:text-8xl font-black mb-8 flex items-center justify-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            {displayText}
          </span>
          <span
            className={`inline-block w-1 h-16 md:h-20 bg-gradient-to-b from-blue-400 to-purple-500 ml-2 transition-opacity ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg md:text-xl mb-12">
          Creative Studio
        </p>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-6 py-3 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-all duration-300 hover:scale-105 z-20"
      >
        Skip Intro →
      </button>
    </div>
  );
}
