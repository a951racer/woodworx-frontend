import { useState } from 'react';

interface TagChipInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagChipInput({ tags, onChange, placeholder = 'Add a tag…' }: TagChipInputProps) {
  const [input, setInput] = useState('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  }

  function addTag() {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="tag-chip-input">
      <div className="tag-chip-input__chips">
        {tags.map((tag, index) => (
          <span key={tag} className="tag-chip-input__chip">
            {tag}
            <button
              type="button"
              className="tag-chip-input__remove"
              onClick={() => removeTag(index)}
              aria-label={`Remove tag: ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="tag-chip-input__input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  );
}
