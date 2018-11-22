<template>
  <div 
    :class = "[container_class]" 
    :id= "mainId">
    <div :class = "[toggler_class]">
      <div @click = "handleClick($event)">
        <slot 
          :val = "model.val" 
          name = "toggler">
          <a :class = "togglerStatus"><p>
            <span :class = "[icon , statusClass ]"/>
            <span :class = "[ statusClass ]"> {{ title }} </span>
            <span :class = "['right' , statusClass , {'coc-angle-up' : isActive } , {'coc-angle-down' : !isActive}]"/>
          </p></a>
          <small 
            v-if = "comment" 
            :class = "[comment_class]"> {{ comment }} </small>
        </slot>
      </div>
    </div>
    <div 
      :class = "bodyClasses"
      :id = "componentId">
      <slot 
        v-if = "isFired" 
        :val = "model.val" 
        name = "content"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collapse',
  props: {
    container_class: {
      type: [Array, Object, String],
      default: 'row house-keeper'
    },
    toggler_class: {
      type: [Array, Object, String],
      default: 'row coc_container_toggler'
    },
    icon: {
      type: [Array, Object, String],
      default: 'el-icon-edit'
    },
    comment_class: {
      type: [Array, Object, String],
      default: 'row'
    },
    title: {
      type: String,
      default: 'Title'
    },
    comment: {
      type: String,
      default: null
    },
    body_class: {
      type: [Array, Object, String],
      default: 'row'
    },
    active_class: {
      type: [Array, Object, String],
      default: 'blue-text coc_text_m'
    },
    regular_class: {
      type: [Array, Object, String],
      default: 'blue-grey-text text-darken-2 coc_text_m'
    },
    toggler_on_class: {
      type: String,
      default: 'ui button fluid blue-grey darken-2'
    },
    toggler_off_class: {
      type: String,
      default: 'bulma button full-width'
    },
    toggled: {
      type: Boolean,
      default: false
    },
    scope: {
      type: Array,
      default: null
    },
    animations: {
      type: Object,
      default: () => {
        return {
          enter: 'animated bounceInDown',
          leave: 'animated slideOutUp hidden'
        }
      }
    }
  },
  data() {
    return {
      isFired: false,
      isActive: false,
      top: null
    }
  },
  computed: {
    mainId() {
      return 'coc_collapse_' + this._uid
    },
    statusClass() {
      return this.isActive && this.isFired
        ? this.active_class
        : this.regular_class
    },
    togglerStatus() {
      return this.isActive ? this.toggler_on_class : this.toggler_off_class
    },
    bodyClasses() {
      return [
        this.body_class,
        this.isActive ? this.animations.enter : this.animations.leave
      ]
    },
    componentId() {
      return 'coc_collapse_content_' + this._uid
    },
    model() {
      return {
        val: {
          active: this.isActive,
          fired: this.isFired
        },
        control: {
          toggle: this.toggle,
          open: this.open,
          close: this.close,
          scroll: this.scroll
        },
        meta: {
          scope: this.scope,
          contentId: this.componentId,
          containerId: this.mainId,
          top: this.top
        }
      }
    }
  },
  mounted() {
    if (this.toggled) this.open()
    const vm = this
    this.emit()
    $nuxt.$on('COCFormController', payloads => { // eslint-disable-line
      if (!vm.scope) return
      //Type Check
      if (payloads.type !== undefined && payloads.type != 'collapse') return
      //Check Matching
      if (COC.IsMatchedArrays(vm.scope, payloads.scope)) {
        if (vm.model.control[payloads.controller] !== undefined) {
          vm.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== 'undefined' &&
            typeof payloads.callback == 'function'
              ? payloads.callback
              : null
          )
        } else {
          COC.DevWarn({
            component: 'COC EL Collapse',
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
    handleClick(e) {
      this.isFired = true
      this.toggle()
    },
    toggle() {
      if (this.isActive) {
        this.close()
      } else {
        this.open()
      }
    },
    open() {
      this.isFired = true
      if (this.isActive) return
      this.isActive = true
      this.emit('open')
    },
    close() {
      this.isFired = true
      if (!this.isActive) return
      this.isActive = false
      this.emit('close')
    },
    scroll() {
      if (typeof window !== 'undefined' || typeof document !== undefined) return
      this.isFired = true
      this.open()
      setTimeout(() => {
        document.getElementById(this.componentId).scrollIntoView()
      }, 3500)
    },
    emit() {
      this.$emit('input', this.model)
      if (arguments.length > 0) {
        this.$emit(arguments[0], this.model)
      }
    },
    meta() {
      if (arguments.length == 0) {
        COC.DevWarn({
          component: 'COC EL Collapse',
          message: 'You need to pass the required meta name.'
        })
        return
      }
      if (arguments[0] == '*') {
        $nuxt.$emit('COCFormMeta', { // eslint-disable-line
          scope: this.scope,
          meta: arguments[0],
          credentials: this.model.meta
        })
        return
      }
      if (this.model.meta[arguments[0]] === undefined) {
        COC.DevWarn({
          component: 'COC EL Collapse',
          message:
            'The meta that you are requesting is not available in this CSMA.'
        })
        return
      }
      $nuxt.$emit('COCFormMeta', { // eslint-disable-line
        scope: this.scope,
        meta: arguments[0],
        credentials: this.model.meta[arguments[0]]
      })
    },
    once(seconds, callback) {
      var counter = 0
      var time = window.setInterval(function() {
        counter++
        if (counter >= seconds) {
          callback()
          window.clearInterval(time)
        }
      }, 400)
    },
    slideUp(elem) {
      elem.style.maxHeight = '0'
      this.once(1, function() {
        elem.style.opacity = '0'
      })
    },
    slideDown(elem) {
      elem.style.maxHeight = '1000px'
      // We're using a timer to set opacity = 0 because setting max-height = 0 doesn't (completely) hide the element.
      elem.style.opacity = '1'
    }
  }
}
</script>

<style lang="css" scoped>
.coc_container_toggler{
 cursor : pointer
}

</style>
