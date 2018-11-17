<template>
  <nav :class = "classes.nav">
    <slot>
      <span class = "text-super text-code">{{ $coc.App.name }}</span>
    </slot>
  </nav>
</template>

<script>
export default {
  name: 'CocMasterNav',
  props: {
    classes: {
      type: Object,
      default: () => {
        return {
          nav: 'coc-primary-bg coc-padding-1perc coc-secondary-text'
        }
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
</style>
