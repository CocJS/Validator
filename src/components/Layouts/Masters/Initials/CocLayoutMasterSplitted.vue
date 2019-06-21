<template>
  <div class = "coc_house_keeper" >
    <coc-master-nav>
      <slot name = "nav"/>
    </coc-master-nav>
    <coc-watch-my-window v-model = "win" />
    <div class="row coc_house_keeper">
      <div 
        v-if = "slide == 'left' || (win && win.isLarge)"
        class = "coc_house_keeper col l6 s12">
        <div class="row coc_house_keeper">
          <slot name = "left"/>
        </div>
        <div 
          class="row coc_house_keeper">
          <div 
            v-if = "win && !win.isLarge" 
            class="row  coc_house_keeper">
            <a @click = "slide = slide == 'right' ? 'left' : 'right'">
              <slot name = "toggleLeft"> Toggle </slot>
            </a>
          </div>
        </div>
      </div>
      <div 
        v-if = "(win && win.isLarge) || slide == 'right'"
        class = "coc_house_keeper col l6 s12">
        <slot name = "right" />
        <div 
          v-if = "win && !win.isLarge" 
          class="row coc_house_keeper">
          <a 
            @click = "slide = slide == 'right' ? 'left' : 'right'">
            <slot name = "toggleRight"> Toggle </slot>
          </a>
        </div>
      </div>
    </div>
    <coc-master-footer>
      <slot name = "footer"/>
    </coc-master-footer>
  </div>
</template>

<script>
export default {
  name: 'Coclosplitted',

  data() {
    return {
      getstartedcollapse: null,
      win: null,
      slide: 'left'
    }
  },
  watch: {
    slide: {
      immediate: true,
      handler(slide) {
        this.$emit('input', { slide })
      }
    }
  },
  methods: {
    asset(url) {
      return `/${url}`
    }
  }
}
</script>

<style lang="css" >
</style>
