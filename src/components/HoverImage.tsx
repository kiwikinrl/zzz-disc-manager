import { useState, type MouseEvent, type ReactNode } from "react";

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}

export default function HoverImage({ src, alt, className, children }: HoverImageProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setPosition(null);
  };

  const dialogStyle = position ? { left: position.x + 16, top: position.y + 16 } : undefined;

  return (
    <span className={className ?? "hoverable"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {position !== null ? (
        <span className="hover-dialog" style={dialogStyle} role="tooltip">
          {src ? <img src={src} alt={alt} className="hover-dialog-img" /> : <span className="hover-dialog-fallback">{alt}</span>}
        </span>
      ) : null}
    </span>
  );
}
