import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const userService = {
  // Busca o perfil do usuário logado
  async getUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Usuário não autenticado');
    // Busca dados atualizados do fake API
    const response = await axios.get(`${API_URL}/users/${user.id}`);
    // Atualiza localStorage com dados mais recentes
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Atualiza nome, email e/ou foto
  async updateProfile({ id, name, email, photo }) {
    // Verifica se o novo email já existe (exceto para o próprio usuário)
    const check = await axios.get(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    if (check.data.length > 0 && check.data[0].id !== id) {
      throw new Error('Este e-mail já está registrado em outra conta.');
    }
    const response = await axios.patch(`${API_URL}/users/${id}`, { name, email, photo });
    // Atualiza localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Upload de foto de perfil (salva base64 ou url no campo photo)
  async uploadProfilePhoto(id, photoData) {
    const response = await axios.patch(`${API_URL}/users/${id}`, { photo: photoData });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data.photo;
  },

  // Atualiza senha
  async updatePassword({ id, password }) {
    const response = await axios.patch(`${API_URL}/users/${id}`, { password });
    return response.data;
  },

  // Atualiza gêneros favoritos (salva no JSON Server e localStorage)
  async updateGenres(genres) {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.patch(`${API_URL}/users/${user.id}`, { favoriteGenres: genres });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Busca gêneros favoritos
  async getFavoriteGenres() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.favoriteGenres || [];
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