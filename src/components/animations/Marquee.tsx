"use client";
interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ items, speed = 35, reverse = false, className = "" }: MarqueeProps) {
  return (
    <div className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {items.map((item, i) => (
              <span key={i} className="marquee-item">
                {item}
                <span className="marquee-dot">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
