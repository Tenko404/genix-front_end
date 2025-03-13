<template>
    <div class="movie-card" @click="viewDetails">
        <div class="movie-poster">
            <img :src="movie.poster" :alt="movie.title">
            <div class="movie-overlay">
                <div class="movie-info">
                    <h3>{{ movie.title }}</h3>
                    <div class="movie-meta">
                        <span class="year">{{ movie.year }}</span>
                        <span class="rating">
                            <i class="fas fa-star"></i> {{ movie.rating }}
                        </span>
                    </div>
                    <div class="movie-genres">
                        <span v-for="genre in movie.genres.slice(0, 2)" :key="genre" class="genre-tag">
                            {{ genre }}
                        </span>
                    </div>
                    <button class="details-button">
                        <i class="fas fa-info-circle"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MovieCard',
    props: {
        movie: {
            type: Object,
            required: true
        }
    },
    methods: {
        viewDetails() {
            this.$router.push(`/movie/${this.movie.id}`);
        }
    }
}
</script>

<style scoped>
.movie-card {
    flex: 0 0 200px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.movie-card:hover {
    transform: scale(1.05);
}

.movie-poster {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.movie-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
    transform: scale(1.1);
}

.movie-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4));
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
}

.movie-card:hover .movie-overlay {
    opacity: 1;
}

.movie-info {
    color: white;
    width: 100%;
}

.movie-info h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
}

.movie-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.9;
}

.movie-genres {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.genre-tag {
    background: var(--primary-color);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

.details-button {
    width: 100%;
    padding: 0.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease;
}

.details-button:hover {
    background: var(--primary-color-dark);
}

@media (max-width: 768px) {
    .movie-card {
        flex: 0 0 150px;
    }

    .movie-poster {
        height: 225px;
    }

    .movie-info h3 {
        font-size: 1rem;
    }

    .movie-meta {
        font-size: 0.8rem;
    }

    .genre-tag {
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
    }

    .details-button {
        padding: 0.4rem;
        font-size: 0.9rem;
    }
}
</style> 