<template>
  <div
    :style = "{ width: scale, height: scale }"
    :class = "parentClass">
    <span
      v-if = "icon"
      :style = "{ width: scale, height: scale, fontSize: scale }"
      :class = "classes"/>
    <img
      v-else
      :src="source"
      :style = "{ width: scale, height: scale }"
      :class = "classes">
  </div>
</template>

<script>
export default {
  name: 'CocAvatar',
  props: {
    icon: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    },
    scale: {
      type: String,
      default: '50px'
    },
    borderRadius: {
      type: String,
      default: 'standard'
    },
    childClasses: {
      type: Array,
      default() {
        return ['col house-keeper']
      }
    },
    parentClass: {
      type: Array,
      default() {
        return ['row house-keeper coc-inline-block']
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    classes() {
      const c = [`coc-${this.borderRadius}-border-radius`, ...this.childClasses]
      if (this.icon) {
        c.push(this.icon)
      }
      return c
    }
  }
}
</script>

<style lang="css" scoped>
</style>
