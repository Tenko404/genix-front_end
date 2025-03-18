<template>
  <div class="page-container">
    <div class="profile-container">
      <ProfileHeader :profilePhoto="profilePhoto" :userName="userName" @photo-uploaded="updateProfilePhoto" />

      <div class="profile-sections">
        <PersonalInfoSection
          :email="email"
          :emailEditingEnabled="emailEditingEnabled"
          @toggle-email-edit="toggleEmailEdit"
          @save-email="saveEmail"
          :currentPassword="currentPassword"
          :newPassword="newPassword"
          :confirmPassword="confirmPassword"
          :passwordEditingEnabled="passwordEditingEnabled"
          @start-password-edit="startPasswordEdit"
          @save-password="savePasswordChanges"
          @cancel-password-edit="cancelPasswordEdit"
        />

        <FavoriteGenresSection
          :favoriteGenres="favoriteGenres"
          :availableGenres="availableGenres"
          @genre-toggled="toggleGenre"
        />
      </div>
    </div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import ProfileHeader from '@/components/ProfileHeader.vue';
import PersonalInfoSection from '@/components/PersonalInfoSection.vue';
import FavoriteGenresSection from '@/components/FavoriteGenresSection.vue';

export default {
  name: 'UsuarioView',
  components: {
    ProfileHeader,
    PersonalInfoSection,
    FavoriteGenresSection
  },
  data() {
    return {
      profilePhoto: require('@/assets/elonmusk.jpg'),
      userName: 'Law',
      email: 'luis@email.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailEditingEnabled: false,
      passwordEditingEnabled: false,
      favoriteGenres: [],
      availableGenres: [
        'Ação',
        'Aventura',
        'Comédia',
        'Drama',
        'Ficção Científica',
        'Terror',
        'Romance',
        'Animação',
        'Documentário',
        'Suspense'
      ],
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    updateProfilePhoto(newPhoto) {
      this.profilePhoto = newPhoto;
      this.showSuccessMessage('Foto de perfil atualizada com sucesso!');
    },
    triggerPhotoUpload() {
      this.$refs.photoInput.click()
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profilePhoto = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    toggleEmailEdit() {
      this.emailEditingEnabled = !this.emailEditingEnabled
    },
    saveEmail(newEmail) {
      this.email = newEmail;
      this.emailEditingEnabled = false;
      this.showSuccessMessage('E-mail atualizado com sucesso!');
    },
    startPasswordEdit() {
      this.passwordEditingEnabled = true
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    // eslint-disable-next-line no-unused-vars
    savePasswordChanges({ currentPassword, newPassword, confirmPassword }) {
      if (newPassword === confirmPassword) {
        this.passwordEditingEnabled = false
        this.showSuccessMessage('Senha atualizada com sucesso!')
      } else {
        this.showErrorMessage('As senhas não coincidem!')
      }
    },
    cancelPasswordEdit() {
      this.passwordEditingEnabled = false
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    toggleGenre(genre) {
      const index = this.favoriteGenres.indexOf(genre)
      if (index === -1) {
        if (this.favoriteGenres.length < 5) {
          this.favoriteGenres.push(genre)
          this.showSuccessMessage('Gênero adicionado aos favoritos!')
        } else {
          this.showErrorMessage('Você pode selecionar no máximo 5 gêneros favoritos!')
        }
      } else {
        this.favoriteGenres.splice(index, 1)
        this.showSuccessMessage('Gênero removido dos favoritos!')
      }
    },
    showSuccessMessage(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },
    showErrorMessage(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--card-bg) 100%);
  color: var(--text-color);
  padding: 4rem 2rem;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(to bottom right, var(--primary-color) 0%, var(--header-bg) 100%);
  opacity: 0.1;
  z-index: 0;
}

.profile-container {
  width: 100%;
  max-width: 900px;
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  animation: fadeIn 0.5s ease;
  border: 1px solid var(--border-color);
}

.profile-sections {
  display: grid;
  gap: 2.5rem;
  margin-top: 2rem;
}

.success-message,
.error-message {
  position: fixed;
  bottom: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.success-message {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.success-message::before {
  content: '\f00c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.error-message {
  background: linear-gradient(135deg, #f44336, #e53935);
}

.error-message::before {
  content: '\f071';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 2rem 1rem;
  }

  .profile-container {
    padding: 2rem;
    border-radius: 16px;
  }

  .profile-sections {
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .success-message,
  .error-message {
    left: 1rem;
    right: 1rem;
    text-align: center;
    justify-content: center;
  }
}
</style>