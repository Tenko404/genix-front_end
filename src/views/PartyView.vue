<template>
    <div class="party-container">
        <div class="party-header">
            <p>Assista a filmes com seus amigos baseado em seus gostos!</p>
        </div>

        <!-- Party Creation/Joining Section -->
        <div class="party-actions" v-if="!inParty">
            <div class="action-card">
                <h2>Criar Party</h2>
                <p class="action-description">Crie uma nova party e descubra filmes que você e seus amigos querem assistir juntos através do modo Tinder!</p>
                <button @click="createParty" class="action-button create" :disabled="creatingParty">
                    <i class="fas fa-spinner fa-spin" v-if="creatingParty"></i>
                    <i class="fas fa-plus" v-else></i>
                    {{ creatingParty ? 'Criando...' : 'Criar Nova Party' }}
                </button>
            </div>
            <div class="action-card">
                <h2>Entrar em uma Party</h2>
                <p class="action-description">Entre em uma party existente e descubra filmes que combinam com seus amigos!</p>
                <div class="party-code-input">
                    <input 
                        v-model="partyCode" 
                        placeholder="Digite o código da party" 
                        class="party-input"
                        :disabled="joiningParty"
                        @keyup.enter="joinParty"
                    />
                    <button @click="joinParty" class="action-button join" :disabled="joiningParty || !partyCode">
                        <i class="fas fa-spinner fa-spin" v-if="joiningParty"></i>
                        <i class="fas fa-sign-in-alt" v-else></i>
                        {{ joiningParty ? 'Entrando...' : 'Entrar na Party' }}
                    </button>
                </div>
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
                <p class="party-instructions">Compartilhe este código com seus amigos para entrarem na party!</p>
                
                <div class="party-status">
                    <div class="member-card" :class="{ 'host': isHost }">
                        <div class="member-status">Host</div>
                        <img :src="userPhoto" alt="Your photo" class="member-photo" />
                        <p class="member-name">Você</p>
                        <div class="genres-list">
                            <span v-for="genre in userGenres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="member-card" v-if="partnerJoined">
                        <img :src="partnerPhoto" alt="Partner photo" class="member-photo" />
                        <p class="member-name">{{ partnerName }}</p>
                        <div class="genres-list">
                            <span v-for="genre in partnerGenres" :key="genre" class="genre-tag">
                                {{ genre }}
                            </span>
                        </div>
                    </div>
                    <div class="waiting-card" v-else>
                        <div class="spinner"></div>
                        <p>Aguardando parceiro entrar na party...</p>
                    </div>
                </div>
            </div>

            <!-- Movie Matching Section -->
            <div class="movie-matching" v-if="partnerJoined && !matchFound">
                <div class="movies-grid">
                    <div v-for="movie in movies" :key="movie.id" class="movie-card" :class="{ 'active': movie.id === currentMovie?.id }">
                        <div class="movie-poster-container">
                            <img :src="movie.poster" :alt="movie.title" class="movie-poster" />
                            <div class="movie-rating">
                                <i class="fas fa-star"></i>
                                {{ movie.rating }}
                            </div>
                        </div>
                        <div class="movie-info">
                            <h3>{{ movie.title }}</h3>
                            <div class="movie-meta">
                                <span><i class="fas fa-calendar"></i> {{ movie.year }}</span>
                                <span><i class="fas fa-clock"></i> {{ movie.duration }}</span>
                            </div>
                        </div>
                        <div class="swipe-actions" v-if="movie.id === currentMovie?.id">
                            <button @click="dislikeMovie" class="swipe-button dislike" title="Não gostei">
                                <i class="fas fa-times"></i>
                            </button>
                            <button @click="likeMovie" class="swipe-button like" title="Gostei">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="no-more-movies" v-if="movies.length === 0">
                    <i class="fas fa-film"></i>
                    <h3>Não há mais filmes para mostrar</h3>
                    <p>Aguarde enquanto buscamos mais opções...</p>
                </div>
            </div>

            <!-- Match Found Section -->
            <div class="match-found" v-if="matchFound">
                <h2>🎉 É um Match! 🎉</h2>
                <div class="liked-movies-grid">
                    <div v-for="movie in matchHistory" :key="movie.id" class="liked-movie-card">
                        <img :src="movie.poster" :alt="movie.title" />
                        <div class="liked-movie-info">
                            <h3>{{ movie.title }}</h3>
                            <div class="movie-meta">
                                <span>{{ movie.year }}</span>
                                <span>
                                    <i class="fas fa-star"></i> {{ movie.rating }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="match-actions">
                    <button @click="startWatching" class="watch-button">
                        <i class="fas fa-play"></i> Começar a Assistir
                    </button>
                    <button @click="continueMatching" class="continue-button">
                        <i class="fas fa-sync"></i> Continuar Procurando
                    </button>
                </div>
            </div>

            <button @click="leaveParty" class="leave-party-button">
                <i class="fas fa-sign-out-alt"></i> Sair da Party
            </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
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
            selectedMovie: null,
            isHost: false,
            matchHistory: [],
            likedMovies: new Set(),
            dislikedMovies: new Set()
        }
    },
    methods: {
        async createParty() {
            try {
                this.creatingParty = true;
                this.error = null;
                
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
                this.isHost = true;
                this.initializeWebSocket();
                this.$toast.success('Party criada com sucesso!');
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
                this.$toast.success('Você entrou na party!');
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
                this.$toast.info('Você saiu da party');
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
            this.isHost = false;
            this.matchHistory = [];
            this.likedMovies.clear();
            this.dislikedMovies.clear();
        },

        copyPartyCode() {
            navigator.clipboard.writeText(this.currentPartyCode)
                .then(() => {
                    this.$toast.success('Código copiado para a área de transferência!');
                })
                .catch(() => {
                    this.error = 'Erro ao copiar o código. Tente copiar manualmente.';
                });
        },

        async loadUserGenres() {
            // In a real app, this would come from your user profile/state
            this.userGenres = ['Ação', 'Comédia', 'Ficção Científica'];
            this.userId = 'user123'; // This should come from your auth system
        },

        initializeWebSocket() {
            // Initialize WebSocket connection for real-time updates
            console.log('WebSocket connection initialized for party:', this.partyId);
        },

        async loadMovies() {
            try {
                const movies = await MovieService.getRecommendedMovies(this.partyId);
                this.movies = movies.filter(movie => 
                    !this.likedMovies.has(movie.id) && 
                    !this.dislikedMovies.has(movie.id)
                );
                if (this.movies.length > 0) {
                    this.currentMovie = this.movies[0];
                }
            } catch (error) {
                console.error('Failed to load movies:', error);
                this.error = 'Erro ao carregar filmes recomendados.';
            }
        },

        async likeMovie() {
            try {
                this.likedMovies.add(this.currentMovie.id);
                await PartyService.likeMovie(this.partyId, this.userId, this.currentMovie.id);
                const matchResult = await PartyService.checkMatch(this.partyId, this.currentMovie.id);
                
                if (matchResult.isMatch) {
                    this.matchFound = true;
                    this.matchedMovie = this.currentMovie;
                    this.matchHistory.push(this.currentMovie);
                } else {
                    this.loadNextMovie();
                }
            } catch (error) {
                console.error('Error liking movie:', error);
                this.error = 'Erro ao processar sua escolha. Tente novamente.';
            }
        },

        dislikeMovie() {
            this.dislikedMovies.add(this.currentMovie.id);
            this.loadNextMovie();
        },

        loadNextMovie() {
            const currentIndex = this.movies.findIndex(m => m.id === this.currentMovie.id);
            if (currentIndex < this.movies.length - 1) {
                this.currentMovie = this.movies[currentIndex + 1];
            } else {
                this.currentMovie = null;
                this.loadMovies(); // Try to load more movies
            }
        },

        startWatching() {
            this.$router.push(`/watch/${this.matchedMovie.id}`);
        },

        continueMatching() {
            this.matchFound = false;
            this.matchedMovie = null;
            this.loadMovies();
        },

        handleWebSocketMessage(message) {
            switch (message.type) {
                case 'PARTNER_JOINED':
                    this.handlePartnerJoined(message.data);
                    break;
                case 'PARTNER_LEFT':
                    this.handlePartnerLeft();
                    break;
                case 'MOVIE_LIKED':
                    this.handleMovieLiked(message.data);
                    break;
                case 'MATCH_FOUND':
                    this.handleMatchFound(message.data);
                    break;
            }
        },

        handlePartnerJoined(data) {
            this.partnerJoined = true;
            this.partnerName = data.name;
            this.partnerPhoto = data.photo;
            this.partnerGenres = data.genres;
            this.$toast.success(`${this.partnerName} entrou na party!`);
        },

        handlePartnerLeft() {
            this.partnerJoined = false;
            this.partnerName = '';
            this.partnerPhoto = '';
            this.partnerGenres = [];
            this.$toast.warning('Seu parceiro saiu da party');
        },

        handleMovieLiked(data) {
            if (data.userId !== this.userId) {
                this.$toast.info(`${this.partnerName} gostou de um filme!`);
            }
        },

        handleMatchFound(data) {
            this.matchFound = true;
            this.matchedMovie = data.movie;
            this.matchHistory.push(data.movie);
            this.$toast.success('Match encontrado! 🎉');
        }
    },
    created() {
        this.loadUserGenres();
    },
    beforeUnmount() {
        // Cleanup WebSocket connection if needed
    }
}
</script>

