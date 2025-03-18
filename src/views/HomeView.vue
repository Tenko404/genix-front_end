<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Encontre o Filme Perfeito</h1>
        <p>Descubra novos filmes e organize sessões com amigos</p>
        <div class="search-container">
          <input 
            type="text"
            v-model="searchQuery" 
            @input="handleSearch"
            @keyup.enter="searchMovies"
            placeholder="Buscar filmes..." 
            class="search-input"
            aria-label="Campo de busca de filmes"
            autocomplete="off"
          />
          <button 
            @click="searchMovies" 
            class="search-button" 
            aria-label="Buscar"
            :disabled="loading"
          >
            <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i>
          </button>
        </div>
      </div>
    </section>

    <div class="content">
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando filmes...</p>
      </div>

      <div v-else-if="error" class="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>

      <template v-else>
        <div v-if="searchQuery && !trendingMovies.length" class="no-results">
          <i class="fas fa-search"></i>
          <p>Nenhum filme encontrado para "{{ searchQuery }}"</p>
        </div>

        <template v-else>
          <div v-if="featuredMovie" class="featured-movie">
            <div class="featured-content">
              <div class="featured-poster">
                <img :src="featuredMovie.poster" :alt="featuredMovie.title" />
              </div>
              <div class="featured-info">
                <h2>{{ featuredMovie.title }}</h2>
                <p class="movie-description">{{ featuredMovie.description }}</p>
                <div class="movie-meta">
                  <span>{{ featuredMovie.year }}</span>
                  <span>{{ featuredMovie.duration }}</span>
                  <span>
                    <i class="fas fa-star"></i> {{ featuredMovie.rating }}
                  </span>
                </div>
                <div class="featured-actions">
                  <button class="action-button party" @click="startParty(featuredMovie)">
                    <i class="fas fa-users"></i> Iniciar Party
                  </button>
                  <button class="action-button details" @click="viewDetails(featuredMovie)">
                    <i class="fas fa-info-circle"></i> Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <MovieCarousel 
            v-if="trendingMovies.length"
            title="Tendências" 
            :movies="trendingMovies" 
          />

          <MovieCarousel 
            v-if="!searchQuery && recommendedMovies.length"
            title="Recomendados" 
            :movies="recommendedMovies" 
          />

          <MovieCarousel 
            v-if="!searchQuery && newReleases.length"
            title="Lançamentos" 
            :movies="newReleases" 
          />

          <MovieCarousel 
            v-if="!searchQuery && topRatedMovies.length"
            title="Mais Bem Avaliados" 
            :movies="topRatedMovies" 
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import MovieCarousel from '@/components/MovieCarousel.vue';
import MovieService from '@/services/MovieService';

export default {
  name: 'HomeView',
  components: {
    MovieCarousel
  },
  data() {
    return {
      featuredMovie: null,
      trendingMovies: [],
      recommendedMovies: [],
      newReleases: [],
      topRatedMovies: [],
      searchQuery: '',
      loading: true,
      error: null,
      searchTimeout: null
    }
  },
  methods: {
    async loadMovies() {
      try {
        this.loading = true;
        this.error = null;

        // Load all movie categories in parallel
        const [
          featured,
          trending,
          recommended,
          newReleases,
          topRated
        ] = await Promise.all([
          MovieService.getFeaturedMovie(),
          MovieService.getTrendingMovies(),
          MovieService.getRecommendedMovies(),
          MovieService.getNewReleases(),
          MovieService.getTopRatedMovies()
        ]);

        this.featuredMovie = featured;
        this.trendingMovies = trending;
        this.recommendedMovies = recommended;
        this.newReleases = newReleases;
        this.topRatedMovies = topRated;
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        this.error = 'Erro ao carregar os filmes. Por favor, tente novamente.';
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // If search is empty, load default content
      if (!this.searchQuery.trim()) {
        this.loadMovies();
        return;
      }

      // Set loading state
      this.loading = true;

      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.searchMovies();
      }, 500);
    },
    async searchMovies() {
      if (!this.searchQuery.trim()) {
        this.loadMovies();
        return;
      }

      try {
        this.loading = true;
        this.error = null;
        const results = await MovieService.searchMovies(this.searchQuery);
        this.trendingMovies = results;
        this.featuredMovie = null;
        this.recommendedMovies = [];
        this.newReleases = [];
        this.topRatedMovies = [];
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        this.error = 'Erro ao buscar filmes. Por favor, tente novamente.';
      } finally {
        this.loading = false;
      }
    },
    startParty(movie) {
      this.$router.push({
        path: '/party',
        query: { movieId: movie.id }
      });
    },
    viewDetails(movie) {
      this.$router.push(`/movie/${movie.id}`).then(() => {
        window.scrollTo(0, 0);
      });
    }
  },
  created() {
    this.loadMovies();
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--bg-color);
}

.hero {
  height: 60vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 1rem;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
}

.hero-content {
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.content {
  padding: 2rem;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: var(--text-secondary);
}

.loading i, .error i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error i {
  color: var(--error-color);
}

.featured-movie {
  padding: 3rem;
  background: var(--card-bg);
  margin: 2rem 0;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

.featured-movie::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, rgba(var(--primary-rgb), 0.03), transparent);
  z-index: 0;
}

.featured-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.featured-poster {
  position: relative;
}

.featured-poster img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
  transform: perspective(800px) rotateY(5deg);
}

.featured-poster:hover img {
  transform: perspective(800px) rotateY(0);
}

.featured-info h2 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  letter-spacing: -0.05em;
  line-height: 1.1;
}

.movie-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 700px;
}

.movie-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.movie-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.movie-meta i {
  color: var(--primary-color);
}

.featured-actions {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.action-button.party {
  background: var(--primary-color);
  color: white;
}

.action-button.party:hover {
  background: var(--primary-color-dark);
}

.action-button.details {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(5px);
}

.action-button.details:hover {
  background: rgba(255, 255, 255, 0.2);
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: var(--text-secondary);
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  color: var(--text-color);
  -webkit-appearance: none;
  appearance: none;
}

.search-input:focus {
  outline: none;
}

.search-button {
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-button:hover:not(:disabled) {
  background: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .hero {
    height: 50vh;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .search-container {
    margin: 0 1rem;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.8rem;
  }

  .search-button {
    padding: 0.8rem 1.5rem;
  }

  .content {
    padding: 1rem;
  }

  .featured-movie {
    padding: 2rem 1rem;
    margin: 1rem 0;
  }

  .featured-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .featured-info h2 {
    font-size: 2rem;
  }

  .featured-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero {
    height: 40vh;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 0.9rem;
  }

  .featured-movie {
    padding: 1.5rem 1rem;
  }

  .featured-info h2 {
    font-size: 1.8rem;
  }

  .movie-description {
    font-size: 1rem;
  }

  .movie-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .search-container {
    margin: 0 0.5rem;
  }

  .search-input {
    padding: 0.7rem;
  }

  .search-button {
    padding: 0.7rem 1.2rem;
  }
}
</style>