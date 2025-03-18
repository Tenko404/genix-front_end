<template>
    <div class="movie-view">
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Carregando detalhes do filme...</p>
        </div>
        <div v-else-if="error" class="error">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
        </div>
        <MovieDetails 
            v-else 
            :movie="movie"
            @start-party="startParty"
            @add-to-watchlist="addToWatchlist"
        />
    </div>
</template>

<script>
import MovieDetails from '@/components/MovieDetails.vue';
import MovieService from '@/services/MovieService';

export default {
    name: 'MovieView',
    components: {
        MovieDetails
    },
    data() {
        return {
            movie: null,
            loading: true,
            error: null
        }
    },
    methods: {
        async loadMovieDetails() {
            try {
                this.loading = true;
                this.error = null;
                const movieId = this.$route.params.id;
                this.movie = await MovieService.getMovieDetails(movieId);
            } catch (error) {
                this.error = 'Erro ao carregar detalhes do filme. Por favor, tente novamente.';
                console.error('Error loading movie:', error);
            } finally {
                this.loading = false;
            }
        },
        async startParty(movie) {
            // Navigate to party view with the selected movie
            this.$router.push({
                name: 'party',
                query: { movieId: movie.id }
            }).then(() => {
                window.scrollTo(0, 0);
            });
        },
        async addToWatchlist(movie) {
            try {
                // In a real app, you would get the userId from your auth system
                const userId = 'user123';
                await MovieService.addToWatchlist(userId, movie.id);
                // Show success message
                this.$toast.success('Filme adicionado à sua lista!');
            } catch (error) {
                console.error('Error adding to watchlist:', error);
                this.$toast.error('Erro ao adicionar à lista. Tente novamente.');
            }
        }
    },
    created() {
        this.loadMovieDetails();
    }
}
</script>

<style scoped>
.movie-view {
    min-height: 100vh;
    background: var(--bg-color);
}

.loading, .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
}

.error {
    color: var(--error-color);
}

.error i {
    font-size: 3rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style> 