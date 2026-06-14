import type { CategoryFilterValue } from '../lib/photos';

interface CategoryFilterProps {
  categories: CategoryFilterValue[];
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <div className="control">
      <label className="control-label" htmlFor="category-filter">
        Category
      </label>
      <div className="select-button">
        <span className="select-icon" aria-hidden="true">
          {'\uf03e'}
        </span>
        <span className="select-label" aria-hidden="true">
          CATEGORIES
        </span>
        <select
          id="category-filter"
          aria-label="Category"
          value={value}
          onChange={(event) => onChange(event.target.value as CategoryFilterValue)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
