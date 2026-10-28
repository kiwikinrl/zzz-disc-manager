import { useRef } from "react";
import type { Disc } from "../lib/types";
import { getDiscImage } from "../lib/recommend";

interface TopNavProps {
  activeTab: "characters" | "discs";
  onTabChange: (tab: "characters" | "discs") => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  disc?: Disc | null;
}

export default function TopNav({ activeTab, onTabChange, onExport, onImportFile, disc }: TopNavProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <header className="top-nav">
      <a className="app-name" href={import.meta.env.BASE_URL || "/"}><img src={getDiscImage(disc)} alt="App Icon"/>ZZZ Disc Manager</a>

      <nav className="nav-middle">
        <button
          type="button"
          className={activeTab === "characters" ? "tab active" : "tab"}
          onClick={() => onTabChange("characters")}
        >Characters</button>
        <button
          type="button"
          className={activeTab === "discs" ? "tab active" : "tab"}
          onClick={() => onTabChange("discs")}
        >Discs</button>
      </nav>

      <div className="nav-right">
        <button type="button" className="tab" onClick={onExport} disabled>
          Export JSON
        </button>
        <button type="button" className="tab" onClick={() => fileRef.current?.click()} disabled>
          Import JSON
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void onImportFile(file);
            event.currentTarget.value = "";
          }}
        />
      </div>
    </header>
  );
}
