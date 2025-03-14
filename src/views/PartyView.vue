<template>
    <div class="party-container">
        <div class="party-header">
            <h1>Party Mode</h1>
            <p>Assista a filmes com seus amigos!</p>
        </div>

        <!-- Party Creation/Joining Section -->
        <div class="party-actions" v-if="!inParty">
            <div class="action-card">
                <h2>Criar Party</h2>
                <p class="action-description">Crie uma nova party e convide seus amigos!</p>
                <button @click="createParty" class="action-button create" :disabled="creatingParty">
                    <i class="fas fa-spinner fa-spin" v-if="creatingParty"></i>
                    {{ creatingParty ? 'Criando...' : 'Criar Nova Party' }}
                </button>
            </div>
            <div class="action-card">
                <h2>Entrar em uma Party</h2>
                <p class="action-description">Entre em uma party existente usando o código!</p>
                <input 
                    v-model="partyCode" 
                    placeholder="Digite o código da party" 
                    class="party-input"
                    :disabled="joiningParty"
                />
                <button @click="joinParty" class="action-button join" :disabled="joiningParty || !partyCode">
                    <i class="fas fa-spinner fa-spin" v-if="joiningParty"></i>
                    {{ joiningParty ? 'Entrando...' : 'Entrar na Party' }}
                </button>
            </div>
        </div>

        <!-- Active Party Section -->
        <div class="active-party" v-if="inParty">
            <div class="party-info">
                <div class="party-header-info">
                    <h2>Código da Party: <span class="party-code">{{ currentPartyCode }}</span></h2>
                    <button @click="copyPartyCode" class="copy-button">
                        <i class="fas fa-copy"></i> Copiar Código
                    </button>
                </div>
                <p class="party-instructions">Compartilhe este código com seus amigos para entrarem!</p>
                
                <div class="party-status">
                    <div class="member-card">
                        <img :src="userPhoto" alt="Your photo" class="member-photo" />
                        <p>Você</p>
                        <div class="genres-list">
                            <span v-for="genre in userGenres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="member-card" v-if="partnerJoined">
                        <img :src="partnerPhoto" alt="Partner photo" class="member-photo" />
                        <p>{{ partnerName }}</p>
                        <div class="genres-list">
                            <span v-for="genre in partnerGenres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                    </div>
                    <div class="waiting-card" v-else>
                        <div class="spinner"></div>
                        <p>Aguardando parceiro entrar...</p>
                    </div>
                </div>
            </div>

            <!-- Movie Matching Section -->
            <div class="movie-matching" v-if="partnerJoined && !matchFound">
                <div class="movie-card" v-if="currentMovie">
                    <img :src="currentMovie.poster" alt="Movie poster" class="movie-poster" />
                    <div class="movie-info">
                        <h3>{{ currentMovie.title }}</h3>
                        <p>{{ currentMovie.description }}</p>
                        <div class="movie-genres">
                            <span v-for="genre in currentMovie.genres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                    </div>
                    <div class="swipe-actions">
                        <button @click="dislikeMovie" class="swipe-button dislike">
                            <i class="fas fa-times"></i>
                        </button>
                        <button @click="likeMovie" class="swipe-button like">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Match Found Section -->
            <div class="match-found" v-if="matchFound">
                <h2>É um Match! 🎉</h2>
                <div class="matched-movie">
                    <img :src="matchedMovie.poster" alt="Matched movie poster" class="matched-poster" />
                    <h3>{{ matchedMovie.title }}</h3>
                    <p>Vocês querem assistir este filme juntos!</p>
                    <button @click="startWatching" class="watch-button">Começar a Assistir</button>
                </div>
            </div>

            <button @click="leaveParty" class="leave-party-button">
                <i class="fas fa-sign-out-alt"></i> Sair da Party
            </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script>
import PartyService from '@/services/PartyService';
import MovieService from '@/services/MovieService';

