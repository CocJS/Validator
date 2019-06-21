<template>
  <div v-if = "dev">
    <pre>
    	<code>
    		foo
    	</code>
    </pre>
  </div>
</template>

<script>
export default {
  name: 'CocFormAtom',
  props: {
    scope: {
      type: Array,
      default: null
    },
    cocEventController: {
      type: Object,
      required: true
    },
    val: {
      type: [Object, String, Number, Array],
      default: null
    },
    validate: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    dev: {
      type: Boolean,
      default: false
    },
    overRideOldAttemps: {
      type: Boolean,
      default: false
    },
    disableOnMount: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Data
      validator: new this.$coc.Validator(this.val)
    }
  },
  computed: {
    eventController() {
      return new this.$coc.FormController({
        api: this.$root,
        type: this.cocEventController.type,
        scope: this.scope,
        model: this.generateModel(this.cocEventController.model),
        component: this.cocEventController.component
      })
    }
  },
  watch: {
    val: {
      deep: true,
      handler(val) {
        if (!this.validate) {
          return
        }
        this.validator.SetVal(val)
        this.validateValue()
      }
    },
    validate: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && typeof val === 'object') this.validator.SetOptions(val)
      }
    }
  },
  mounted() {
    this.$emit('coc-atom-control', {
      validator: this.validator,
      validate: this.validateValue,
      meta: this.eventController.HandleMeta,
      submit: this.submit
    })
    this.eventController.Start()
    if (!this.disableOnMount) {
      this.validateValue()
    }
  },
  methods: {
    generateModel(model) {
      const { control } = model
      control.validate = this.validateValue
      return {
        control,
        val: model.val,
        meta: model.meta
      }
    },
    validateValue(credentials = null) {
      this.eventController.SetPennding(true)
      const vm = this
      this.validator
        .Run()
        .then(data => {
          vm.emitValidation(data, credentials)
        })
        .catch(err => {
          vm.emitValidation(err, credentials)
        })
    },
    emitValidation(data, credentials) {
      if (this.overRideOldAttemps || data.attemp === data.attemps) {
        this.$emit('validation', data)
      }
      if (data.attemp === data.attemps) {
        this.eventController.SetPennding(false)
      }
      if (credentials === 'meta') {
        this.eventController.HandleMeta('valid', data)
      }
    },
    submit() {
      this.eventController.Submit()
    }
  }
}
</script>

<style lang="css" scoped>
</style>
