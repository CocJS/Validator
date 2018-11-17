<template>
  <div>
    <coc-input 
      v-if = "item.type === 'input'" 
      :scope = "scope"
      v-bind = "item.props"
      v-on="$listeners">
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-input>
    <coc-select 
      v-if = "item.type === 'select'" 
      v-bind = "item.props"
      :scope = "scope"
      v-on="$listeners">
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-select>
    <coc-radio 
      v-if = "item.type === 'radio'" 
      v-bind = "item.props"
      :scope = "scope"
      v-on="$listeners" >
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope"/>
      </template>
    </coc-radio>
    <coc-date
      v-if = "item.type === 'date'" 
      v-bind = "item.props"
      :scope = "scope"
      v-on="$listeners" >
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-date>
    <coc-button 
      v-if = "item.type === 'button'" 
      v-bind = "item.props"
      :scope = "scope"
      v-on="$listeners" />
  </div>
</template>

<script>
export default {
  name: 'CocFormItem',
  props: {
    item: {
      type: Object,
      default: null
    },
    scope: {
      type: Array,
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
</style>
