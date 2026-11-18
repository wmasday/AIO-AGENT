import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products, paginate } from '../lib/products.js';

test('page 1 returns the first items', () => {
  const result = paginate(products, 1, 2);
  assert.deepEqual(result.items.map((p) => p.id), [1, 2]);
});

test('the last page returns the remainder', () => {
  const result = paginate(products, 3, 2);
  assert.deepEqual(result.items.map((p) => p.id), [5]);
});
