<template>
  <div>
    <coc-axios
      v-if = "!local"
      :url = "submit_at"
      :params = "params"
      :method = "method"
      :free_origin = "free_origin"
      :xdata = "submitData"
      v-model = "retriever"
      :scope = "scope"
      prevent_on_mount
      @success = "handleSubmit($event)"
      @catch = "handleCatch($event)"/>
    <Button
      :type = "type"
      :plain = "plain"
      :circle = "circle"
      :round = "round"
      :class = "classes"
      :icon = "icon"
      :size = "size"
      :disabled = "disabled"
      @click = "construct()"><template v-if = "placeholder && placeholder.length">{{ placeholder }}</template></Button>
  </div>
</template>
<script>
export default {
  name: 'CocButton',
  props: {
    submit_at: {
      type: String,
      default: null
    },
    xdata: {
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
    free_origin: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      default: 'post'
    },
    params: {
      type: Object,
      default: null
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
    success_at: {
      type: Array,
      default: null
    },
    success_msg: {
      type: Object,
      default: () => {
        return {
          body: 'Your have submited successfuly',
          title: 'Success',
          type: 'success'
        }
      }
    },
    error_at: {
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
    validation_msg: {
      type: Object,
      default: () => {
        return {
          body: 'There`re some fields you need to complete.',
          title: 'Whoops!'
        }
      }
    },
    precondition_msg: {
      type: Object,
      default: () => {
        return {
          body: 'There`re some fields you need to complete.',
          title: 'Whoops!'
        }
      }
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
    $nuxt.$on('COCFormController', payloads => {
      //Type Checking
      if (payloads.type === undefined || payloads.type != 'button') return
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
            component: 'Coc Button',
            content:
              'The controller (' +
              payloads.controller +
              ') that you`re trying to access is not exist.'
          })
        }
      } else return
    })
    $nuxt.$on('COCFormMeta', payloads => {
      if (payloads.meta && payloads.meta == 'valid')
        if ($nuxt.$coc.IsMatchedArrays(vm.scope, payloads.scope)) { // eslint-disable-line
          if (payloads.credentials == false) {
            vm.errorStack.push(1)
          } else return
        } else return
      else return
    })
  },
  methods: {
    construct() {
      this.emit('clicked')
      //Check the precondition
      if (this.precondition !== null && this.precondition == false) {
        this.notifi(this.precondition_msg)
        this.emit('validation_refused')
        return
      }
      this.errorStack = []
      if (!this.ignore) {
        this.waitingLocalResponse = true
        $nuxt.$emit('COCFormController', {
          scope: this.scope,
          controller: 'validate',
          credentials: 'meta'
        })
      }
      setTimeout(() => {
        this.waitingLocalResponse = false
        if (this.hasErrors) {
          this.notifi(this.validation_msg)
          this.emit('validation_refused')
          return
        } else {
          this.emit('validation_passed')
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
          content:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      } else {
        this.$Notice.error({
          title: message.title === undefined ? 'Whoops!' : message.title,
          content:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      }
    },
    handleSubmit(e) {
      this.networkErrors = null
      //Search For Errors
      if (this.error_at) {
        let errorIndex = $nuxt.$coc.GetIndex( // eslint-disable-line
          $nuxt.$coc.FilterArrayOfObjects(this.error_at, "res"), // eslint-disable-line
          e.response
        )
        if (errorIndex != -1) {
          this.notifi({
            body: this.error_at[errorIndex].body,
            title: this.error_at[errorIndex].title
          })
          this.emit('submit_refused')
          return
        }
      }
      //Search For Success
      if (
        this.computed ||
        (this.success_at && $nuxt.$coc.ArrayIncludes(this.success_at, e.response)) // eslint-disable-line
      ) {
        this.notifi(
          new $nuxt.$coc.Objects(this.success_msg).MixAndCreate({ type: "success" }) // eslint-disable-line
        )
        this.emit('submit_accepted')
        $nuxt.$emit('COCFormController', {
          scope: this.scope,
          controller: 'reset',
          credentials: null
        })
        return
      }
    },
    handleCatch(e) {
      this.networkErrors = e.errors
      let msg = ''
      if (e.errors.status == 404) {
        msg =
          "Whoops, Seems like you're lost, try to refresh your page, otherwise kindly report us about it so we can fix it."
      }

      if (e.errors.status == 500) {
        msg =
          'Whoops, Seems like something went wrong, try to refresh your page, otherwise kindly report us about it so we can fix it.'
      }

      if (e.errors.status == 402) {
        msg =
          'Some fields are not completed, please complete them first and try again.'
      }

      if (e.errors.status == 401) {
        msg =
          'Whoops, Your session has expired, please refresh your page and try again.'
      }
      this.notifi({ title: 'Whoops!', body: msg })
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
