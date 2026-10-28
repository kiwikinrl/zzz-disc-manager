import SearchInput from "./SearchInput";
import type { Character } from "../lib/types";

interface CharacterListProps {
  characters: Character[];
  selected: string | null;
  onSelect: (character: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
}

export default function CharacterList({ characters, selected, onSelect, search, onSearchChange, onFilter }: CharacterListProps) {
  return (
    <aside className="panel">
      <div className="panel-title">Characters</div>
      <div className="panel-search">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search characters..." onFilter={onFilter} />
      </div>
      <ul className="panel-list">
        {characters.map((c) => (
          <li key={c.character}>
            <button
              type="button"
              className={c.character === selected ? "panel-item active" : "panel-item"}
              onClick={() => onSelect(c.character)}
            >
              {c.img ? <img className="panel-item-img" src={c.img} alt={c.character} /> : null}
              <span>{c.character}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
