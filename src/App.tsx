import { useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import DiscDetail from "./components/DiscDetail";
import DiscList from "./components/DiscList";
import { exportBuildsToJson, importBuildsFromJson } from "./lib/buildIO";
import { getCharacters, getDiscs, getRecommendations } from "./lib/recommend";
import { loadDatabase, saveDatabase, upsertBuild } from "./lib/storage";
import type { Build, DatabaseShape } from "./lib/types";

type Tab = "characters" | "discs";

export default function App() {
  const [database, setDatabase] = useState<DatabaseShape>(() => loadDatabase());
  const [tab, setTab] = useState<Tab>("characters");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedDisc, setSelectedDisc] = useState<string | null>(null);
  const [characterQuery, setCharacterQuery] = useState("");
  const [discQuery, setDiscQuery] = useState("");

  const characters = getCharacters();
  const discs = getDiscs();
  const recommendations = getRecommendations();
  const builds = database.collections.builds;

  const selectedCharacterData = characters.find((c) => c.character === selectedCharacter) ?? null;
  const selectedDiscData = discs.find((d) => d.set === selectedDisc) ?? null;

  const sortedCharacters = useMemo(
    () => [...characters].sort((a, b) => a.character.localeCompare(b.character)),
    [characters],
  );
  const sortedDiscs = useMemo(
    () => [...discs].filter((d) => d.set).sort((a, b) => a.set.localeCompare(b.set)),
    [discs],
  );

  const normalizedCharacterQuery = characterQuery.trim().toLowerCase();
  const normalizedDiscQuery = discQuery.trim().toLowerCase();

  const filteredCharacters = useMemo(
    () => sortedCharacters.filter((c) => c.character.toLowerCase().includes(normalizedCharacterQuery)),
    [sortedCharacters, normalizedCharacterQuery],
  );
  const filteredDiscs = useMemo(
    () => sortedDiscs.filter((d) => d.set.toLowerCase().includes(normalizedDiscQuery)),
    [sortedDiscs, normalizedDiscQuery],
  );

  const handleBuildsChange = (next: Build[]) => {
    setDatabase((previous) => {
      const nextDatabase: DatabaseShape = {
        ...previous,
        collections: { ...previous.collections, builds: next },
      };
      saveDatabase(nextDatabase);
      return nextDatabase;
    });
  };

  const handleExport = () => {
    const blob = new Blob([exportBuildsToJson(builds)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "zzz-disc-manager-builds.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const parsed = importBuildsFromJson(text);
    let next = [...builds];
    for (const build of parsed) {
      next = upsertBuild(next, build);
    }
    handleBuildsChange(next);
  };

  const handleSelectCharacter = (character: string) => {
    setSelectedCharacter(character);
    setTab("characters");
  };

  const handleSelectDisc = (discSet: string) => {
    setSelectedDisc(discSet);
    setTab("discs");
  };

  return (
    <div className="app">
      <TopNav
        activeTab={tab}
        onTabChange={setTab}
        onExport={handleExport}
        onImportFile={handleImportFile}
        disc={discs[0] ?? null}
      />
      <div className="content">
        {tab === "characters" ? (
          <div className="layout">
            <CharacterList
              characters={filteredCharacters}
              selected={selectedCharacter}
              onSelect={handleSelectCharacter}
              search={characterQuery}
              onSearchChange={setCharacterQuery}
            />
            <CharacterDetail
              character={selectedCharacterData}
              characters={filteredCharacters}
              onSelectCharacter={handleSelectCharacter}
              onSelectDisc={handleSelectDisc}
            />
          </div>
        ) : (
          <div className="layout">
            <DiscList
              discs={filteredDiscs}
              selected={selectedDisc}
              onSelect={handleSelectDisc}
              search={discQuery}
              onSearchChange={setDiscQuery}
            />
            <DiscDetail
              disc={selectedDiscData}
              discs={filteredDiscs}
              recommendations={recommendations}
              builds={builds}
              onSelectCharacter={handleSelectCharacter}
              onSelectDisc={handleSelectDisc}
            />
          </div>
        )}
      </div>
      <footer className="status-bar">
        <div>
          v{database.version} · Builds: {builds.length}
        </div>
        <div>

        </div>
        </footer>
    </div>
  );
}
