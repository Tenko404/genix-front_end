import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export const userService = {
  async updateProfile(userData) {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  async updatePassword(passwordData) {
    try {
      const response = await axios.put(`${API_URL}/users/password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar senha');
    }
  },

  async updateFavoriteGenres(genres) {
    try {
      const response = await axios.put(`${API_URL}/users/favorite-genres`, { genres });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar gêneros favoritos');
    }
  },

  async getFavoriteMovies() {
    try {
      const response = await axios.get(`${API_URL}/users/favorite-movies`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar filmes favoritos');
    }
  },

  async addFavoriteMovie(movieId) {
    try {
      const response = await axios.post(`${API_URL}/users/favorite-movies`, { movieId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao adicionar filme aos favoritos');
    }
  },

  async removeFavoriteMovie(movieId) {
    try {
      const response = await axios.delete(`${API_URL}/users/favorite-movies/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao remover filme dos favoritos');
    }
  }
}; 