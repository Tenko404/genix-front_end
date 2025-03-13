<template>
  <div id="app">
    <FilmeHeader />
    <router-view />
    <FilmeFooter />
  </div>
</template>

<script>
import FilmeHeader from '@/components/FilmeHeader.vue'
import FilmeFooter from '@/components/FilmeFooter.vue'
import { useThemeStore } from '@/stores/themeStore'
import { RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    FilmeHeader,
    FilmeFooter,
    RouterView,
  },
  setup() {
    const themeStore = useThemeStore()
    // Initialize theme when app starts
    themeStore.initTheme()
    return { themeStore }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* This ensures the footer stays at the bottom */
#app > .router-view {
  flex: 1;
}
</style>