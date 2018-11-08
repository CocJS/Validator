<template>
  <div class = "row coc_house_keeper">
    <DatePicker
      :id = "componentId"
      :class = "picker_classes"
      v-model="datepicker"
      :type="type"
      :size = "size"
      :picker-options="quickOptions"
      :range-separator="range_separator"
      :start-placeholder="start_placeholder"
      :end-placeholder="end_placeholder"
      :prefix-icon = "iconClass.prefix"
      :suffix-icon = "iconClass.suffix"
      :default-time = "defaultTime"
      :default-value = "defaultTime"
      :placeholder="placeholder"
      format="d/M/yyyy"
      value-format="yyyy-MM-dd"
      @change = "construct()"
      @input = "construct()"
      @create= "watchMyDom()"
      @focus = "isFocused = true"
      @blur = "isFocused = false"/>
    <div 
      v-if = "isFired && !isValid" 
      class = "row coc_house_keeper">
      <ul>
        <li 
          v-for = "err in erros" 
          :class="[status_classes.errmenu ,'animated slideInDown']" 
          :key = "err" >
          <span :class = "error_bus[err].icon"/>
          <span>{{ error_bus[err].msg }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CocDate',
  props: {
    quick: {
      type: Array,
      default: null
    },
    margins: {
      type: Object,
      default: null
    },
    is_required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date'
    },
    scope: {
      type: Array,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    picker_classes: {
      type: [Object, Array, String],
      default: 'col s12 coc_house_keeper'
    },
    error_classes: {
      type: [Object, String],
      default: 'red-text'
    },
    placeholder: {
      type: String,
      default: 'Pick a day'
    },
    icon: {
      type: String,
      default: 'el-icon-date'
    },
    icon_align: {
      type: String,
      default: 'left'
    },
    default_time: {
      type: [Object, String],
      default: null
    },
    unlink_panels: {
      type: Boolean,
      default: false
    },
    range_separator: {
      type: String,
      default: 'to'
    },
    start_placeholder: {
      type: String,
      default: 'Start date'
    },
    end_placeholder: {
      type: String,
      default: 'End date'
    },
    error_bus: {
      type: Object,
      default: () => {
        return {
          is_required: {
            msg: 'This field is required.',
            icon: 'coc-alert-circle'
          },
          max: {
            msg: 'This date has passed the maximum value.',
            icon: 'coc-alert-circle'
          },
          min: {
            msg: 'This date is less than the minimum value.',
            icon: 'coc-alert-circle'
          }
        }
      }
    },
    icon_class: {
      type: String,
      default: ''
    },
    icon_focus: {
      type: String,
      default: ''
    },
    icon_success: {
      type: String,
      default: 'teal-text'
    },
    icon_error: {
      type: String,
      default: 'coc_text_error'
    },
    input_status_classes: {
      type: Object,
      default: () => {
        return {
          success: 'coc_input_success',
          error: 'coc_input_error',
          focus: 'coc_input_focus',
          regular: 'coc_input_regular',
          init: 'coc_input_init'
        }
      }
    },
    light: {
      type: Boolean,
      default: false
    },
    status_classes: {
      type: Object,
      default: () => {
        return {
          success: 'green-text',
          error: 'red-text',
          errmenu: 'red-text'
        }
      }
    },
    input_status_classes_mixins: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      datepicker: null,
      pickerOptions: null,
      clientDate: moment()
        .subtract(new Date().getTimezoneOffset(), 'm')
        .format('YYYY-MM-DD'),
      offset: new Date().getTimezoneOffset(),
      shortcuts: this.quick ? new $nuxt.$coc.Arrays(this.quick).Pluck("msg").get : [], // eslint-disable-line
      messages: {
        placeholder: this.placeholder,
        start_placeholder: this.start_placeholder,
        end_placeholder: this.end_placeholder
      },
      defaultTime: this.default_time
        ? this.createObjectDate(this.default_time)
        : null,
      erros: [],
      isFired: false,
      isValid: false
    }
  },
  computed: {
    model() {
      return {
        val: this.datepicker,
        control: {
          update: this.update,
          clear: this.clear,
          validate: this.validate,
          focus: this.focus,
          blur: this.blur,
          select: this.select,
          copy: this.copy,
          meta: this.meta,
          reset: this.reset,
          submit: this.submit,
          validate: this.ifValid
        },
        meta: {
          fired: this.isFired,
          valid: this.isValid,
          errors: this.errors,
          domId: this.componentId
        }
      }
    },
    componentId() {
      return 'coc_date_picker_' + this._uid
    },
    jQueryComponentId() {
      return '#coc_date_picker_' + this._uid
    },
    inputStatusMixins() {
      return new $nuxt.$coc.Objects(this.input_status_classes).Mix( // eslint-disable-line
        this.input_status_classes_mixins
      ).get
    },
    iconClass() {
      let str = 'coc_input_icon '
      let result = { suffix: '', prefix: '' }
      str = this.isLoading ? 'el-icon-loading ' : this.icon + ' '
      str =
        this.isFired && this.isValid
          ? str + this.status_classes.success + ' '
          : str
      str =
        this.isFired && !this.isValid
          ? str + this.status_classes.error + ' '
          : str
      result.suffix = this.icon_align == 'right' ? str : ''
      result.prefix = this.icon_align != 'right' ? str : ''
      return result
    },
    limits() {
      if (!this.margins) return null
      let limits = {}
      //max
      if (this.margins.max !== undefined)
        limits.max = this.createObjectDate(this.margins.max)
      //min
      if (this.margins.min !== undefined)
        limits.min = this.createObjectDate(this.margins.min)
      return limits
    },
    shortcutsDates() {
      return this.getShortcutsDates()
    },
    quickShortcuts() {
      const vm = this
      if (!this.quick) return []
      let temp = [],
        i
      for (i = 0; i < this.quick.length; i++) {
        let date = vm.shortcutsDates[i]
        temp.push({
          text: vm.shortcuts[i],
          onClick(picker) {
            vm.watchMyDom()
            //console.log(picker)
            //picker.$emit('pick',  moment(vm.shortcutsDates[i]).format('YYYY-MM-DD') );
          }
        })
      }
      return temp
    },
    quickOptions() {
      const vm = this
      if (!this.quick) return null
      let options = {
        disabledDate(time) {
          let max =
            vm.limits.max !== undefined && vm.limits.max !== null
              ? vm.limits.max
              : '2100-01-01'
          let min =
            vm.limits.min !== undefined && vm.limits.min !== null
              ? vm.limits.min
              : '1900-01-01'
          return (
            time.getTime() > new Date(max) || time.getTime() < new Date(min)
          )
        },
        shortcuts: this.quickShortcuts
      }
      return options
    }
  },
  mounted() {
    if (this.defaultTime) {
      this.datepicker = this.defaultTime
      this.emit()
    }
    this.watchMyDom()
    const vm = this
    $nuxt.$on('COCFormController', payloads => {
      if (!vm.scope) return
      //Type Check
      if (payloads.type !== undefined && payloads.type != 'date') return
      //Check Matching
      if ($nuxt.$coc.IsMatchedArrays(vm.scope, payloads.scope)) { // eslint-disable-line
        if (vm.model.control[payloads.controller] !== undefined) {
          vm.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== 'undefined' &&
            typeof payloads.callback == 'function'
              ? payloads.callback
              : null
          )
        } else {
          $nuxt.$coc.DevWarn({ // eslint-disable-line
            component: 'Coc Date',
            message:
              'The controller (' +
              payloads.controller +
              ') that you`re trying to access is not exist.'
          })
        }
      } else return
    })
  },
  methods: {
    createObjectDate(object) {
      if (object.date !== undefined) {
        return object.date
      }
      let from = object.from !== undefined ? object.from : this.clientDate
      return object.count > 0
        ? moment(from)
            .add(object.count, object.unit)
            .format('YYYY-MM-DD')
        : moment(from)
            .subtract(object.count * -1, object.unit)
            .format('YYYY-MM-DD')
    },
    getShortcutsDates() {
      if (!this.quick) return []
      let temp = [],
        i
      for (i = 0; i < this.quick.length; i++) {
        temp.push(this.createObjectDate(this.quick[i].margins))
      }
      return temp
    },
    watchMyDom() {
      if (
        !new $nuxt.$coc.$(this.jQueryComponentId).hasClass(this.inputStatusMixins.init) // eslint-disable-line
      )
        new $nuxt.$coc.$(this.jQueryComponentId).addClass(this.inputStatusMixins.init); // eslint-disable-line
      if (!this.isFired) {
        if (this.isFocused) {
          new $nuxt.$coc.$(this.jQueryComponentId) // eslint-disable-line
            .removeClass(this.inputStatusMixins.regular)
            .removeClass(this.inputStatusMixins.success)
            .removeClass(this.inputStatusMixins.error)
          new $nuxt.$coc.$(this.jQueryComponentId).addClass( // eslint-disable-line
            this.inputStatusMixins.focus
          )
        } else {
          new $nuxt.$coc.$(this.jQueryComponentId) // eslint-disable-line
            .removeClass(this.inputStatusMixins.focus)
            .removeClass(this.inputStatusMixins.success)
            .removeClass(this.inputStatusMixins.error)
          new $nuxt.$coc.$(this.jQueryComponentId).addClass( // eslint-disable-line
            this.inputStatusMixins.regular
          )
        }
      } else if (this.isValid) {
        new $nuxt.$coc.$(this.jQueryComponentId) // eslint-disable-line
          .removeClass(this.inputStatusMixins.regular)
          .removeClass(this.inputStatusMixins.focus)
          .removeClass(this.inputStatusMixins.error)
        new $nuxt.$coc.$(this.jQueryComponentId).addClass( // eslint-disable-line
          this.inputStatusMixins.success
        )
      } else {
        new $nuxt.$coc.$(this.jQueryComponentId) // eslint-disable-line
          .removeClass(this.inputStatusMixins.regular)
          .removeClass(this.inputStatusMixins.success)
          .removeClass(this.inputStatusMixins.focus)
        new $nuxt.$coc.$(this.jQueryComponentId).addClass( // eslint-disable-line
          this.inputStatusMixins.error
        )
      }
      const vm = this

      new $nuxt.$coc.$(".el-picker-panel__shortcut").click(function() { // eslint-disable-line
        let index = vm.shortcuts.indexOf(new $nuxt.$coc.$(this).text()); // eslint-disable-line
        if (index == -1 || vm.datepicker == vm.shortcutsDates[index]) return
        setTimeout(() => {
          vm.datepicker = vm.shortcutsDates[index]
          vm.emit()
        }, 300)
      })
    },
    ifValid() {
      this.erros = []
      if (
        this.is_required &&
        (this.datepicker == null ||
          this.datepicker.length == 0 ||
          this.datepicker == 'Invalid date')
      )
        this.erros.push('is_required')
      if (
        this.limits.max &&
        new Date(this.limits.max).getTime() <
          new Date(this.datepicker).getTime()
      )
        this.erros.push('max')
      if (
        this.limits.max &&
        new Date(this.limits.max).getTime() <
          new Date(this.datepicker).getTime()
      )
        this.erros.push('min')
      this.isValid = this.erros.length == 0 ? true : false
      return this.erros.length == 0 ? true : false
    },
    emit() {
      let event = arguments.length == 0 ? 'input' : arguments[0]
      this.$emit(event, this.model)
      this.watchMyDom()
    },

    //CSMA METHODS
    construct() {
      this.isFired = true
      this.ifValid()
      this.emit()
    },
    update() {
      this.datepicker = arguments[0]
      this.construct({ remote: true, value: arguments[0] })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    clear() {
      this.datepicker = ''
      this.construct({ remote: true, value: '' })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    focus() {
      new $nuxt.$coc.$(this.jQueryComponentId).focus(); // eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    blur() {
      new $nuxt.$coc.$(this.jQueryComponentId).blur(); // eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    select() {
      new $nuxt.$coc.$(this.jQueryComponentId).focus().select(); // eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    copy() {
      if (!$nuxt.$coc.HasValue(this.datepicker)) { // eslint-disable-line
        this.$message({
          showClose: true,
          message: 'There`s no content to be copied in this field.',
          type: 'error'
        })
        return
      }
      let copyText = document.getElementById(this.componentId)
      copyText.select()
      document.execCommand('copy')
      this.$message({
        showClose: true,
        message: 'Your text was copied.',
        type: 'success'
      })
      this.blur()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    meta() {
      if (
        arguments.length == 0 ||
        this.model.meta[arguments[0]] === undefined
      ) {
        $nuxt.$coc.DevWarn({ // eslint-disable-line
          component: 'COC EL INPUT',
          message:
            'The meta that you are requesting is not available in this CSMA.'
        })
        return
      }
      $nuxt.$emit('COCFormMeta', {
        scope: this.scope,
        meta: arguments[0],
        credentials: this.model.meta[arguments[0]]
      })
    },
    reset() {
      this.datepicker = null
      this.isFired = false
      this.errors = []
      this.watchMyDom()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    submit() {
      $nuxt.$emit('COCFormController', {
        scope: this.scope,
        controller: 'click',
        credentials: null,
        type: 'button'
      })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
