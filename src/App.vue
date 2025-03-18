<template>
  <div id="app">
    <!-- Meta tag for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <nav class="navbar">
      <div class="nav-content">
        <!-- Logo linking to home -->
        <router-link to="/" class="nav-logo">
          <img src="@/assets/logo.png" alt="Genix Logo">
        </router-link>
        <!-- Mobile menu toggle button -->
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>
        <div class="nav-links" :class="{ 'active': isMobileMenuOpen }">
          <!-- Close button for mobile menu -->
          <button class="mobile-menu-close" @click="closeMobileMenu" aria-label="Close menu">
            <i class="fas fa-times"></i>
          </button>
          <!-- Navigation links -->
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-home mobile-icon"></i>
            <span>Home</span>
          </router-link>
          <router-link to="/tinder" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-heart mobile-icon"></i>
            <span>Tinder Mode</span>
          </router-link>
          <router-link to="/party" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-users mobile-icon"></i>
            <span>Party Mode</span>
          </router-link>
          <router-link to="/profile" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-user mobile-icon"></i>
            <span>Profile</span>
          </router-link>
        </div>
        <!-- Theme toggle button -->
        <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <!-- Router view for displaying current route -->
      <router-view></router-view>
    </main>
    <!-- Footer component -->
    <FilmeFooter />
  </div>
</template>

<script>
import FilmeFooter from '@/components/FilmeFooter.vue'
import { useThemeStore } from '@/stores/themeStore'
// Removed unused import of RouterView
import { ref } from 'vue'

export default {
  name: 'App',
  components: {
    FilmeFooter,
    // Removed RouterView as it's used directly in the template
  },
  setup() {
    const themeStore = useThemeStore()
    const isMobileMenuOpen = ref(false)
    
    // Initialize theme when app starts
    themeStore.initTheme()

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    // Close mobile menu
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    return { 
      themeStore,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      isDarkMode: themeStore.isDarkMode,
      toggleTheme: themeStore.toggleTheme
    }
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
  background-color: var(--bg-color);
}

body {
  margin: 0;
  padding: 0;
  height: 100vh; /* Ensure body takes full height */
  background-color: var(--bg-color);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}

.router-view {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
}

.router-view > * {
  flex: 1 0 auto;
}

.navbar {
  background: var(--header-bg);
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.nav-logo img {
  height: 40px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0.5rem;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background-color: var(--hover-bg);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}

.mobile-menu-toggle:hover {
  background-color: var(--hover-bg);
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.mobile-icon {
  display: none;
  width: 20px;
  text-align: center;
  margin-right: 0.75rem;
}

.mobile-menu-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
}

.mobile-menu-close:hover {
  background-color: var(--hover-bg);
}

@media (max-width: 768px) {
  .nav-logo {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
    margin-right: auto;
  }

  .mobile-menu-close,
  .mobile-icon {
    display: flex;
  }

  .nav-content {
    padding: 0 1rem;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    width: 240px;
    height: auto;
    max-height: 70vh;
    background: var(--header-bg);
    flex-direction: column;
    padding: 1rem 0.75rem;
    gap: 0.2rem;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 999;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-radius: 0 0 8px 0;
  }
  
  .nav-links.active {
    display: flex;
    transform: translateX(0);
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.75rem;
    text-align: left;
    width: 100%;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    min-height: 36px;
  }
  
  .nav-link:hover {
    background-color: var(--hover-bg);
  }
  
  .nav-link.router-link-active {
    background-color: var(--hover-bg);
    color: var(--primary-color);
  }
  
  .mobile-menu-close {
    top: 0.5rem;
    right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .nav-content {
    padding: 0 0.5rem;
  }
  
  .mobile-menu-toggle {
    font-size: 1.2rem;
  }

  .nav-links {
    width: 220px;
    max-height: 90vh;
    padding: 1rem 0.75rem;
  }

  .nav-link {
    padding: 0.65rem 0.75rem;
    font-size: 0.95rem;
    min-height: 36px;
  }
  
  .mobile-icon {
    width: 18px;
    margin-right: 0.75rem;
  }

  .mobile-menu-close {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
  }
}
</style>