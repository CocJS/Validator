import coc from './modules/core.js'
import Arrays from './modules/arrays.js'
import Objects from './modules/objects.js'
import $ from './modules/domer.js'
coc.Arrays = Arrays
coc.Objects = Objects
coc.$ = $

// coc.VUE
// MASTER COMPONENTS
import CocInput from './components/Forms/CocInput.vue'
import CocSelect from './components/Forms/CocSelect.vue'
import CocRadio from './components/Forms/CocRadio.vue'
import CocDate from './components/Forms/CocDate.vue'
import CocButton from './components/Forms/CocButton.vue'
import CocFormItem from './components/Forms/CocFormItem.vue'
import CocForm from './components/Forms/CocForm.vue'
import CocAxios from './components/Assistants/CocAxios.vue'
import CocCollapse from './components/Assistants/CocCollapse.vue'
import CocShowKeys from './components/Assistants/CocShowKeys.vue'
import './assets/sass/index.scss'

coc.Init = (options) => {
  const Vue = options.Vue;
  const lodash = options.lodash;
  const moment = options.moment;
  const COC = options.COC;
  const components = {
    CocInput,
    CocSelect,
    CocRadio,
    CocDate,
    CocButton,
    CocFormItem,
    CocForm,
    CocAxios,
    CocCollapse,
    CocShowKeys,
  }
  Object.keys(components).forEach(key => {
          Vue.component(key, components[key])
  })
  Vue.prototype.$moment = moment;
  Vue.prototype.$_ = lodash;
  Vue.prototype.$coc = COC;
}
export default coc
