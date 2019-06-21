<template>
  <div>
    <coc-axios
      v-if = "!local"
      v-bind = "request"
      v-model = "retriever"
      :scope = "scope"
      prevent-on-mount
      @success = "handleSubmit($event)"
      @catch = "handleCatch($event)"/>
    <Button
      :type = "type"
      :ghost = "plain"
      :shape = "circle ? 'circle': null"
      :round = "round"
      :loading = "isLoading"
      :class = "classes"
      :icon = "icon"
      :size = "size"
      :long = "long"
      v-bind = "bind"
      :disabled = "disabled"
      @click = "construct()">
      <slot
        name = "default">
        <template v-if = "placeholder && placeholder.length">{{ placeholder }}</template>
      </slot>
    </Button>
  </div>
</template>
<script>
export default {
  name: 'CocButton',
  props: {
    request: {
      type: Object,
      default: null
    },
    scope: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'primary'
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    classes: {
      type: [Array, Object, String],
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    local: {
      type: Boolean,
      default: false
    },
    ignore: {
      type: Boolean,
      default: false
    },
    computed: {
      type: Boolean,
      default: false
    },
    denotifi: {
      type: Boolean,
      default: false
    },
    sucessAt: {
      type: Array,
      default: null
    },
    long: {
      type: Boolean,
      default: false
    },
    bind: {
      type: Object,
      default: null
    },
    successMessage: {
      type: Object,
      default: () => {
        return {
          body: 'Your have submited successfuly',
          title: 'Success',
          type: 'success'
        }
      }
    },
    resolveSuccessMessage: {
      type: Function,
      default: err => {
        return {
          body: 'Submited Successfuly',
          title: 'Done'
        }
      }
    },
    resolveErrorMessage: {
      type: Function,
      default: err => {
        return {
          body: err.response.data,
          title: 'Whoops!'
        }
      }
    },
    errorAt: {
      type: Array,
      default: null
    },
    unclearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    precondition: {
      type: Boolean,
      default: null
    },
    validationMessage: {
      type: Object,
      default: () => {
        return {
          body: 'There`re some fields you need to complete.',
          title: 'Whoops!'
        }
      }
    },
    beforeSubmit: {
      type: [Promise, Function],
      default: null
    },
    resolveResponse: {
      type: Function,
      default: () => true
    },
    preconditionMessage: {
      type: Object,
      default: () => {
        return {
          body: 'There`re some fields you need to complete.',
          title: 'Whoops!'
        }
      }
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      retriever: { loading: false },
      errorStack: [],
      waitingLocalResponse: false,
      networkErrors: null
    }
  },
  computed: {
    eventController() {
      return new this.$coc.FormController({
        api: $nuxt,
        type: 'button',
        scope: this.scope,
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.componentId,
          type: 'button',
          val: this.input
        }
      })
    },
    hasErrors() {
      return this.errorStack && this.errorStack.length > 0
    },
    isLoading() {
      return this.retriever.loading || this.waitingLocalResponse
    },
    submitData() {
      return this.xdata
    },
    model() {
      return {
        control: {
          click: this.construct,
          submit: this.submit
        },
        meta: {
          hasErrors: this.hasErrors,
          errorStack: this.errorStack,
          loading: this.isLoading,
          networkErrors: this.networkErrors,
          response: this.retriever.response,
          progress: this.retriever.progress,
          xdata: this.xdata
        }
      }
    }
  },
  mounted() {
    this.emit()
    const vm = this
    this.eventController.Start()
    this.eventController.ReceiveMeta('valid', payloads => {
      if (payloads.credentials === false || payloads.pennding) {
        vm.errorStack.push(payloads)
      }
    })
  },
  methods: {
    construct() {
      if (this.beforeSubmit) {
        this.waitingLocalResponse = true
        this.beforeSubmit()
          .then(() => {
            this.click()
          })
          .catch(err => {
            this.waitingLocalResponse = false
            this.$Message.error({ content: 'Some thing went wrong' })
          })
      } else {
        this.click()
      }
    },
    click() {
      this.emit('clicked')
      //Check the precondition
      if (this.precondition !== null && this.precondition == false) {
        this.notifi(this.preconditionMessage)
        this.emit('coc-validation-refused')
        return
      }
      this.errorStack = []
      if (!this.ignore) {
        this.waitingLocalResponse = true
        this.eventController.Send({
          controller: 'validate',
          credentials: 'meta'
        })
      }
      setTimeout(() => {
        this.waitingLocalResponse = false
        if (this.hasErrors) {
          this.notifi(this.validationMessage)
          this.emit('coc-validation-refused')
          return
        } else {
          this.emit('coc-validation-passed')
          this.submit()
        }
      }, 500)
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    submit() {
      if (!this.local) {
        this.retriever.retrieve()
      }
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    notifi(message) {
      if (this.denotifi) {
        return
      }
      const type = message.type === undefined ? 'error' : message.type
      if (type === 'success') {
        this.$Notice.success({
          title: message.title === undefined ? 'Whoops!' : message.title,
          desc:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      } else {
        this.$Notice.error({
          title: message.title === undefined ? 'Whoops!' : message.title,
          desc:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      }
    },
    resolveMessage(message, type) {
      const defaultMessage = {
        type,
        body: '',
        title: type === 'success' ? 'Done' : 'Whoops!'
      }
      if (typeof message === 'string') {
        return {
          ...defaultMessage,
          body: message
        }
      } else if (typeof message === 'object') {
        return {
          ...defaultMessage,
          ...message
        }
      }
    },
    handleSubmit(e) {
      this.networkErrors = null
      if (!this.resolveResponse || this.resolveResponse(e.response)) {
        if (this.local) {
          this.notifi({ ...this.successMessage, ...{ type: 'success' } })
        } else {
          this.notifi(
            this.resolveMessage(
              this.resolveSuccessMessage(e.response),
              'success'
            )
          )
        }
        this.emit('coc-submit-accepted')
        if (this.reset) {
          this.eventController.Send({
            scope: this.scope,
            controller: 'reset',
            credentials: null
          })
        }
        return
      }
    },
    handleCatch(e) {
      if (this.resolveErrorMessage) {
        this.notifi(
          this.resolveMessage(this.resolveErrorMessage(e.errors), 'error')
        )
      }
    },
    emit() {
      this.$emit('input', this.model)
      if (arguments.length > 0) this.$emit(arguments[0], this.model)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
