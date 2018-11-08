<template>
  <div>
    <coc-master-nav />
    <main>
      <slot/>  		
    </main>
    <coc-master-footer />
  </div>
</template>

<script>
import CocMasterNav from '../Partials/CocMasterNav.vue'
import CocMasterFooter from '../Partials/CocMasterFooter.vue'
export default {
  name: 'CocMainMaster',
  components: {
    CocMasterNav,
    CocMasterFooter
  },
  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
</style>
