import COC from './core.js'
import Arrays from './arrays.js'
import Objects from './objects.js'
import $ from './domer.js'
import Init from './init.js'
COC.Arrays = Arrays
COC.Objects = Objects
COC.$ = $
COC.Init = Init
import Vue from 'vue';
Vue.prototype.$coc = COC;
export default COC
