import SearchInput from "./SearchInput";
import type { Disc } from "../lib/types";

interface DiscListProps {
  discs: Disc[];
  selected: string | null;
  onSelect: (discSet: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
}

export default function DiscList({ discs, selected, onSelect, search, onSearchChange, onFilter }: DiscListProps) {
  return (
    <aside className="panel">
      <div className="panel-title">Discs</div>
      <div className="panel-search">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search discs..." onFilter={onFilter} />
      </div>
      <ul className="panel-list">
        {discs
          .filter((d) => d.set)
          .map((d) => (
            <li key={d.set}>
              <button
                type="button"
                className={d.set === selected ? "panel-item active" : "panel-item"}
                onClick={() => onSelect(d.set)}
              >
                {d.img ? <img className="panel-item-img" src={d.img} alt={d.set} /> : null}
                <span>{d.set}</span>
              </button>
            </li>
          ))}
      </ul>
    </aside>
  );
}
