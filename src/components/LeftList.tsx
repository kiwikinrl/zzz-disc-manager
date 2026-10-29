import SearchInput from "./SearchInput";
import type { Character, Disc } from "../lib/types";

interface ListItem {
  label: string;
  img?: string;
}

interface ListProps {
  items: Disc[] | Character[];
  title?: string;
  selected: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
}

function toItem(entry: Character | Disc): ListItem {
  if ("character" in entry) return { label: entry.character, img: entry.img };
  return { label: entry.set, img: entry.img };
}

export default function LeftList({ items, title = "List", selected, onSelect, search, onSearchChange, onFilter }: ListProps) {
  return (
    <aside className="panel">
      <div className="panel-title">{title}</div>
      <div className="panel-search">
        <SearchInput value={search} onChange={onSearchChange} placeholder={title == "Characters" ? "Character" : "Disc"} onFilter={onFilter} />
      </div>
      <ul className="panel-list">
        {items.map((item) => {
          const { label, img } = toItem(item);
          return (
            <li key={label}>
              <button
                type="button"
                className={label === selected ? "panel-item active" : "panel-item"}
                onClick={() => onSelect(label)}>
                {img ? <img className="panel-item-img" src={img} alt={label} loading="lazy" /> : null}
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
