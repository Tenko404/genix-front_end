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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap');

#app {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

/* This ensures the footer stays at the bottom */
#app > .router-view {
  flex: 1;
}
</style>