<template>
  <div :class = "[computedStatusClasses.initHolder]">
    <coc-form-atom
      ref = "atom"
      :coc-event-controller = "eventController"
      :validate = "computedRules"
      :val = "inputFieldModel"
      :scope = "scope"
      @validation = "handleValidation"
      @coc-atom-control = "atomControllers = $event"/>
    <coc-axios
      v-if = "autocompleteComputedOptions"
      v-bind = "autocompleteComputedOptions"
      v-model = "autocompleteRetriever"
      @success = "handleAutocompleteSuccess"
      @catch = "handleAutocompleteError"/>
    <Input
      v-if = "!allowAutocomplete"
      ref = "input"
      v-model = "inputFieldModel"
      :type = "type"
      :size = "size"
      :placeholder = "placeholder"
      :maxlength = "maxlength"
      :disabled = "disabled"
      :icon = "computedIcon"
      :autosize = "autosize"
      :rows = "rows"
      :readonly = "readonly"
      :name = "name"
      :number = "number"
      :autofocus = "autofocus"
      :clearable = "clearable"
      :element-id = "elementId"
      :wrap = "wrap"
      :prefix = "prefix"
      :suffix = "suffix"
      :search = "search"
      :enter-button = "enterButton"
      @on-focus = "handleFocus"
      @on-blur = "handleBlur"
      @on-change = "handleInput"
      @on-clear = "handleClear"
      @on-enter = "handleEnter">
    <slot 
      slot = "prepend" 
      name = "prepend"/>
    <slot 
      slot = "suffix" 
      name = "suffix"/>
    <slot 
      slot = "append" 
      name = "append"/>
    <slot 
      slot = "prefix" 
      name = "prefix"/>
    </Input> <!-- eslint-disable-line -->
    <AutoComplete
      v-if = "allowAutocomplete"
      ref = "input"
      v-model = "inputFieldModel"
      :type = "type"
      :size = "size"
      :placeholder = "placeholder"
      :maxlength = "maxlength"
      :disabled = "disabled"
      :icon = "computedIcon"
      :autosize = "autosize"
      :rows = "rows"
      :readonly = "readonly"
      :name = "name"
      :number = "number"
      :autofocus = "autofocus"
      :clearable = "clearable"
      :element-id = "elementId"
      :wrap = "wrap"
      :prefix = "prefix"
      :suffix = "suffix"
      :search = "search"
      :label = "label"
      :data = "dropdownOptions"
      :filter-method = "filterMethod"
      :placement = "placement"
      :transfer = "transfer"
      :enter-button = "enterButton"
      @on-focus = "handleFocus"
      @on-blur = "handleBlur"
      @input = "handleInput"
      @on-clear = "handleClear">
      <slot
        slot = "default"
        name = "default"/>
      <slot 
        slot = "prepend" 
        name = "prepend"/>
      <slot 
        slot = "suffix" 
        name = "suffix"/>
      <slot 
        slot = "append" 
        name = "append"/>
      <slot 
        slot = "prefix" 
        name = "prefix"/>
    </AutoComplete>

    <slot
      :error = "isValid"
      name = "error">
      <p
        v-if = "!isValid.valid && isValid.message && isFired"
        class = "coc-error-text animated fadeIn">
        <span :class = "isValid.icon"/>
        {{ isValid.message }}
      </p>
    </slot>
  </div>
</template>

