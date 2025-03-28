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
            this.$router.push(`/movie/${this.movie.id}`).then(() => {
                window.scrollTo(0, 0);
            });
        }
    }
}
</script>

<style scoped>
.movie-card {
    position: relative;
    flex: 0 0 200px;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.movie-card:active {
    transform: scale(0.98);
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Remove hover overlay and related styles */
.movie-overlay {
    display: none;
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
    min-height: 44px;
}

.details-button:hover {
    background: var(--primary-color-dark);
}

@media (max-width: 768px) {
    .movie-card {
        flex: 0 0 150px;
        height: 225px;
    }

    .movie-card:hover {
        transform: none;
    }

    .movie-info h3 {
        font-size: 0.9rem;
        margin-bottom: 0.3rem;
    }

    .movie-meta {
        font-size: 0.8rem;
        gap: 0.5rem;
    }

    .genre-tag {
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
    }

    .details-button {
        padding: 0.4rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .movie-card {
        flex: 0 0 140px;
        height: 210px;
    }

    .movie-info h3 {
        font-size: 0.8rem;
    }

    .movie-meta {
        font-size: 0.7rem;
    }

    .genre-tag {
        font-size: 0.6rem;
        padding: 0.1rem 0.3rem;
    }
}
</style> 