<template>
  <div class = "row">
    <div 
      v-for = "(step, s) in fields"
      v-bind = "step.bind ? step.bind : { class : 'row'}" 
      :key = "s">
      <div v-if = "fields.length > 1">
        <p :class = "[ step.titleClass ? step.titleClass : 'text-md text-bold coc-primary-text' ]">{{ step.step }}</p>
        <p
          v-if = "step.content"
          :class = "[ step.contentClass ? step.contentClass : 'text-smd coc-dark-primary-text' ]">{{ step.content }}</p>
      </div>
      <coc-form-item 
        v-for = "(item, index) in step.fields" 
        :reference = "item.ref"
        :key = "index"
        v-model = "items[item.ref]"
        v-bind = "item.bind ? item.bind : { class : item.type === 'button' ? 'row right' : 'row' }"
        :scope = "getScope(item, index, s)" 
        :item = "item"/>
    </div>
    <Steps
      v-if = "fields.length > 1"
      class = "row">
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
    getScope(item, index, stepIndex) {
      if (item.type === 'button') {
        if (stepIndex === this.fields.length - 1) {
          return [`coc_form_${this._uid}`]
        } else {
          return [`coc_form_${this._uid}_step_${stepIndex}`]
        }
      } else {
        return [
          `coc_form_${this._uid}`,
          `coc_form_${this._uid}_step_${stepIndex}`
        ]
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
