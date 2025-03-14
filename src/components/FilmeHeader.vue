<template>
  <!-- Define o elemento raiz do componente, um cabeçalho (header) -->
  <header class="header">
    <!-- Aplica a classe CSS 'header' para estilização -->

    <div class="header-container">
      <!-- Define um contêiner para o logo e o menu, para controlar o alinhamento -->
      
      <div class="logo">
        <!-- Contêiner para o logo -->
        <a href="/">
          <img src="@/assets/logo.png" alt="Catálogo de Filmes" class="logo-img" />
        </a>
        <!-- Exibe a imagem do logo -->
        <!-- `src="@/assets/logo.png"`: Define o caminho para a imagem do logo -->
        <!-- `alt="Catálogo de Filmes"`: Define um texto alternativo para acessibilidade (leitores de tela) -->
        <!-- Aplica a classe CSS 'logo-img' para estilização -->
      </div>
      
      <nav class="menu">
        <a href="/party">Party</a>
        <!-- Define a barra de navegação -->
        <!-- Link para a página "Membros" -->
        <a href="/tinder_mode">Tinder Mode</a>
        <!-- Link para a página "Listas" -->
      </nav>
    </div>
    
    <div class="search-bar">
      <!-- Contêiner para a barra de busca -->
      <input
        type="text"
        placeholder="Pesquisar filmes..."
        class="search-input"
      />
      <!-- Campo de texto para a pesquisa -->
      <!-- `placeholder="Pesquisar filmes..."`: Define o texto exibido quando o campo está vazio -->
      <!-- Aplica a classe CSS 'search-input' para estilização -->
      
      <button class="search-button" aria-label="Pesquisar">
        <!-- Botão para iniciar a pesquisa -->
        <!-- `aria-label="Pesquisar"`: Define um texto alternativo para acessibilidade (leitores de tela) -->
        <i class="fas fa-search"></i>
        <!-- Exibe o ícone de busca (Font Awesome) -->
      </button>
    </div>
    <div class="usuario" @click="toggleMenu">
      <div class="usuario-info">
        <img
          src="@/assets/elonmusk.jpg"
          alt="Usuário"
          class="usuario-img"
        />
        <span class="usuario-nome">Filipe</span>
      </div>

      <div v-if="isMenuOpen" class="dropdown-menu">
        <div class="dropdown-header">
          <img src="@/assets/elonmusk.jpg" alt="Usuário" class="dropdown-profile-img" />
          <div class="dropdown-profile-info">
            <span class="dropdown-profile-name">Law</span>
            <span class="dropdown-profile-email">luis@email.com</span>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <a href="/perfil" class="dropdown-item">
          <i class="fas fa-user"></i>
          Meu Perfil
        </a>
        <a href="/configuracoes" class="dropdown-item">
          <i class="fas fa-cog"></i>
          Configurações
        </a>
        <div class="dropdown-divider"></div>
        <button @click="toggleTheme" class="dropdown-item theme-toggle">
          <i :class="['fas', themeStore.isDarkMode ? 'fa-sun' : 'fa-moon']"></i>
          {{ themeStore.isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}
        </button>
        <div class="dropdown-divider"></div>
        <a href="/sair" class="dropdown-item">
          <i class="fas fa-sign-out-alt"></i>
          Sair
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import { useThemeStore } from '@/stores/themeStore'

export default {
  name: 'FilmeHeader', // Nome do componente
  data() {
    return {
      isMenuOpen: false,
    };
  },
  setup() {
    const themeStore = useThemeStore()
    return { themeStore }
  },
  mounted() {
    // Add event listener when component is mounted
    document.addEventListener('click', this.handleClickOutside);
    this.themeStore.initTheme();
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleMenu(event) {
      event.stopPropagation();
      this.isMenuOpen = !this.isMenuOpen;
    },
    handleClickOutside(event) {
      const usuarioEl = document.querySelector('.usuario');
      if (this.isMenuOpen && usuarioEl && !usuarioEl.contains(event.target)) {
        this.isMenuOpen = false;
      }
    },
    toggleTheme() {
      this.themeStore.toggleTheme();
    }
  }
};
</script>

<style>
/* Component specific styles */
.theme-toggle {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color);
}

