import Vue from 'vue'
import COC from './modules/core.js'
import Arrays from './modules/arrays.js'
import Objects from './modules/objects.js'
import $ from './modules/domer.js'
COC.Arrays = Arrays
COC.Objects = Objects
COC.$ = $

// COC VUE
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

COC.Init = () => {
  Vue.component('coc-input', CocInput)
  Vue.component('coc-select', CocSelect)
  Vue.component('coc-radio', CocRadio)
  Vue.component('coc-date', CocDate)
  Vue.component('coc-button', CocButton)
  Vue.component('coc-form-item', CocFormItem)
  Vue.component('coc-form', CocForm)
  Vue.component('coc-axios', CocAxios)
  Vue.component('coc-collapse', CocCollapse)
  Vue.component('coc-show-keys', CocShowKeys)
}
export default COC
