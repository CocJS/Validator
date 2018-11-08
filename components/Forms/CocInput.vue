<template>
  <div :id = "containerId">
    <!--Retrievers-->
    <coc-axios
      v-if = "autocomplete"
      :url = "autocomplete_from"
      :xdata = "{ q : input }"
      v-model = "autocompleteRetriever"
      dev
      prevent_on_mount
      @success = "handleAutoComplete($event)"/>
    <coc-axios
      v-if = "remote_check"
      :url = "remote_check.url"
      :xdata = "remoteCheckMixin"
      v-model = "remoteCheckRetriever"
      prevent_on_mount
      @success = "handleRemoteCheck($event)"/>
    <!--Retrievers-->
    <Input
      :placeholder="placeholder"
      :type = "computedType" 
      :name = "name"
      :id = "componentId"
      :prefix = "iconClass.prefix"
      :icon = "iconClass.suffix"
      :clearable = "!unclearable"
      :disabled="disabled"
      :size = "size"
      v-model="input"
      @focus = "innerEmit(`focus`); isFocused = true"
      @blur = "innerEmit(`blur`); isFocused = false"
      @clear = "innerEmit(`clear`)"
      @input = "construct({ remote : true , value : $event })" >
    <template slot = "append">
      <slot name = "append"/>
    </template>
    <template slot = "prepend">
      <slot name = "prepend"/>
    </template> 
  </Input> <!-- eslint-disable-line -->
    <ul 
      v-if = "!isValid && isFired && !hide_errors" 
      class="row coc_validation_menu">
      <li 
        v-for = "err in validationErrors" 
        :class = "[ status_classes.errmenu ]" 
        :key = "err">
        <span :class = "errorsBus[err].icon"/>
        <span>{{ errorsBus[err].msg }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'CocInput',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'md-create'
    },
    icon_align: {
      type: String,
      default: 'left'
    },
    scope: {
      type: Array,
      default: null
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    autocomplete_from: {
      type: String,
      default: ''
    },
    unclearable: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    maxlen: {
      type: Number,
      default: null
    },
    minlen: {
      type: Number,
      default: null
    },
    same_as: {
      type: String,
      default: null
    },
    regex: {
      type: String,
      default: null
    },
    remote_check: {
      type: Object,
      default: null
    },
    remote_check_xdata: {
      type: Object,
      default: null
    },
    status_classes: {
      type: Object,
      default: () => {
        return {
          init: '',
          success: 'green-text',
          error: 'red-text',
          errmenu: 'red-text'
        }
      }
    },
    start_as: {
      type: String,
      default: null
    },
    mixins: {
      type: Object,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hide_errors: {
      type: Boolean,
      default: false
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
    input_status_classes_mixins: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: null
    },
    light: {
      type: Boolean,
      default: false
    },
    copy_message: {
      type: String,
      default: 'Your text was copied.'
    },
    notifi_copy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      input: null,
      autocompleteRetriever: { loading: false },
      remoteCheckRetriever: { loading: false },
      autocompleteResults: [],
      remoteCheckValidation: false,
      isValid: false,
      isFired: false,
      validationErrors: [],
      submits: 0,
      isFocused: false,
      validationsOptions: {},
      computedType: this.type
    }
  },
  computed: {
    iconClass() {
      let str = 'coc_input_icon '
      let result = { suffix: '', prefix: '' }
      str = this.isLoading ? 'el-icon-loading ' : this.icon + ' '
      str = !this.isFired ? str + this.status_classes.init + ' ' : str
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
    passwordHidden() {
      return this.type == 'password' && this.computedType == this.type
    },
    remoteCheckMixin() {
      return this.remote_check_xdata
        ? new $nuxt.$coc.Objects({ q: this.input }).MixAndCreate( //eslint-disable-line
            this.remote_check_xdata
          ).get
        : { q: this.input }
    },
    componentId() {
      return 'coc_elinput_' + this._uid
    },
    containerId() {
      return 'coc_elinput_container_' + this._uid
    },
    containerJQueryId() {
      return 'coc_elinput_container_' + this._uid
    },
    jQueryComponentId() {
      return '#coc_elinput_' + this._uid
    },
    errorsBus() {
      let init = {
        HasValue: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'This field is required.'
        },
        InMaxRange: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg:
            'The maximum length for your value must be less than ' + this.maxlen
        },
        InMinRange: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg:
            'The minimum length for your value must be greater than ' +
            this.minlen
        },
        SameAs: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'This value must be the similar as the confirmed field.'
        },
        MatchsRegex: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'This field`s formula is not correct.'
        },
        Remote: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'This value is unavailable.'
        }
      }
      if (this.mixins) {
        let k
        for (k in this.mixins) {
          if (init[k] !== undefined) {
            if (this.mixins[k].msg !== undefined)
              init[k].msg = this.mixins[k].msg
            if (this.mixins[k].icon !== undefined)
              init[k].icon = this.mixins[k].icon
          }
        }
      }
      return init
    },
    isLoading() {
      return (
        this.autocompleteRetriever.loading || this.remoteCheckRetriever.loading
      )
    },
    inputStatusMixins() {
      return new $nuxt.$coc.Objects(this.input_status_classes).Mix( //eslint-disable-line
        this.input_status_classes_mixins
      ).get
    },
    model() {
      return this.light
        ? this.input
        : {
            val: this.input,
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
              showPassword: this.showPassword,
              hidePassword: this.hidePassword,
              togglePassword: this.togglePassword
            },
            meta: {
              fired: this.isFired,
              valid: this.isValid,
              errors: this.validationErrors,
              autocomplete: this.autocompleteResults,
              domId: this.componentId,
              focused: this.isFocused,
              containerId: this.containerId,
              passwordHidden: this.passwordHidden,
              light: this.light
            }
          }
    }
  },
  mounted() {
    const vm = this
    //DOM EVENTS
    this.hashValidationOptions()
    new $nuxt.$coc.$(document).ready(function() { //eslint-disable-line
      new $nuxt.$coc.$(vm.jQueryComponentId).keyup(function(e) { //eslint-disable-line
        if (e.which === 13) {
          vm.submit()
          return
        }
      })
    })
    //VUE EVENTS
    //Global Events <<$nuxt API>
    $nuxt.$on('COCFormController', payloads => {
      if (!vm.scope) return
      //Type Check
      if (payloads.type !== undefined && payloads.type != 'input') return
      //Check Matching
      if ($nuxt.$coc.IsMatchedArrays(vm.scope, payloads.scope)) { //eslint-disable-line
        if (vm.model.control[payloads.controller] !== undefined) {
          vm.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== 'undefined' &&
            typeof payloads.callback == 'function'
              ? payloads.callback
              : null
          )
        } else {
          $nuxt.$coc.DevWarn({ //eslint-disable-line
            component: 'Coc Input',
            message:
              'The controller (' +
              payloads.controller +
              ') that you`re trying to access is not exist.'
          })
        }
      } else return
    })
    //Construct
    this.construct({ remote: false, value: null, validate: false })
    if (this.start_as) this.update(this.start_as)
  },
  methods: {
    realign() {},
    construct(options) {
      if (options.validate === undefined || options.validate == true)
        this.isFired = true
      //Text Alignment
      this.realign()
      //Remote Check
      this.remoteCheckValidation = false
      if (
        (options.remote === undefined || options.remote == true) &&
        this.remote_check
      )
        if ($nuxt.$coc.HasValue(this.remote_check.url)) //eslint-disable-line
          setTimeout(() => {
            this.remoteCheckRetriever.retrieve()
          }, 200)
        else
          $nuxt.$coc.DevWarn({ //eslint-disable-line
            component: 'Coc Input',
            message:
              "You turned on remote_check option, but you didn't set `url` to the prop."
          })
      //AutoComplete
      if (this.autocomplete)
        if ($nuxt.$coc.HasValue(this.autocomplete_from) && this.autocomplete) //eslint-disable-line
          this.autocompleteRetriever.retrieve()
        else
          $nuxt.$coc.DevWarn({ //eslint-disable-line
            component: 'Coc Input',
            message:
              "You turned on autocomplete option, but you didn't set `autocomplete_from` prop."
          })
      //Validations
      if (options.validate === undefined || options.validate == true)
        this.validate()
      this.watchMyDom()
      this.emit()
    },
    update() {
      this.input = arguments[0]
      this.construct({ remote: true, value: arguments[0] })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    clear() {
      this.input = ''
      this.construct({ remote: true, value: '' })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    showPassword() {
      if (this.type == 'password') {
        this.computedType = 'text'
      }
      this.emit()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    hidePassword() {
      if (this.type == 'password') {
        this.computedType = 'password'
      }
      this.emit()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    togglePassword() {
      if (this.passwordHidden) {
        this.showPassword()
      } else {
        this.hidePassword()
      }
      this.emit()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    focus() {
      new $nuxt.$coc.$(this.jQueryComponentId).focus(); //eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    blur() {
      new $nuxt.$coc.$(this.jQueryComponentId).blur(); //eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    select() {
      new $nuxt.$coc.$(this.jQueryComponentId).focus().select(); //eslint-disable-line
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    copy() {
      if (!$nuxt.$coc.HasValue(this.input)) { //eslint-disable-line
        this.$message({
          showClose: true,
          message: 'There`s no content to be copied in this field.',
          type: 'error'
        })
        return this.model.control
      }
      let copyText = document.getElementById(this.componentId)
      copyText.select()
      document.execCommand('copy')
      const vm = this
      if (this.notifi_copy)
        this.$message({
          showClose: true,
          message: vm.copy_message,
          type: 'success'
        })
      this.blur()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    watchMyDom() {
      if (
        !new $nuxt.$coc.$(this.jQueryComponentId).hasClass(this.inputStatusMixins.init) //eslint-disable-line
      )
        new $nuxt.$coc.$(this.jQueryComponentId).addClass(this.inputStatusMixins.init); //eslint-disable-line
      if (!this.isFired) {
        if (this.isFocused) {
          new $nuxt.$coc.$(this.jQueryComponentId) //eslint-disable-line
            .removeClass(this.inputStatusMixins.regular)
            .removeClass(this.inputStatusMixins.success)
            .removeClass(this.inputStatusMixins.error)
          new $nuxt.$coc.$(this.jQueryComponentId).addClass( //eslint-disable-line
            this.inputStatusMixins.focus
          )
        } else {
          new $nuxt.$coc.$(this.jQueryComponentId) //eslint-disable-line
            .removeClass(this.inputStatusMixins.focus)
            .removeClass(this.inputStatusMixins.success)
            .removeClass(this.inputStatusMixins.error)
          new $nuxt.$coc.$(this.jQueryComponentId).addClass( //eslint-disable-line
            this.inputStatusMixins.regular
          )
        }
      } else if (this.isValid) {
        new $nuxt.$coc.$(this.jQueryComponentId) //eslint-disable-line
          .removeClass(this.inputStatusMixins.regular)
          .removeClass(this.inputStatusMixins.focus)
          .removeClass(this.inputStatusMixins.error)
        new $nuxt.$coc.$(this.jQueryComponentId).addClass( //eslint-disable-line
          this.inputStatusMixins.success
        )
      } else {
        new $nuxt.$coc.$(this.jQueryComponentId) //eslint-disable-line
          .removeClass(this.inputStatusMixins.regular)
          .removeClass(this.inputStatusMixins.success)
          .removeClass(this.inputStatusMixins.focus)
        new $nuxt.$coc.$(this.jQueryComponentId).addClass( //eslint-disable-line
          this.inputStatusMixins.error
        )
      }
    },
    meta() {
      if (arguments.length == 0) {
        $nuxt.$coc.DevWarn({ //eslint-disable-line
          component: 'Coc Input',
          message: 'You need to pass the required meta name.'
        })
        return
      }
      if (arguments[0] == '*') {
        $nuxt.$emit('COCFormMeta', {
          scope: this.scope,
          meta: '*',
          credentials: this.model.meta
        })
        return
      }
      if (this.model.meta[arguments[0]] === undefined) {
        $nuxt.$coc.DevWarn({ //eslint-disable-line
          component: 'Coc Input',
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
      return this.model.control
    },
    reset() {
      this.input = null
      this.construct({ validate: false, remote: false })
      this.isFired = false
      this.validationErrors = []
      this.watchMyDom()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
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
      return this.model.control
    },
    handleAutoComplete(e) {
      this.autocompleteResults = e.response
      this.$emit('autocomplete', this.autocompleteResults)
    },
    handleRemoteCheck(e) {
      this.remoteCheckValidation = e.response == this.remote_check.valid
      this.validate()
      this.watchMyDom()
    },
    validate() {
      this.isValid = true
      this.hashValidationOptions()
      let validation = $nuxt.$coc.Validate.Start(this.hashValidationOptions()); //eslint-disable-line
      this.isValid = validation.valid
      this.validationErrors = validation.errors
      if (arguments.length > 0) {
        if (arguments[0] == 'meta') {
          this.isFired = true
          this.meta('valid')
        }
      }
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    emit() {
      let event = arguments.length == 0 ? 'input' : arguments[0]
      this.$emit(event, this.model)
      this.watchMyDom()
    },
    innerEmit(e) {
      this.$emit(e)
    },
    hashValidationOptions() {
      this.validationsOptions = {
        val: this.input,
        options: [
          {
            name: 'HasValue',
            variable: false,
            pre: this.required,
            credentials: null
          },
          {
            name: 'InMaxRange',
            variable: false,
            pre: this.maxlen,
            credentials: this.maxlen
          },
          {
            name: 'InMinRange',
            variable: false,
            pre: this.minlen,
            credentials: this.minlen
          },
          {
            name: 'SameAs',
            variable: false,
            pre: this.same_as,
            credentials: this.same_as
          },
          {
            name: 'MatchsRegex',
            variable: false,
            pre: this.regex,
            credentials: this.regex
          },
          {
            name: 'Remote',
            variable: true,
            pre: this.remote_check !== null,
            credentials: this.remoteCheckValidation
          }
        ]
      }
      return this.validationsOptions
    }
  }
}
</script>

<style lang="css" scoped>
</style>
