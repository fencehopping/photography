import { getCategories, type CategoryFilterValue } from '../lib/photos';

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="control">
      <label htmlFor="category-filter">Category</label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as CategoryFilterValue)}
      >
        {getCategories().map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
