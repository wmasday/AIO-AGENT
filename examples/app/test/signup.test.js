import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSignup } from '../lib/signup.js';

test('accepts a valid signup', () => {
  const result = parseSignup({ name: 'Ada', email: 'ada@example.com', plan: 'team' });
  assert.equal(result.ok, true);
});

test('rejects an invalid email', () => {
  const result = parseSignup({ name: 'Ada', email: 'not-an-email', plan: 'team' });
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /^email:/);
});
