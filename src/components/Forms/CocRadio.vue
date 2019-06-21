<template>
  <div :id = "containerId">
    <!--Retrievers-->
    <cocretriever
      v-if = "live"
      :url = "fill_from"
      :xdata = "fill_xdata"
      v-model = "remoteFeedsRetriever"
      @success = "handleRemoteFeeds($event)"/>
    <cocretriever
      v-if = "autocomplete"
      :url = "autocomplete_from"
      :xdata = "{ q : input }"
      v-model = "autocompleteRetriever"
      prevent_on_mount
      @success = "handleAutoComplete($event)"/>
    <cocretriever
      v-if = "remote_check"
      :url = "remote_check.url"
      :xdata = "{ q : input }"
      v-model = "remoteCheckRetriever"
      prevent_on_mount
      @success = "handleRemoteCheck($event)"/>
    <!--Retrievers-->
    <RadioGroup
      v-if = "!multiple"
      :size = "size"
      v-model="input"
      @input = "construct({ remote : true , value : $event })">
      <template v-for = "(feed , index) in feeds.get">
        <Radio
          v-if = "!button"
          :key = "index"
          :disabled = "hashOption(feed).disabled"
          :value = "hashOption(feed).value"
          :size = "size"
          :border = "border"
          :label = "hashOption(feed).label">
          <span>
            <span :class = "[ icon_align , hashOption(feed).icon ]"/>
            <span class = "coc_px_side_padding" >{{ hashOption(feed).label }}</span>
            <span class="coc_px_side_padding"><small
              v-if = "hashOption(feed).comment"
              :class = "[inverseAlign , 'coc_px_side_padding blue-grey-text text-lighten-1']">{{ hashOption(feed).comment }}</small></span>
          </span>
        </Radio>
        <Radio
          v-else
          :key = "index"
          :disabled = "hashOption(feed).disabled"
          :value = "hashOption(feed).value"
          :size = "size"
          :border = "border"
          :label = "hashOption(feed).label"/>
      </template>
    </RadioGroup>
    <CheckboxGroup
      v-else
      :size = "size"
      v-model="input"
      @input = "construct({ remote : true , value : $event })">
      <template v-for = "(feed , index) in feeds.get">
        <Checkbox
          v-if = "!button"
          :key = "index"
          :disabled = "hashOption(feed).disabled"
          :value = "hashOption(feed).value"
          :size = "size"
          :border = "border"
          :label = "hashOption(feed).label">
          <span>
            <span :class = "[ icon_align , hashOption(feed).icon ]"/>
            <span class = "coc_px_side_padding" >{{ hashOption(feed).label }}</span>
            <span class="coc_px_side_padding"><small
              v-if = "hashOption(feed).comment"
              :class = "[inverseAlign , 'coc_px_side_padding blue-grey-text text-lighten-1']">{{ hashOption(feed).comment }}</small></span>
          </span>
        </Checkbox>
        <Checkbox-button
          v-else
          :key = "index"
          :disabled = "hashOption(feed).disabled"
          :value = "hashOption(feed).value"
          :size = "size"
          :border = "border"
          :label = "hashOption(feed).label"/>
      </template>
    </CheckboxGroup>
    <ul
      v-if = "!isValid && isFired && !hide_errors"
      class = "row coc_validation_menu">
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
  name: 'CocRadio',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    light: {
      type: Boolean,
      default: false
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
    border: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
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
    //Selector Props
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    fill_from: {
      type: String,
      default: null
    },
    live: {
      type: Boolean,
      default: false
    },
    fill_xdata: {
      type: Object,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    allowcreate: {
      type: Boolean,
      default: false
    },
    default_first: {
      type: Boolean,
      default: false
    },
    min_picks: {
      type: Number,
      default: null
    },
    max_picks: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      input: null,
      autocompleteRetriever: { loading: false },
      remoteFeedsRetriever: { loading: false },
      remoteCheckRetriever: { loading: false },
      autocompleteResults: [],
      remoteCheckValidation: false,
      isValid: false,
      isFired: false,
      validationErrors: [],
      submits: 0,
      isFocused: false,
      icon_align: 'left',
      feeds: new this.$coc.Arrays([]), // eslint-disable-line
      remoteFeeds: [],
      pushedFeeds: [],
      onCopy: false
    }
  },
  computed: {
    logger() {
      return new this.$coc.Logger('Coc Radio')
    },
    eventController() {
      return new this.$coc.FormController({
        api: $nuxt,
        type: 'radio',
        scope: this.scope,
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.componentId,
          type: `Radio > ${this.multiple ? 'radio' : 'Checkbox'}`,
          val: this.input
        }
      })
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
    allSelected() {
      return this.multiple && this.input.length == this.feeds.Length
    },
    componentId() {
      return 'coc_elinput_' + this._uid
    },
    componentIdHidden() {
      return 'coc_elinput_hidden_' + this._uid
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
    validationsOptions() {
      return {
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
            pre: this.remote_check,
            credentials: null
          },
          {
            name: 'MinPicks',
            variable: false,
            pre: this.min_picks && this.multiple,
            credentials: this.min_picks
          },
          {
            name: 'MaxPicks',
            variable: false,
            pre: this.max_picks && this.multiple,
            credentials: this.max_picks
          }
        ]
      }
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
            'The maximum length for your value must be less than' + this.maxlen
        },
        InMinRange: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg:
            'The minimum length for your value must be greater than' +
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
        },
        MinPicks: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'You need to pick at least ' + this.min_picks + ' option/s.'
        },
        MaxPicks: {
          icon: 'el-icon-warning coc_px_side_padding',
          msg: 'You need to pick maximum ' + this.max_picks + ' option/s.'
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
      return new $nuxt.$coc.Objects(this.input_status_classes).Mix( // eslint-disable-line
        this.input_status_classes_mixins
      ).get
    },
    iconSize() {
      return this.size ? 40 : 60
    },
    inverseAlign() {
      return this.icon_align == 'left' ? 'right' : 'left'
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
              meta: this.meta,
              reset: this.reset,
              submit: this.submit,
              refill: this.refill,
              push: this.push,
              selectAll: this.selectAll
            },
            meta: {
              fired: this.isFired,
              valid: this.isValid,
              errors: this.validationErrors,
              autocomplete: this.autocompleteResults,
              domId: this.componentId,
              focused: this.isFocused,
              containerId: this.containerId,
              allSelected: this.allSelected
            }
          }
    }
  },
  mounted() {
    const vm = this
    this.initFeeds()
    //VUE EVENTS
    //Global Events <<$nuxt API>
    this.eventController.Start()
    //Construct
    this.construct({ remote: false, value: null, validate: false })
    if (this.start_as) this.update(this.start_as)
  },
  methods: {
    realign() {
      return true
    },
    construct(options) {
      if (options.validate === undefined || options.validate == true)
        this.isFired = true
      //Text Alignment
      this.realign()
      //Remote Check
      this.remoteCheckValidation = false
      if (
        (options.remote === undefined || options.remote == true) &&
        this.remote_check &&
        this.remoteCheckRetriever.retrieve
      )
        if ($nuxt.$coc.HasValue(this.remote_check.url)) // eslint-disable-line
          this.remoteCheckRetriever.retrieve()
        else
          this.logger.Warn(
            'You turned on remote_check option, but you did not set *url* to the prop.'
          )
      //AutoComplete
      if (this.autocomplete && this.autocompleteRetriever.retrieve)
        if ($nuxt.$coc.HasValue(this.autocomplete_from) && this.autocomplete) // eslint-disable-line
          this.autocompleteRetriever.retrieve()
        else
          this.logger.Warn(
            'You turned on autocomplete option, but you didn not set `autocomplete_from` prop.'
          )
      //Validations
      if (options.validate === undefined || options.validate == true)
        this.validate()
      this.emit()
    },
    update() {
      if (!arguments.length) {
        this.logger.Warn('You cant update without a value')
        return
      }
      this.input = arguments[0]
      this.construct({ remote: true, value: arguments[0] })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    initFeeds() {
      this.feeds
        .Clear()
        .Merge(this.options)
        .Merge(this.remoteFeeds)
        .Merge(this.pushedFeeds)
      this.reset()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    refill() {
      if (
        !this.live ||
        !this.remoteFeedsRetriever ||
        !typeof this.remoteFeedsRetriever.retrieve === 'function'
      ) {
        this.logger.Warn('You cant refill a non live component.')
        return
      }
      this.remoteFeedsRetriever.retrieve()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    push() {
      this.pushedFeeds.push(arguments[0])
      this.initFeeds()
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    clear() {
      this.input = ''
      this.construct({ remote: true, value: '' })
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    selectAll() {
      if (this.multiple) {
        let i,
          temp = []
        let opt = this.feeds.get
        for (i = 0; i < opt.length; i++)
          temp.push(this.hashOption(opt[i]).value)
        this.input = temp
        this.construct({ remote: true, value: temp, validate: true })
      }
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    meta(meta) {
      this.eventController.HandleMeta(meta)
    },
    reset() {
      this.input = this.multiple ? [] : null
      this.construct({ validate: false, remote: false })
      this.isFired = false
      this.validationErrors = []
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    submit() {
      this.eventController.Submit()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    handleAutoComplete(e) {
      this.autocompleteResults = e.response
      this.$emit('autocomplete', this.autocompleteResults)
    },
    handleRemoteCheck(e) {
      this.remoteCheckValidation =
        this.remoteCheckRetriever.response == this.remote_check.valid
      this.construct({ remote: false, value: this.input })
    },
    handleRemoteFeeds(e) {
      if (typeof e.response == 'object') this.remoteFeeds = e.response
      this.initFeeds()
    },
    validate() {
      this.isValid = true
      let validation = $nuxt.$coc.Validate.Start(this.validationsOptions); // eslint-disable-line
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
    },
    emit() {
      let event = arguments.length == 0 ? 'input' : arguments[0]
      this.$emit(event, this.model)
    },
    innerEmit(e) {
      this.$emit(e)
    },
    hashOption(feed) {
      if (typeof feed == 'object') {
        return {
          group: feed.group !== undefined && feed.group,
          value:
            feed.value !== undefined ? feed.value : feed[Object.keys(feed)[0]],
          label:
            feed.label !== undefined ? feed.label : feed[Object.keys(feed)[0]],
          icon: feed.icon !== undefined ? feed.icon : this.icon,
          comment: feed.comment !== undefined ? feed.comment : null,
          disabled: feed.disabled !== undefined && feed.disabled
        }
      } else
        return {
          value: feed,
          label: feed,
          icon: this.icon,
          comment: null,
          group: false
        }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
