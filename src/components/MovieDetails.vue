<template>
    <div class="movie-details">
        <div class="movie-header">
            <img :src="movie.poster" :alt="movie.title" class="movie-poster" />
            <div class="movie-info">
                <h1>{{ movie.title }}</h1>
                <div class="movie-meta">
                    <span class="year">{{ movie.year }}</span>
                    <span class="rating">
                        <i class="fas fa-star"></i> {{ movie.rating }}/10
                    </span>
                    <span class="duration">{{ movie.duration }}</span>
                </div>
                <div class="genres">
                    <span v-for="genre in movie.genres" :key="genre" class="genre-tag">
                        {{ genre }}
                    </span>
                </div>
            </div>
        </div>

        <div class="movie-content">
            <div class="section">
                <h2>Sinopse</h2>
                <p>{{ movie.description }}</p>
            </div>

            <div class="section">
                <h2>Detalhes</h2>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="label">Diretor</span>
                        <span class="value">{{ movie.director }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Elenco Principal</span>
                        <span class="value">{{ movie.cast.join(', ') }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">País</span>
                        <span class="value">{{ movie.country }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Idioma</span>
                        <span class="value">{{ movie.language }}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Onde Assistir</h2>
                <div class="streaming-options">
                    <div v-for="service in movie.streamingServices" 
                         :key="service.name" 
                         class="streaming-service">
                        <img :src="service.logo" :alt="service.name" />
                        <span>{{ service.name }}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Avaliações</h2>
                <div class="reviews">
                    <div v-for="review in movie.reviews" :key="review.id" class="review">
                        <div class="review-header">
                            <img :src="review.userAvatar" :alt="review.userName" class="reviewer-avatar" />
                            <div class="reviewer-info">
                                <span class="reviewer-name">{{ review.userName }}</span>
                                <div class="review-rating">
                                    <i class="fas fa-star" v-for="n in review.rating" :key="n"></i>
                                </div>
                            </div>
                        </div>
                        <p class="review-text">{{ review.text }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <button @click="startParty" class="party-button">
                <i class="fas fa-users"></i> Assistir em Grupo
            </button>
            <button @click="addToWatchlist" class="watchlist-button">
                <i class="fas fa-plus"></i> Adicionar à Lista
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MovieDetails',
    props: {
        movie: {
            type: Object,
            required: true
        }
    },
    methods: {
        startParty() {
            this.$emit('start-party', this.movie);
        },
        addToWatchlist() {
            this.$emit('add-to-watchlist', this.movie);
        }
    }
}
</script>

<style scoped>
.movie-details {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: var(--text-color);
}

.movie-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
}

.movie-poster {
    width: 300px;
    height: 450px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.movie-info {
    flex: 1;
}

.movie-info h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.movie-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-secondary);
}

.genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.genre-tag {
    background: var(--tag-bg);
    padding: 0.3rem 0.8rem;
    border-radius: 16px;
    font-size: 0.9rem;
}

.section {
    margin-bottom: 3rem;
}

.section h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.label {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.streaming-options {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.streaming-service {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--card-bg);
    border-radius: 8px;
}

.streaming-service img {
    width: 24px;
    height: 24px;
}

.reviews {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.review {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 12px;
}

.review-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.reviewer-info {
    display: flex;
    flex-direction: column;
}

.reviewer-name {
    font-weight: 500;
}

.review-rating {
    color: #ffd700;
}

.review-text {
    color: var(--text-secondary);
    line-height: 1.6;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.party-button, .watchlist-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s;
}

.party-button {
    background: var(--primary-color);
    color: white;
}

.watchlist-button {
    background: var(--secondary-color);
    color: white;
}

.party-button:hover, .watchlist-button:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .movie-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .movie-poster {
        width: 100%;
        max-width: 300px;
    }

    .movie-meta {
        justify-content: center;
    }

    .genres {
        justify-content: center;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style> 