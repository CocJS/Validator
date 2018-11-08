<template>
  <div class = "row">
    <div 
      v-for = "(step, s) in fields" 
      :key = "s">
      <coc-form-item 
        v-for = "(item, index) in step.fields" 
        :key = "index"
        v-model = "items[item.ref]"
        :scope = "getScope(item, index)" 
        :item = "item"/>
    </div>
    <Steps>
      <Step 
        v-for = "(step, s) in fields" 
        :key = "s" 
        :title="step.step"
        :content = "step.content ? step.content : `Step ${s} `" />
    </Steps>
  </div>
</template>
<script>
export default {
  name: 'CocForm',
  props: {
    fields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      items: {}
    }
  },
  mounted() {
    console.log(this)
  },
  methods: {
    getScope(item, index) {
      if (item.type === 'button') {
        if (index === this.fields.length - 1) {
          return [`coc_form_${this._uid}`]
        } else {
          return [`coc_form_${this._uid}_step_${index}`]
        }
      } else {
        return [`coc_form_${this._uid}`, `coc_form_${this._uid}_step_${index}`]
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
