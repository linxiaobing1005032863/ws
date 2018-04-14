<template>
  <div id="app">
      <router-view/>
  </div>
</template>
<script>
import './utils/filter';
export default {
  name: 'App',
}
</script>

<style  lang="scss">
@import './style/common.scss';
@import './style/cover-elementui.scss';
@import "./utils/validate/validate_ui.scss";
@import "./style/mixins";
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-width: 1000px;
  height: 100%;
  @include optimizationScroll;
}
</style>
