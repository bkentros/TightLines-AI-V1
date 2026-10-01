import assert from 'node:assert/strict';
import test from 'node:test';
import { EtagMismatch } from 'pmtiles';
import { StoredSource, resetStore } from '../src/engine/tileStore.js';

// a stand-in for the browser's Cache Storage
const named = new Map();
globalThis.caches = {
  async keys() { return [...named.keys()]; },
  async delete(name) { return named.delete(name); },
  async open(name) {
    if (!named.has(name)) {
      const m = new Map();
      named.set(name, {
        async match(k) { const r = m.get(k); return r && r.clone(); },
        async put(k, r) { m.set(k, r); },
        async keys() { return [...m.keys()]; },
      });
    }
    return named.get(name);
  },
};
const settle = () => new Promise((r) => setTimeout(r, 0));
function fakeServer(etag = '"a"') {
  const s = { calls: 0, etag, async getBytes(offset, length, _signal, want) {
    s.calls++;
    if (want && want !== s.etag) throw new EtagMismatch('changed');
    return { data: new Uint8Array(length).fill(offset % 251).buffer, etag: s.etag };
  } };
  return s;
}

test('a range is fetched once, then served from the phone', async () => {
  const server = fakeServer();
  const src = new StoredSource('https://map.example/static/a.pmtiles?r=1', '1', server);
  const first = await src.getBytes(0, 16, undefined, undefined); await settle();
  const again = await new StoredSource('https://map.example/static/a.pmtiles?r=1', '1', server).getBytes(0, 16, undefined, '"a"');
  assert.equal(server.calls, 1);
  assert.deepEqual(new Uint8Array(again.data), new Uint8Array(first.data));
  assert.equal(again.etag, '"a"');
  await src.getBytes(16, 16); await settle();
  assert.equal(server.calls, 2, 'a different range is a new fetch');
});

test('a new revision starts a fresh store and drops the old one', async () => {
  const server = fakeServer();
  await new StoredSource('https://map.example/static/b.pmtiles?r=1', '1', server).getBytes(0, 8); await settle();
  await new StoredSource('https://map.example/static/b.pmtiles?r=2', '2', server).getBytes(0, 8); await settle();
  assert.equal(server.calls, 2);
  await new Promise((r) => setTimeout(r, 5));
  assert.deepEqual([...named.keys()], ['pc-static-2']);
  await resetStore('2');
});

test('a file replaced under the same revision clears the store instead of mixing tiles', async () => {
  const server = fakeServer('"old"');
  const src = new StoredSource('https://map.example/static/c.pmtiles?r=3', '3', server);
  await src.getBytes(0, 8); await settle();
  server.etag = '"new"';
  await assert.rejects(src.getBytes(64, 8, undefined, '"old"'), EtagMismatch);
  assert.equal(named.has('pc-static-3'), false);
  const fresh = await src.getBytes(0, 8); // pmtiles re-reads the header after a mismatch
  assert.equal(fresh.etag, '"new"');
});

test('without Cache Storage it just fetches', async () => {
  const saved = globalThis.caches; delete globalThis.caches;
  try {
    const server = fakeServer();
    const src = new StoredSource('https://map.example/static/d.pmtiles?r=9', '9', server);
    await src.getBytes(0, 8); await src.getBytes(0, 8);
    assert.equal(server.calls, 2);
  } finally { globalThis.caches = saved; }
});
