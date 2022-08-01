import count from "./js/count";
import sum from "./js/sum";
//想要webpack打包资源，必须引入该资源
import "./css/index.css"
import "./css/iconfont.css"

const result = '22'

console.log(result)
console.log(count(3, 2))
console.log(sum(1,2,2,3,4,5))
//