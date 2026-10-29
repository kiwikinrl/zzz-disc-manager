import { useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
}

const DIALOG_OFFSET = 16;
const DIALOG_MARGIN = 36;
const FALLBACK_DIALOG_SIZE = 88;

export default function HoverImage({ src, alt, className, children }: HoverImageProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dialogRef = useRef<HTMLSpanElement | null>(null);

  // Keep the hover dialog glued to the cursor and flip it to the
  // inverted side when there is no space left (window border aware).
  useLayoutEffect(() => {
    if (cursor === null) {
      return;
    }
    const reposition = () => {
      const dialog = dialogRef.current;
      const rect = dialog?.getBoundingClientRect();
      const width = rect?.width || FALLBACK_DIALOG_SIZE;
      const height = rect?.height || FALLBACK_DIALOG_SIZE;
      let x = cursor.x + DIALOG_OFFSET;
      let y = cursor.y + DIALOG_OFFSET;
      if (x + width + DIALOG_MARGIN > window.innerWidth) {
        x = cursor.x - width - DIALOG_OFFSET;
      }
      if (y + height + DIALOG_MARGIN > window.innerHeight) { // image move to top (bottom space limit)
        y = cursor.y - height - DIALOG_OFFSET + 24; // increase 24, make img preview closer to cursor 
      }
      setPosition((previous) => (previous && previous.x === x && previous.y === y ? previous : { x, y }));
    };
    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [cursor]);

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setCursor({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (cursor) {
      setCursor({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setCursor(null);
    setPosition(null);
  };

  const dialogStyle = position !== null ? { left: position.x, top: position.y } : undefined;

  return (
    <span
      className={className ?? "hoverable"}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {cursor !== null ? (
        <span ref={dialogRef} className="hover-dialog" style={dialogStyle} role="tooltip">
          {src ? <img src={src} alt={alt} className="hover-dialog-img" loading="lazy"/> : <span className="hover-dialog-fallback">{alt}</span>}
        </span>
      ) : null}
    </span>
  );
}