<style scoped>
.party-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-light) 100%);
}

.party-header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeInDown 0.8s ease-out;
}

.party-header h1 {
    font-size: 3rem;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
}

.party-header p {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

.party-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem auto;
    max-width: 900px;
    animation: fadeInUp 0.8s ease-out;
}

.action-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.action-card h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.action-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.action-button.create {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
}

.action-button.join {
    background: linear-gradient(45deg, var(--secondary-color), var(--accent-color));
    color: white;
}

.action-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.party-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-color);
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.party-input:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
}

.party-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
    animation: fadeIn 0.8s ease-out;
}

.member-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    transition: transform 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.member-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    padding: 3px;
    background: var(--background-dark);
}

.genres-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
}

.genre-tag {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.movie-matching {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.movies-grid {
    display: flex;
    flex-wrap: nowrap;
    gap: 2rem;
    padding: 1rem;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}

.movie-card {
    flex: 0 0 300px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.8s ease-out;
    display: flex;
    flex-direction: column;
    opacity: 0.7;
    transition: all 0.3s ease;
}

.movie-card.active {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.movie-poster-container {
    position: relative;
    overflow: hidden;
    height: 350px;
    width: 100%;
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.movie-info {
    padding: 1.5rem;
    flex: 1;
}

.movie-info h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.swipe-actions {
    padding: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.1);
}

.swipe-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.8rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.swipe-button.like {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: white;
}

.swipe-button.dislike {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: white;
}

.swipe-button:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.match-found {
    text-align: center;
    padding: 3rem;
    animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.match-found h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.liked-movies-grid {
    display: flex;
    flex-wrap: nowrap;
    gap: 2rem;
    margin: 2rem 0;
    width: 100%;
    overflow-x: auto;
    padding: 1rem;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}

.liked-movie-card {
    flex: 0 0 300px;
    background: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.liked-movie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.liked-movie-card img {
    width: 100%;
    height: 280px;
    object-fit: cover;
}

.liked-movie-info {
    padding: 1rem;
    background: linear-gradient(to top, var(--card-bg), rgba(0, 0, 0, 0.8));
}

.liked-movie-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: white;
    font-weight: 600;
}

.match-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
}

.watch-button {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1.5rem;
    transition: all 0.3s ease;
}

.watch-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.error-message {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 0.9;
        transform: scale(1.1);
    }
    80% {
        opacity: 1;
        transform: scale(0.89);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@media (max-width: 768px) {
    .party-container {
        padding: 1rem;
    }

    .party-header h1 {
        font-size: 2rem;
    }

    .party-actions {
        grid-template-columns: 1fr;
    }

    .member-card {
        padding: 1.5rem;
    }

    .movie-card {
        margin: 1rem;
    }

    .movie-poster {
        height: 300px;
    }

    .swipe-button {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }
}

.vs-divider {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.vs-divider::before,
.vs-divider::after {
    content: '';
    height: 2px;
    width: 50px;
    background: linear-gradient(90deg, transparent, var(--text-color), transparent);
    margin: 0 1rem;
}

.waiting-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.selected-movie {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-movie-poster {
    width: 120px;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.party-code-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1.5rem;
}

.member-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.member-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0.5rem 0;
}

.movie-rating {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: #ffd700;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    backdrop-filter: blur(5px);
    z-index: 2;
}

.movie-meta {
    display: flex;
    gap: 1.5rem;
    margin: 1rem 0;
    color: var(--text-secondary);
}

.movie-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.movie-description {
    line-height: 1.6;
    margin: 1rem 0;
    color: var(--text-color);
}

.movie-cast {
    margin-top: 1.5rem;
}

.movie-cast h4 {
    margin-bottom: 1rem;
    color: var(--text-color);
}

.cast-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.cast-member {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.cast-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
    border: 2px solid var(--primary-color);
}

.cast-name {
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.2rem;
}

.cast-character {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.no-more-movies {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.no-more-movies i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.continue-button {
    background: linear-gradient(45deg, var(--secondary-color), var(--accent-color));
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.continue-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .cast-list {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .cast-photo {
        width: 60px;
        height: 60px;
    }

    .movie-meta {
        flex-direction: column;
        gap: 0.5rem;
    }

    .match-actions {
        flex-direction: column;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

/* Add custom scrollbar styling */
.movies-grid::-webkit-scrollbar {
    height: 8px;
}

.movies-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.movies-grid::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
}

.movies-grid::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
}

/* Add custom scrollbar styling for liked-movies-grid */
.liked-movies-grid::-webkit-scrollbar {
    height: 8px;
}

.liked-movies-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.liked-movies-grid::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
}

.liked-movies-grid::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
}
</style>
