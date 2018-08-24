const http = require('http')
const conf = require('./config/defaultConfig')
const chalk = require('chalk')
const path = require('path')
// const fs = require('fs')
// const {
// 	promisify
// } = require('util')
// const stat = promisify(fs.stat)
// const readdir = promisify(fs.readdir)

const route = require('./helper/route')
const autoOpen = require('./helper/autoOpen')

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config)
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url)
      // 回调地狱
      // fs.stat(filePath, (err, stats) => {
      // 	if (err) {
      // 		res.writeHead(404, {
      // 			'Content-Type': 'text/plain'
      // 		})
      // 		res.end(`${filePath} is not a directory or file.`)
      // 		return
      // 	}

      // 	if (stats.isFile()) {
      // 		res.writeHead(200, {
      // 			'Content-Type': 'text/plain'
      // 		})
      // 		fs.createReadStream(filePath).pipe(res)
      // 	} else if (stats.isDirectory()) {
      // 		fs.readdir(filePath, (err, files) => {
      // 			res.writeHead(200, {
      // 				'Content-Type': 'text/html'
      // 			})
      // 			res.end(files.join(','))
      // 		})

      // 	}
      // })

      // 解决回调地狱
      route(req, res, filePath, this.conf)
    })

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`
      console.info(`Server started at ${chalk.green(addr)}`)
      autoOpen(addr)
    })
  }
}

module.exports = Server
