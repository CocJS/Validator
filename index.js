import COC from './modules/main.js'
import Vue from 'vue'
export default () => {
  // Init COC
  COC.Init()
  Vue.prototype.$coc = COC;
}
