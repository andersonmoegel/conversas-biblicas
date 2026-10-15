import {test} from 'node:test';import assert from 'node:assert/strict';import {normalizeCitations} from './worker/index.js';
test('aceita fontes agrupadas sem perder índices',()=>assert.equal(normalizeCitations('Afirmação [1, 2, 5].'),'Afirmação [1] [2] [5].'));
test('aceita intervalos limitados',()=>assert.equal(normalizeCitations('Afirmação [1–3].'),'Afirmação [1] [2] [3].'));
test('não oculta referência fora da lista',()=>assert.equal(normalizeCitations('Afirmação [1, 99].'),'Afirmação [1] [99].'));