<script>
const oneOf = (val, array) => {
  return array.indexOf(val) !== -1
}
export default {
  name: 'CocInput',
  props: {
    type: {
      validator(value) {
        return oneOf(value, [
          'text',
          'textarea',
          'password',
          'url',
          'email',
          'date'
        ])
      },
      default: 'text'
    },
    value: {
      type: [String, Number, Object],
      default() {
        return {
          val: '',
          control: {},
          meta: {}
        }
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === ''
          ? 'default'
          : this.$IVIEW.size
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    number: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      validator(value) {
        return oneOf(value, ['on', 'off'])
      },
      default: 'off'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: String,
      default: null
    },
    wrap: {
      validator(value) {
        return oneOf(value, ['hard', 'soft'])
      },
      default: 'soft'
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    search: {
      type: Boolean,
      default: false
    },
    enterButton: {
      type: [Boolean, String],
      default: false
    },
    // Autocomplete
    label: {
      type: [String, Number],
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    filterMethod: {
      type: [Function, Boolean],
      default: (value, option) => {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
    placement: {
      validator(value) {
        return oneOf(value, ['top', 'bottom'])
      },
      default: 'bottom'
    },
    transfer: {
      type: Boolean,
      default: false
    },
    // Coc Special Attributes
    scope: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: [Object, Function],
      default: null
    },
    statusClasses: {
      type: Object,
      default() {
        return {}
      }
    },
    lightModel: {
      type: Boolean,
      default: false
    },
    // autocomplete
    allowAutocomplete: {
      type: Boolean,
      default: false
    },
    autocompleteRemote: {
      type: [Object, Function],
      default: null
    },
    autocompleteMapResponse: {
      type: Function,
      default: (res, val) => res
    },
    autocompleteFetchOnce: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputFieldModel: '',
      isValid: { valid: false },
      isFired: false,
      loaders: {
        validation: false,
        autocomplete: false
      },
      isFocused: false,
      atomControllers: {},
      autoCompleteRemoteFeeds: [],
      autocompleteRetriever: { loading: false },
      onReset: false
    }
  },
  computed: {
    eventController() {
      return {
        type: 'select',
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this._uid,
          type: 'select',
          val: this.inputFieldModel
        }
      }
    },
    model() {
      return {
        val: this.inputFieldModel,
        control: {
          focus: this.focus,
          blur: this.blur,
          select: this.select,
          copy: this.copy,
          update: this.update,
          clear: this.clear,
          reset: this.reset,
          disFire: this.disFire,
          validate: this.getAtomController('validate'),
          meta: this.getAtomController('handleMeta')
        },
        meta: {
          valid: this.isValid.valid,
          validationData: this.isValid,
          isFired: this.isFired,
          isFocused: this.isFocused
        }
      }
    },
    autocompleteComputedOptions() {
      if (this.allowAutocomplete && this.autocompleteRemote) {
        if (typeof this.autocompleteRemote === 'object') {
          return this.autocompleteRemote
        } else if (typeof this.autocompleteRemote === 'function') {
          return this.autocompleteRemote(this.model)
        } else return null
      }
    },
    computedIcon() {
      return this.isLoading
        ? this.computedStatusClasses.initLoadingIcon
        : this.icon
    },
    isLoading() {
      const loadersArray = []
      Object.keys(this.loaders).forEach(i => {
        loadersArray.push(this.loaders[i])
      })
      const keys = [...loadersArray, this.autocompleteRetriever.loading]
      let i
      for (i = 0; i < keys.length; i += 1) {
        if (keys[i]) {
          return true
        }
      }
      return false
    },
    dropdownOptions() {
      return [...this.autoCompleteRemoteFeeds, ...this.data]
    },
    computedStatusClasses() {
      const defaults = {
        initHolder: 'row coc-margin-0 coc-padding-y-10px coc-padding-x-3px',
        initContainer: 'coc-standard-border-radius',
        initInput: 'coc-standard-border-radius',
        initLoadingIcon: 'ivu-icon ivu-icon-ios-loading coc-spin',
        initIcon: '',
        success:
          'coc-success-tint-9-bg coc-success-shade-3-text coc-success-focus-box-tint-5-shadow coc-success-border',
        error:
          'coc-error-tint-9-bg coc-error-shade-3-text coc-error-focus-box-tint-5-shadow coc-error-border',
        mount: 'coc-border-border coc-content-text coc-primary-background-bg',
        focus: 'coc-primary-section-outline'
      }
      return { ...defaults, ...this.statusClasses }
    },
    inputRef() {
      if (!this.allowAutocomplete) {
        return () =>
          this.$refs.input.$refs[
            this.type !== 'textarea' ? 'input' : 'textarea'
          ]
      } else {
        return () => this.$refs.input.$refs.input.$refs.input
      }
    },
    computedRules() {
      if (!this.rules || this.onReset) return null
      if (typeof this.rules === 'object') {
        return this.rules
      }
      if (typeof this.rules === 'function') {
        return this.rules(this.model)
      }
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.handleValue(value)
      }
    },
    inputFieldModel() {
      this.isFired = true
      if (this.rules) {
        this.loaders.validation = true
      }
    },
    model: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit('input', this.lightModel ? val.val : val)
      }
    }
  },
  mounted() {
    // On Mount Code
    this.handleStyles()
  },
  methods: {
    // Generators
    getAtomController(controller) {
      return this.atomControllers[controller]
    },
    // General Controllers
    async update(value = '', styleReaction = true) {
      this.inputFieldModel = value
      this.isFired = true
      if (styleReaction) {
        this.handleStyles()
      }
    },
    async clear() {
      this.update()
    },
    async disFire() {
      this.isFired = false
    },
    async reset() {
      this.onReset = true
      this.update('', false).then(() => {
        this.isFired = false
        this.handleStyles()
        this.onReset = false
        this.loaders.validation = false
      })
    },
    // Dom Controllers
    async focus() {
      this.inputRef().focus()
    },
    async blur() {
      this.inputRef().blur()
    },
    async select() {
      this.inputRef().select()
    },
    async copy() {
      if (!this.inputFieldModel || !this.inputFieldModel.length) {
        return
      }
      this.select().then(() => {
        if (document) {
          document.execCommand('copy')
        }
      })
    },
    // Events Methods
    handleEnter() {
      this.atomControllers.submit()
      this.$emit('coc-submit', this.model)
    },
    handleFocus() {
      this.isFocused = true
      this.handleStyles()
      this.$emit('coc-focus')
    },
    handleBlur() {
      this.isFocused = false
      this.handleStyles()
      this.$emit('coc-blur')
    },
    handleInput() {
      // some code
      if (
        this.allowAutocomplete &&
        this.autocompleteRemote &&
        !this.autocompleteFetchOnce
      ) {
        this.autocompleteRetriever.retrieve()
      }
    },
    handleClear() {
      this.isFired = true
      // some code
    },
    // After Events Methods
    handleAutocompleteSuccess(e) {
      this.$emit('coc-autocomplete-success', e)
      if (this.autocompleteMapResponse) {
        this.autoCompleteRemoteFeeds = this.autocompleteMapResponse(
          e.response,
          this.model
        )
      }
    },
    handleAutocompleteError(e) {
      this.$emit('coc-autocomplete-error', e)
    },
    handleValue(val) {
      if (!val) {
        return
      }
      if (typeof val === 'object') {
        this.inputFieldModel = val.val
      } else if (typeof val === 'string' || typeof val === 'number') {
        this.inputFieldModel = val
      }
    },
    handleValidation(e) {
      if (e.attemps === 0) {
        if (!this.inputFieldModel || !this.inputFieldModel.length) {
          return
        }
      }
      this.isFired = true
      this.loaders.validation = false
      this.isValid = e
      this.handleStyles()
    },
    handleStyles() {
      const container = new this.$coc.$(this.$refs.input.$el)
      const input = new this.$coc.$(this.inputRef())
      let status = 'mount'
      if (!this.isFired && !this.isFocused) {
        status = 'mount'
      } else if (!this.isFired && this.isFocused) {
        status = 'focus'
      } else if (this.isValid.valid) {
        status = 'success'
      } else if (!this.isValid.valid && this.rules) {
        status = 'error'
      }
      this.handleClasses(container, input, status)
    },
    handleClasses(container, input, status) {
      Object.keys(this.computedStatusClasses).forEach(i => {
        if (i.startsWith('init') && !this.isFired) {
          if (i.toLowerCase().includes('container')) {
            container.AddClass(this.computedStatusClasses[i], true)
          } else if (i.toLowerCase().includes('input')) {
            input.AddClass(this.computedStatusClasses[i], true)
          }
        } else {
          if (i !== status) {
            container.RemoveClass(this.computedStatusClasses[i])
            input.RemoveClass(this.computedStatusClasses[i])
          }
        }
      })
      container.AddClass(this.computedStatusClasses[status])
      input.AddClass(this.computedStatusClasses[status])
    }
  }
}
</script>

<style lang="css" scoped>
</style>
