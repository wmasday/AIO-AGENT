export const products = [
  { id: 1, name: 'Notebook', price: 4.5 },
  { id: 2, name: 'Pencil set', price: 3.2 },
  { id: 3, name: 'Desk lamp', price: 24 },
  { id: 4, name: 'Monitor stand', price: 39 },
  { id: 5, name: 'Cable tray', price: 12.75 },
];

// Pages are numbered from 1.
export function paginate(items, page = 1, limit = 2) {
  const start = page * limit;
  return {
    page,
    limit,
    total: items.length,
    items: items.slice(start, start + limit),
  };
}
