import axios from 'axios';

const API_URL = 'http://localhost:3000';

class PartyService {
    // Cria uma nova party
    async createParty(hostId, hostGenres) {
        const response = await axios.post(`${API_URL}/parties`, {
            hostId,
            hostGenres,
            members: [hostId],
            movies: [],
            likes: {},
            createdAt: new Date().toISOString()
        });
        // Salva estado da party no localStorage
        localStorage.setItem('partyId', response.data.id);
        localStorage.setItem('partyRole', 'host');
        return response.data;
    }

    // Entra em uma party existente
    async joinParty(partyId, userId, userGenres) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        const party = partyRes.data;
        if (!party.members.includes(userId)) {
            party.members.push(userId);
            party[`genres_${userId}`] = userGenres;
            await axios.patch(`${API_URL}/parties/${partyId}`, {
                members: party.members,
                [`genres_${userId}`]: userGenres
            });
        }
        // Salva estado da party no localStorage
        localStorage.setItem('partyId', partyId);
        localStorage.setItem('partyRole', 'guest');
        return party;
    }

    // Sai da party
    async leaveParty(partyId, userId) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        const party = partyRes.data;
        party.members = party.members.filter(id => id !== userId);
        await axios.patch(`${API_URL}/parties/${partyId}`, { members: party.members });
        // Limpa estado da party no localStorage
        localStorage.removeItem('partyId');
        localStorage.removeItem('partyRole');
        return party;
    }

    // Compartilha filmes/gêneros entre membros
    async getPartyData(partyId) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        return partyRes.data;
    }

    // Adiciona filme à party
    async addMovieToParty(partyId, movie) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        const party = partyRes.data;
        party.movies.push(movie);
        await axios.patch(`${API_URL}/parties/${partyId}`, { movies: party.movies });
        return party;
    }

    // Like em filme
    async likeMovie(partyId, userId, movieId) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        const party = partyRes.data;
        if (!party.likes) party.likes = {};
        if (!party.likes[movieId]) party.likes[movieId] = [];
        if (!party.likes[movieId].includes(userId)) {
            party.likes[movieId].push(userId);
        }
        await axios.patch(`${API_URL}/parties/${partyId}`, { likes: party.likes });
        return party;
    }

    // Checa se houve match
    async checkMatch(partyId, movieId) {
        const partyRes = await axios.get(`${API_URL}/parties/${partyId}`);
        const party = partyRes.data;
        const members = party.members || [];
        const likes = party.likes && party.likes[movieId] ? party.likes[movieId] : [];
        return { isMatch: likes.length === members.length };
    }
}

export default new PartyService(); 