interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilter?: () => void;
}

export default function SearchInput({ value, onChange, placeholder, onFilter }: SearchInputProps) {
  return (
    <div className="search-input">
      <input
        type="text"
        className="search-field"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
      />
      <div className="search-actions">
        {value.length > 0 ? (
          <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
            ×
          </button>
        ) : null}
      </div>
      {onFilter ? (
          <button type="button" className="search-filter" onClick={onFilter}>
          Filter
        </button>
      ) : null}
    </div>
  );
}
