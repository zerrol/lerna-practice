

const lodash = require('zerrol-lerna-demo-module-1')

const temp =  {
  ...lodash,
  isXinBa(o) {
    return o.miao === 'aowu'
  }
}

o = {
  miao: 'aowu'
}

 // true
console.log("aowu", temp.isXinBa(o))


module.exports = temp