.theme-toggle i {
  color: var(--text-color);
  width: 20px;
}
</style>

<style scoped>
/* Cores */
.header {
  /* Estilos do cabeçalho */
  background-color: var(--header-bg);
  display: flex; /* Usa flexbox para alinhar os elementos */
  align-items: center; /* Alinha verticalmente os elementos */
  justify-content: space-between; /* Distribui os elementos horizontalmente */
  padding: 1.5rem 3rem; /* Define o espaçamento interno */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Adiciona uma sombra */
  border-bottom: 1px solid var(--border-color); /* Adiciona uma borda inferior sutil */
}

.header-container {
  /* Estilos para o container do logo e do menu */
  display: flex; /* Usa flexbox para alinhar os elementos */
  align-items: center; /* Alinha verticalmente os elementos */
  justify-content: space-between; /* Distribui os elementos horizontalmente */
  width: 70%; /* Define a largura */
}

/* Estilos do logo */
.logo-img {
  height: 60px; /* Define a altura */
  transition: transform 0.2s ease-in-out; /* Adiciona uma transição suave na transformação */
}

.logo-img:hover {
  transform: scale(1.1); /* Aplica um zoom ao passar o mouse */
}

/* Menu de navegação */
.menu {
  display: flex;
  gap: 2.5rem;
}

.menu a {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
  position: relative;
}

.menu a:hover {
  color: var(--text-color);
  transform: translateY(-3px);
}

.menu a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background-color: var(--text-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease-in-out;
}

.menu a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.usuario {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 30px;
  background-color: var(--hover-bg);
  transition: background-color 0.2s ease;
}

.usuario-info:hover {
  background-color: var(--hover-bg);
}

.usuario-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.usuario-nome {
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 500;
}

/* Estilos da barra de busca */
.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--search-bg);
  border-radius: 30px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  transition: border-color 0.2s ease-in-out;
  margin-left: 50px;
  min-width: 300px;
}

.search-bar:hover {
  border-color: var(--text-color);
}

.search-input {
  background-color: transparent;
  border: none;
  outline: none;
  color: var(--text-color);
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  width: 100%;
  transition: width 0.3s ease-in-out;
}

.search-input:focus {
  width: 100%;
}

/* Placeholder do input */
.search-input::placeholder {
  color: var(--secondary-text);
  opacity: 0.8;
}

.search-button {
  background-color: transparent;
  border: none;
  color: var(--secondary-text);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
}

.search-button:hover {
  color: var(--text-color);
}

/* Ícone de busca */
.search-button .fas {
  color: var(--secondary-text);
  font-size: 1.1rem;
}

.search-button:hover .fas {
  color: var(--text-color);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 260px;
  z-index: 1000;
  transform-origin: top right;
  animation: dropdownFade 0.2s ease-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
  background: linear-gradient(to right, var(--header-bg), var(--card-bg));
}

.dropdown-profile-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-profile-name {
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.dropdown-profile-email {
  color: var(--secondary-text);
  font-size: 0.9rem;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 8px 0;
  opacity: 0.6;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.dropdown-item i {
  font-size: 1.1rem;
  color: var(--secondary-text);
  width: 20px;
  text-align: center;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
  padding-left: 20px;
}

.dropdown-item:hover i {
  color: var(--text-color);
  transform: scale(1.1);
}

/* Add arrow to dropdown */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 24px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--card-bg);
  filter: drop-shadow(0 -1px 1px var(--border-color));
}

/* User info styles */
.usuario {
  position: relative;
  cursor: pointer;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 30px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.usuario-info:hover {
  background-color: var(--hover-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.usuario-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.usuario-nome {
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.95rem;
}

.your-component {
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>