export default function ServiceCategoryCard({ category, onClick }) {
  return (
    <div
      onClick={() => onClick?.(category)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
    >
      <h3 className="font-semibold text-gray-900">{category.name}</h3>
      {category.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
      )}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        {category.slug && <span>/{category.slug}</span>}
        {category.is_active !== undefined && (
          <span className={category.is_active ? 'text-green-500' : 'text-red-500'}>
            {category.is_active ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>
    </div>
  );
}
