const test = require('brittle')
const { isWindows } = require('which-runtime')
const { fileURLToPath, pathToFileURL } = require('.')

test('pathToFileURL - basic', (t) => {
  const url = pathToFileURL('/foo/bar')
  t.is(url.protocol, 'file:')
  t.ok(url.pathname.includes('foo/bar'))
})

test('fileURLToPath - basic', function (t) {
  const url = isWindows ? 'file:///C:/foo/bar' : 'file:///foo/bar'
  const path = fileURLToPath(url)
  t.ok(path.includes('foo'))
  t.ok(path.includes('bar'))
})

test('fileURLToPath - URL object', function (t) {
  const url = new URL(isWindows ? 'file:///C:/foo/bar' : 'file:///foo/bar')
  const path = fileURLToPath(url)
  t.ok(path.includes('foo'))
  t.ok(path.includes('bar'))
})

test('fileURLToPath - throws on non-file protocol', function (t) {
  t.exception(() => fileURLToPath('http://example.com'))
})

test('pathToFileURL - special characters', function (t) {
  const url = pathToFileURL('/foo/bar#baz')
  t.ok(url.href.includes('%23'))
})

test('pathToFileURL - trailing slash', function (t) {
  const url = pathToFileURL('/foo/bar/')
  t.ok(url.pathname.endsWith('/'))
})

test('roundtrip', function (t) {
  const original = isWindows ? 'C:\\foo\\bar' : '/foo/bar'
  const url = pathToFileURL(original)
  const result = fileURLToPath(url)
  t.ok(result.includes('foo'))
  t.ok(result.includes('bar'))
})
