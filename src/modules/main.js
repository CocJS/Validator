import COC from './core.js'
import Arrays from './arrays.js'
import Objects from './objects.js'
import $ from './domer.js'
import Init from './init.js'
import Vue from 'vue'
COC.Arrays = Arrays
COC.Objects = Objects
COC.$ = $
COC.Init = Init
Vue.prototype.$coc = COC
export default COC
