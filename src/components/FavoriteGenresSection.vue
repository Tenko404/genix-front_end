<template>
  <div class="profile-section">
    <h3>Gêneros Favoritos</h3>
    <p class="section-description">Selecione até 5 gêneros favoritos para personalizar suas recomendações</p>
    <div class="genres-grid">
      <div
        v-for="genre in availableGenres"
        :key="genre"
        :class="['genre-chip', { selected: favoriteGenres.includes(genre) }]"
        @click="$emit('genre-toggled', genre)"
      >
        <i :class="getGenreIcon(genre)"></i>
        <span>{{ genre }}</span>
      </div>
    </div>
    <div class="genres-counter">
      {{ favoriteGenres.length }}/5 gêneros selecionados
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoriteGenresSection',
  props: {
    favoriteGenres: {
      type: Array,
      required: true
    },
    availableGenres: {
      type: Array,
      required: true
    }
  },
  methods: {
    getGenreIcon(genre) {
      const icons = {
        'Ação': 'fas fa-fire',
        'Aventura': 'fas fa-compass',
        'Comédia': 'fas fa-laugh',
        'Drama': 'fas fa-theater-masks',
        'Ficção Científica': 'fas fa-rocket',
        'Terror': 'fas fa-ghost',
        'Romance': 'fas fa-heart',
        'Animação': 'fas fa-child',
        'Documentário': 'fas fa-film',
        'Suspense': 'fas fa-mask'
      }
      return icons[genre] || 'fas fa-film'
    }
  }
}
</script>

<style scoped>
.profile-section {
  background-color: var(--header-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.profile-section:hover {
  transform: translateY(-2px);
}

.profile-section h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: var(--text-color);
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

.profile-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #4CAF50, #45a049);
  border-radius: 3px;
}

.section-description {
  color: var(--secondary-text);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.genre-chip {
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--search-bg);
  color: var(--text-color);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-weight: 500;
}

.genre-chip i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.genre-chip:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
}

.genre-chip:hover i {
  transform: scale(1.2);
}

.genre-chip.selected {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.genre-chip.selected i {
  color: #4CAF50;
}

.genres-counter {
  text-align: center;
  color: var(--secondary-text);
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .profile-section {
    padding: 1.5rem;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.8rem;
  }

  .genre-chip {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}
</style> 