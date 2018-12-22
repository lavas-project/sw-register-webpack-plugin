const path = require('path')
const fs = require('fs')

function copyDir (src, dist, callback) {
  fs.access(dist, (err) => {
    if (err) {
      fs.mkdirSync(dist)
    }
    _copy(null, src, dist)
  })

  function _copy (err, src, dist) {
    if (err) {
      callback(err)
    } else {
      fs.readdir(src, (err, paths) => {
        if (err) {
          callback(err)
        } else {
          paths.forEach(function (path) {
            const _src = src + '/' + path
            const _dist = dist + '/' + path
            fs.stat(_src, (err, stat) => {
              if (err) {
                callback(err)
              } else {
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src))
                } else if (stat.isDirectory()) {
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}

copyDir(path.resolve(__dirname, './templates'), path.resolve(__dirname, './dist/templates'))
