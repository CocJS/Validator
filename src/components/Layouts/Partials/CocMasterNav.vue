<template>
  <coc-nav :classes = "classes">
    <div slot = "title">
      <nuxt-link
        to="/"
        class="text-super text-code coc-primary-text coc-nav-brand col coc-padding-0"
      >
        <coc-avatar
          v-coc-mouse-over="'jello'"
          v-coc-mouse-leave="'rubberBand'"
          :source="$coc.App.logo.primary"
          scale = "40px"
          class="logo col coc-padding-0 animated"/>
        <span
          class="name col coc-padding-x-15px coc-padding-y-0 coc-margin-0"
        >{{ $coc.App.brandName }}</span>
      </nuxt-link>
    </div>
    <div slot = "middle">
      <coc-input
        v-model="cocPureInput"
        :status-classes = "{
          initHolder: 'house-keepe col s12'
        }"
        placeholder = "Search"
        size = "large"
        class = "coc-padding-y-18px"
        icon = "ivu-icon ivu-icon-ios-search"
      />
    </div>
    <div slot = "actions">
      <div class="row house-keeper right">
        <Dropdown>
          <Button
            type="text"
            size = "large"
            style = "height: 70px; border-radius: 0">
            One
            <Icon type="ios-arrow-down"/>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>Lorem</DropdownItem>
            <DropdownItem>Ipsum</DropdownItem>
            <DropdownItem disabled>Dolar</DropdownItem>
            <DropdownItem>Imet</DropdownItem>
            <DropdownItem divided>Foo</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <Button
            type="text"
            size = "large"
            style = "height: 70px; border-radius: 0">
            Two
            <Icon type="ios-arrow-down"/>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>Lorem</DropdownItem>
            <DropdownItem>Ipsum</DropdownItem>
            <DropdownItem disabled>Dolar</DropdownItem>
            <DropdownItem>Imet</DropdownItem>
            <DropdownItem divided>Foo</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </coc-nav>
</template>

<script>
export default {
  name: 'CocMasterNav',
  props: {
    classes: {
      type: Object,
      default: () => {
        return {
          nav:
            'transparent coc-main-nav coc-primary-text coc-primary-hover-text row house-keeper',
          title: 'left col l3 s8 coc-nav-section house-keeper',
          middle: 'col l5 coc-nav-section hide-on-med-and-down house-keeper',
          actions: 'right col l3 s4 coc-nav-section house-keeper'
        }
      }
    }
  },
  data() {
    return {
      cocPureInput: null
    }
  }
}
</script>

<style lang="css" scoped>
.coc-main-nav {
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 123;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08) !important;
}
.coc-nav-brand {
  margin-left: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 40px;
}
.coc-nav-brand .logo {
  width: 40px !important;
  height: 40px !important;
  background-color: transparent;
}
.coc-nav-brand .name {
  height: 40px !important;
  line-height: 40px;
}
.coc-nav-section {
  height: 70px;
}
</style>