export default {
    name: 'PartyView',
    data() {
        return {
            inParty: false,
            partyCode: '',
            currentPartyCode: '',
            partnerJoined: false,
            userPhoto: require('@/assets/elonmusk.jpg'),
            partnerPhoto: '',
            partnerName: '',
            userGenres: [],
            partnerGenres: [],
            currentMovie: null,
            matchFound: false,
            matchedMovie: null,
            partyId: null,
            userId: null,
            movies: [],
            creatingParty: false,
            joiningParty: false,
            error: null,
            selectedMovie: null
        }
    },
    methods: {
        async createParty() {
            try {
                this.creatingParty = true;
                this.error = null;
                
                // Get the selected movie from the query parameters if it exists
                const movieId = this.$route.query.movieId;
                if (movieId) {
                    this.selectedMovie = await MovieService.getMovieDetails(movieId);
                }

                const response = await PartyService.createParty(
                    this.userId,
                    this.userGenres,
                    this.selectedMovie
                );

                this.currentPartyCode = response.partyCode;
                this.partyId = response.partyId;
                this.inParty = true;
                this.initializeWebSocket();
            } catch (error) {
                this.error = 'Erro ao criar a party. Por favor, tente novamente.';
                console.error('Failed to create party:', error);
            } finally {
                this.creatingParty = false;
            }
        },

        async joinParty() {
            if (!this.partyCode) {
                this.error = 'Por favor, digite um código de party válido.';
                return;
            }

            try {
                this.joiningParty = true;
                this.error = null;

                const response = await PartyService.joinParty(
                    this.partyCode,
                    this.userId,
                    this.userGenres
                );

                this.currentPartyCode = this.partyCode;
                this.partyId = response.partyId;
                this.inParty = true;
                this.partnerJoined = true;
                this.partnerName = response.hostName;
                this.partnerPhoto = response.hostPhoto;
                this.partnerGenres = response.hostGenres;
                this.initializeWebSocket();
                this.loadMovies();
            } catch (error) {
                this.error = 'Erro ao entrar na party. Verifique o código e tente novamente.';
                console.error('Failed to join party:', error);
            } finally {
                this.joiningParty = false;
            }
        },

        async leaveParty() {
            try {
                await PartyService.leaveParty(this.partyId, this.userId);
                this.resetPartyState();
            } catch (error) {
                this.error = 'Erro ao sair da party. Por favor, tente novamente.';
                console.error('Error leaving party:', error);
            }
        },

        resetPartyState() {
            this.inParty = false;
            this.partyCode = '';
            this.currentPartyCode = '';
            this.partnerJoined = false;
            this.partnerPhoto = '';
            this.partnerName = '';
            this.partnerGenres = [];
            this.currentMovie = null;
            this.matchFound = false;
            this.matchedMovie = null;
            this.partyId = null;
            this.movies = [];
            this.error = null;
        },

        copyPartyCode() {
            navigator.clipboard.writeText(this.currentPartyCode)
                .then(() => {
                    // Show success message
                    this.$toast.success('Código copiado para a área de transferência!');
                })
                .catch(() => {
                    this.error = 'Erro ao copiar o código. Tente copiar manualmente.';
                });
        },

        async loadUserGenres() {
            // In a real app, this would come from your user profile/state
            this.userGenres = ['Action', 'Comedy', 'Sci-Fi'];
            this.userId = 'user123'; // This should come from your auth system
        },

        initializeWebSocket() {
            // Initialize WebSocket connection for real-time updates
            // This would handle partner joining, likes, matches, etc.
            // Implementation depends on your backend websocket setup
            console.log('WebSocket connection initialized for party:', this.partyId);
        },

        async loadMovies() {
            try {
                const movies = await MovieService.getRecommendedMovies(this.partyId);
                this.movies = movies;
                if (movies.length > 0) {
                    this.currentMovie = movies[0];
                }
            } catch (error) {
                console.error('Failed to load movies:', error);
                this.error = 'Erro ao carregar filmes recomendados.';
            }
        },

        async likeMovie() {
            try {
                await PartyService.likeMovie(this.partyId, this.userId, this.currentMovie.id);
                const matchResult = await PartyService.checkMatch(this.partyId, this.currentMovie.id);
                
                if (matchResult.isMatch) {
                    this.matchFound = true;
                    this.matchedMovie = this.currentMovie;
                } else {
                    this.loadNextMovie();
                }
            } catch (error) {
                console.error('Error liking movie:', error);
                this.error = 'Erro ao processar sua escolha. Tente novamente.';
            }
        },

        dislikeMovie() {
            this.loadNextMovie();
        },

        loadNextMovie() {
            const currentIndex = this.movies.findIndex(m => m.id === this.currentMovie.id);
            if (currentIndex < this.movies.length - 1) {
                this.currentMovie = this.movies[currentIndex + 1];
            } else {
                this.currentMovie = null; // No more movies to show
            }
        },

        startWatching() {
            this.$router.push(`/watch/${this.matchedMovie.id}`);
        }
    },
    created() {
        this.loadUserGenres();
    }
}
</script>

<style scoped>
.party-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.party-header {
    text-align: center;
    margin-bottom: 3rem;
}

.party-header h1 {
    font-size: 2.5rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
}

.party-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.action-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s;
    width: 100%;
    margin-top: 1rem;
}

.action-button.create {
    background: var(--primary-color);
    color: white;
}

.action-button.join {
    background: var(--secondary-color);
    color: white;
}

.party-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.party-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
}

.member-card {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    width: 250px;
}

.member-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    object-fit: cover;
}

.genres-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
}

.genre-tag {
    background: var(--tag-bg);
    color: var(--text-color);
    padding: 0.3rem 0.8rem;
    border-radius: 16px;
    font-size: 0.9rem;
}

.movie-card {
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
    max-width: 500px;
    margin: 2rem auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.movie-poster {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.movie-info {
    padding: 1.5rem;
}

.swipe-actions {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
}

.swipe-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: transform 0.2s;
}

.swipe-button.like {
    background: var(--success-color);
    color: white;
}

.swipe-button.dislike {
    background: var(--error-color);
    color: white;
}

.match-found {
    text-align: center;
    padding: 2rem;
}

.matched-poster {
    width: 200px;
    border-radius: 12px;
    margin: 1rem 0;
}

.watch-button {
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 1rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .party-actions {
        grid-template-columns: 1fr;
    }

    .party-status {
        flex-direction: column;
    }

    .member-card {
        width: 100%;
    }
}

.party-header-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.party-code {
    background: var(--card-bg);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 1.2rem;
}

.copy-button {
    background: var(--secondary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.action-description {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.leave-party-button {
    background: var(--error-color);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 2rem auto;
}

.error-message {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--error-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.fa-spinner {
    margin-right: 0.5rem;
}
</style>
