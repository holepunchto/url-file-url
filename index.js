const platform = global.Bare?.platform || global.process?.platform || 'browser'
const path = require('path')

exports.fileURLToPath = function fileURLToPath (url) {
  if (typeof url === 'string') {
    url = new URL(url)
  }

  if (url.protocol !== 'file:') {
    throw new Error('The URL must use the file: protocol')
  }

  const pathname = decodeURIComponent(path.normalize(url.pathname))

  if (platform === 'win32') {
    if (url.hostname) return '\\\\' + url.hostname + pathname

    return pathname.slice(1)
  }

  return pathname
}

exports.pathToFileURL = function pathToFileURL (pathname) {
  let resolved = path.resolve(pathname)

  if (pathname[pathname.length - 1] === '/') {
    resolved += '/'
  } else if (platform === 'win32' && pathname[pathname.length - 1 === '\\']) {
    resolved += '\\'
  }

  resolved = resolved
    .replaceAll('%', '%25') // Must be first
    .replaceAll('#', '%23')
    .replaceAll('?', '%3f')
    .replaceAll('\n', '%0a')
    .replaceAll('\r', '%0d')
    .replaceAll('\t', '%09')

  if (platform !== 'win32') {
    resolved = resolved.replaceAll('\\', '%5c')
  }

  return new URL('file:' + resolved)
}
