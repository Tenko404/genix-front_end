import axios from 'axios';

class PartyService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Create a new party
    async createParty(userId, userGenres, selectedMovie = null) {
        try {
            const response = await this.api.post('/party/create', {
                userId,
                userGenres,
                selectedMovie
            });
            return response.data;
        } catch (error) {
            console.error('Error creating party:', error);
            throw error;
        }
    }

    // Join an existing party
    async joinParty(partyCode, userId, userGenres) {
        try {
            const response = await this.api.post(`/party/join/${partyCode}`, {
                userId,
                userGenres
            });
            return response.data;
        } catch (error) {
            console.error('Error joining party:', error);
            throw error;
        }
    }

    // Get party status
    async getPartyStatus(partyId) {
        try {
            const response = await this.api.get(`/party/${partyId}/status`);
            return response.data;
        } catch (error) {
            console.error('Error getting party status:', error);
            throw error;
        }
    }

    // Leave party
    async leaveParty(partyId, userId) {
        try {
            const response = await this.api.post(`/party/${partyId}/leave`, { userId });
            return response.data;
        } catch (error) {
            console.error('Error leaving party:', error);
            throw error;
        }
    }

    // Get recommended movies based on matched genres
    async getRecommendedMovies(partyId) {
        try {
            const response = await this.api.get(`/party/${partyId}/movies`);
            return response.data;
        } catch (error) {
            console.error('Error getting recommended movies:', error);
            throw error;
        }
    }

    // Like a movie
    async likeMovie(partyId, userId, movieId) {
        try {
            const response = await this.api.post(`/party/${partyId}/like`, {
                userId,
                movieId
            });
            return response.data;
        } catch (error) {
            console.error('Error liking movie:', error);
            throw error;
        }
    }

    // Check for movie match
    async checkMatch(partyId, movieId) {
        try {
            const response = await this.api.get(`/party/${partyId}/match/${movieId}`);
            return response.data;
        } catch (error) {
            console.error('Error checking match:', error);
            throw error;
        }
    }
}

export default new PartyService(); 