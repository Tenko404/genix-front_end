import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.get(`${API_URL}/users?email=${encodeURIComponent(email)}`);
      const user = response.data[0];
      
      if (user && user.password === password) {
        // In a real app, we would handle tokens here
        return { success: true, user: { id: user.id, email: user.email, name: user.name } };
      }
      return { success: false, message: 'E-mail ou senha inválidos.' };
    } catch (error) {
      return { success: false, message: 'Erro durante o login.' };
    }
  },

  async register(userData) {
    try {
      // Check if user already exists
      const checkResponse = await axios.get(`${API_URL}/users?email=${encodeURIComponent(userData.email)}`);
      if (checkResponse.data.length > 0) {
        return { success: false, message: 'Este e-mail já está registrado. Faça login ou recupere sua senha.' };
      }

      // Create new user
      const response = await axios.post(`${API_URL}/users`, userData);
      return { 
        success: true, 
        user: { 
          id: response.data.id, 
          email: response.data.email, 
          name: response.data.name 
        } 
      };
    } catch (error) {
      return { success: false, message: 'Erro durante o registro.' };
    }
  }
}; 