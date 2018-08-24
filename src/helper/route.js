const fs = require('fs')
const {
  promisify
} = require('util')
const stat = promisify(fs.stat)
const path = require('path')
const readdir = promisify(fs.readdir)
const handlebars = require('handlebars')
const source = fs.readFileSync(path.join(__dirname, '../template/dir.tpl'))
const template = handlebars.compile(source.toString())
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')

const authArr = {
  7: 'rwx',
  6: 'rw-',
  5: 'r-x',
  4: 'r--',
  3: '-wx',
  2: '-w-',
  1: '--x'
}
async function getAuth(filePath) {
  const stats = await stat(filePath)
  const mode = stats.mode.toString(8).slice(-3)
  let authText = ''
  if (stats.isFile()) {
    authText = '-'
  } else if (stats.isDirectory()) {
    authText = 'd'
  }
  for (var i = 0; i <= mode.length - 1; i++) {
    authText += authArr[mode[i]]
  }
  return {
    auth: authText,
    size: stats.size
  }
}

module.exports = async(req, res, filePath, conf) => {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.setHeader('Content-Type', 'text/plain;charset=UTF-8')

      if (isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }

      //   直接写入
      //   fs.createReadStream(filePath).pipe(res)

      // 进行压缩优化写入
      //   let rs = fs.createReadStream(filePath)

      // range断点请求
      let rs
      const { code, start, end } = range(stats.size, req, res)
      if (code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, { start, end })
      }

      if (filePath.match(conf.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      for (let i = 0; i <= files.length - 1; i++) {
        const auth = await getAuth(path.join(filePath, files[i]))
        files[i] = {
          name: files[i],
          ...auth
        }
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative(conf.root, filePath)
      const data = {
        title: path.basename(filePath),
        files,
        dir: dir ? `/${dir}` : '',
        website: `${conf.hostname}:${conf.port}`,
        version: `Node.js ${process.version}`
      }
      res.end(template(data))
    }
  } catch (ex) {
    console.error(ex)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a directory or a file`)
  }
}
