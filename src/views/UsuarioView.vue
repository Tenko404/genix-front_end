<template>
  <div class="usuario-view">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay" role="status">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Carregando seu perfil...</p>
    </div>

    <main id="main-content" class="profile-content" :class="{ 'is-loading': isLoading }">
      <!-- Profile Header -->
      <ProfileHeader
        :user="user"
        :watched-movies="watchedMovies"
        :total-reviews="totalReviews"
        :total-lists="totalLists"
        :member-since="memberSince"
        :last-active="lastActive"
        :is-loading="isSaving"
        @photo-upload="handlePhotoUpload"
        @error="handleError"
      />

      <div class="profile-grid">
        <!-- Account Section -->
        <div class="profile-section">
          <div class="section-header">
            <h3>
              <i class="fas fa-user"></i>
              Conta
            </h3>
            <p class="section-description">Gerencie suas informações pessoais</p>
          </div>
          <PersonalInfoSection
            :email="user.email"
            :email-editing-enabled="emailEditingEnabled"
            :current-password="currentPassword"
            :new-password="newPassword"
            :confirm-password="confirmPassword"
            :password-editing-enabled="passwordEditingEnabled"
            :is-loading="isSaving"
            @save-email="handleEmailSave"
            @save-password="handlePasswordSave"
            @toggle-email-edit="toggleEmailEdit"
            @start-password-edit="startPasswordEdit"
            @cancel-password-edit="cancelPasswordEdit"
            @error="handleError"
          />
        </div>

        <!-- Preferences Section -->
        <div class="preferences-section">
          <div class="section-header">
            <h3>
              <i class="fas fa-cog"></i>
              Preferências
            </h3>
            <p class="section-description">Personalize sua experiência no Genix</p>
          </div>

          <div class="preferences-grid">
            <!-- Theme Preference -->
            <div class="preference-item">
              <div class="preference-header">
                <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
                <h4>{{ isDarkMode ? 'Modo Escuro' : 'Modo Claro' }}</h4>
              </div>
              <p class="preference-description">
                {{ isDarkMode ? 'Desative o tema escuro para uma experiência mais clara' : 'Ative o tema escuro para uma experiência mais confortável' }}
              </p>
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="dark-mode"
                  v-model="isDarkMode"
                  @change="handleDarkModeToggle"
                  role="switch"
                  :aria-label="isDarkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'"
                  :disabled="isSaving"
                />
                <label for="dark-mode" class="toggle-slider">
                  <span class="sr-only">{{ isDarkMode ? 'Desativar modo escuro' : 'Ativar modo escuro' }}</span>
                </label>
              </div>
            </div>

            <!-- Notifications Preference -->
            <div class="preference-item">
              <div class="preference-header">
                <i class="fas fa-bell"></i>
                <h4>Notificações</h4>
              </div>
              <p class="preference-description">Receba atualizações sobre seus filmes favoritos</p>
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="notifications"
                  v-model="notifications"
                  @change="handleNotificationToggle"
                  role="switch"
                  :aria-label="notifications ? 'Desativar notificações' : 'Ativar notificações'"
                  :disabled="isSaving"
                />
                <label for="notifications" class="toggle-slider">
                  <span class="sr-only">{{ notifications ? 'Desativar notificações' : 'Ativar notificações' }}</span>
                </label>
              </div>
            </div>

            <!-- Language Preference -->
            <div class="preference-item">
              <div class="preference-header">
                <i class="fas fa-globe"></i>
                <h4>Idioma</h4>
              </div>
              <p class="preference-description">Escolha o idioma da interface</p>
              <select
                v-model="language"
                @change="handleLanguageChange"
                class="language-select"
                aria-label="Selecionar idioma"
                :disabled="isSaving"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Genres Section -->
        <div class="genres-section">
          <div class="section-header">
            <h3>
              <i class="fas fa-film"></i>
              Gêneros Favoritos
            </h3>
            <p class="section-description">Escolha seus gêneros de filmes preferidos</p>
          </div>
          <FavoriteGenresSection
            :available-genres="availableGenres"
            :favorite-genres="selectedGenres"
            :is-loading="isSaving"
            @genre-toggled="handleGenreToggle"
          />
        </div>

        <!-- Account Actions Section -->
        <div class="account-actions-section">
          <div class="section-header">
            <h3>
              <i class="fas fa-shield-alt"></i>
              Ações da Conta
            </h3>
            <p class="section-description">Gerencie sua conta Genix</p>
          </div>
          
          <div class="account-actions-grid">
            <div class="action-item logout-section">
              <div class="action-header">
                <i class="fas fa-sign-out-alt"></i>
                <h4>Sair da Conta</h4>
              </div>
              <p class="action-description">Fazer logout da sua conta Genix</p>
              <button 
                class="logout-button" 
                @click="handleLogout"
                :disabled="isSaving"
              >
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Success Message -->
    <transition name="fade">
      <div 
        v-if="showSuccessMessage" 
        class="success-message"
        role="alert"
      >
        <i class="fas fa-check-circle"></i>
        <span>{{ successMessage }}</span>
      </div>
    </transition>

    <!-- Error Message -->
    <transition name="fade">
      <div 
        v-if="showErrorMessage" 
        class="error-message"
        role="alert"
      >
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import ProfileHeader from '@/components/ProfileHeader.vue'
import PersonalInfoSection from '@/components/PersonalInfoSection.vue'
import FavoriteGenresSection from '@/components/FavoriteGenresSection.vue'
import { userService } from '@/services/userService'
import { useThemeStore } from '@/stores/themeStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'UsuarioView',
  components: {
    ProfileHeader,
    PersonalInfoSection,
    FavoriteGenresSection
  },
  setup() {
    const themeStore = useThemeStore()
    const { isDarkMode } = storeToRefs(themeStore)
    return { themeStore, isDarkMode }
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        photo: null
      },
      watchedMovies: 0,
      totalReviews: 0,
      totalLists: 0,
      memberSince: '',
      lastActive: '',
      emailEditingEnabled: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordEditingEnabled: false,
      selectedGenres: [],
      availableGenres: [
        { id: 1, name: 'Ação' },
        { id: 2, name: 'Aventura' },
        { id: 3, name: 'Comédia' },
        { id: 4, name: 'Drama' },
        { id: 5, name: 'Ficção Científica' },
        { id: 6, name: 'Terror' },
        { id: 7, name: 'Romance' },
        { id: 8, name: 'Animação' },
        { id: 9, name: 'Documentário' },
        { id: 10, name: 'Suspense' },
        { id: 11, name: 'Crime' },
        { id: 12, name: 'Família' },
        { id: 13, name: 'Fantasia' },
        { id: 14, name: 'História' },
        { id: 15, name: 'Música' },
        { id: 16, name: 'Mistério' },
        { id: 17, name: 'Guerra' },
        { id: 18, name: 'Western' }
      ],
      notifications: true,
      language: 'pt-BR',
      isLoading: true,
      isSaving: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  async created() {
    try {
      await this.fetchUserData()
      this.isLoading = false
      this.initializePreferences()
    } catch (error) {
      this.handleError('Erro ao carregar dados do usuário')
      this.isLoading = false
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const userData = await userService.getUserProfile()
        this.user = userData.user
        this.watchedMovies = userData.stats.watchedMovies
        this.totalReviews = userData.stats.totalReviews
        this.totalLists = userData.stats.totalLists
        this.memberSince = userData.memberSince
        this.lastActive = userData.lastActive
        this.selectedGenres = userData.preferences.selectedGenres || []
      } catch (error) {
        throw new Error('Falha ao carregar dados do usuário')
      }
    },
    initializePreferences() {
      this.notifications = localStorage.getItem('notifications') !== 'false'
      this.language = localStorage.getItem('language') || 'pt-BR'
    },
    async handlePhotoUpload(file) {
      try {
        this.isSaving = true
        const photoUrl = await userService.uploadProfilePhoto(file)
        this.user.photo = photoUrl
        this.showSuccess('Foto de perfil atualizada com sucesso!')
      } catch (error) {
        this.handleError('Erro ao atualizar foto de perfil')
      } finally {
        this.isSaving = false
      }
    },
    async handleEmailSave(email) {
      try {
        this.isSaving = true
        await userService.updateEmail(email)
        this.user.email = email
        this.emailEditingEnabled = false
        this.showSuccess('E-mail atualizado com sucesso!')
      } catch (error) {
        this.handleError('Erro ao atualizar e-mail')
      } finally {
        this.isSaving = false
      }
    },
    async handlePasswordSave({ currentPassword, newPassword }) {
      try {
        this.isSaving = true
        await userService.updatePassword(currentPassword, newPassword)
        this.currentPassword = currentPassword
        this.newPassword = newPassword
        this.passwordEditingEnabled = false
        this.showSuccess('Senha atualizada com sucesso!')
      } catch (error) {
        this.handleError('Erro ao atualizar senha')
      } finally {
        this.isSaving = false
      }
    },
    async handleGenreToggle(genreId) {
      try {
        const index = this.selectedGenres.indexOf(genreId)
        let newGenres = [...this.selectedGenres]

        if (index === -1) {
          // Adding a genre
          if (newGenres.length < 5) {
            newGenres.push(genreId)
            this.isSaving = true
            await userService.updateGenres(newGenres)
            this.selectedGenres = newGenres
            this.showSuccess('Gênero adicionado com sucesso!')
          } else {
            this.handleError('Você já selecionou o máximo de 5 gêneros')
            return
          }
        } else {
          // Removing a genre
          newGenres = newGenres.filter(id => id !== genreId)
          this.isSaving = true
          await userService.updateGenres(newGenres)
          this.selectedGenres = newGenres
          this.showSuccess('Gênero removido com sucesso!')
        }
      } catch (error) {
        this.handleError('Erro ao atualizar preferências de gêneros')
      } finally {
        this.isSaving = false
      }
    },
    toggleEmailEdit() {
      this.emailEditingEnabled = !this.emailEditingEnabled
    },
    startPasswordEdit() {
      this.passwordEditingEnabled = true
    },
    cancelPasswordEdit() {
      this.passwordEditingEnabled = false
      this.newPassword = ''
      this.confirmPassword = ''
    },
    async handleDarkModeToggle() {
      try {
        this.isSaving = true
        await userService.updatePreferences({ darkMode: this.isDarkMode })
        this.themeStore.setTheme(this.isDarkMode)
        this.showSuccess('Tema atualizado com sucesso!')
      } catch (error) {
        this.handleError('Erro ao atualizar tema')
        this.isDarkMode = !this.isDarkMode
      } finally {
        this.isSaving = false
      }
    },
    async handleNotificationToggle() {
      try {
        this.isSaving = true
        await userService.updatePreferences({ notifications: this.notifications })
        localStorage.setItem('notifications', this.notifications)
        this.showSuccess('Preferências de notificação atualizadas!')
      } catch (error) {
        this.handleError('Erro ao atualizar preferências de notificação')
        this.notifications = !this.notifications
      } finally {
        this.isSaving = false
      }
    },
    async handleLanguageChange() {
      try {
        this.isSaving = true
        await userService.updatePreferences({ language: this.language })
        localStorage.setItem('language', this.language)
        this.showSuccess('Idioma atualizado com sucesso!')
      } catch (error) {
        this.handleError('Erro ao atualizar idioma')
        this.language = localStorage.getItem('language') || 'pt-BR'
      } finally {
        this.isSaving = false
      }
    },
    async handleLogout() {
      try {
        this.isSaving = true
        await userService.logout()
        this.$router.push('/login')
      } catch (error) {
        this.handleError('Erro ao fazer logout')
      } finally {
        this.isSaving = false
      }
    },
    showSuccess(message) {
      this.successMessage = message
      this.showSuccessMessage = true
      setTimeout(() => {
        this.showSuccessMessage = false
      }, 3000)
    },
    handleError(message) {
      this.errorMessage = message
      this.showErrorMessage = true
      setTimeout(() => {
        this.showErrorMessage = false
      }, 5000)
    }
  }
}
</script>

<style scoped>
.usuario-view {
  padding: 2rem;
  min-height: 100vh;
  background: var(--bg-color);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  transition: opacity 0.3s ease;
}

.profile-content.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem auto;
}

.profile-section,
.preferences-section,
.genres-section,
.account-actions-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-header {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.section-header h3 {
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--text-color);
}

.section-header i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.section-description {
  color: var(--secondary-text);
  margin: 0.5rem 0 0 2rem;
  font-size: 0.9rem;
}

.preferences-grid,
.account-actions-grid {
  display: grid;
  gap: 1.5rem;
}

.preference-item,
.action-item {
  background: var(--bg-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.preference-item:hover,
.action-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.preference-header,
.action-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.preference-header i,
.action-header i {
  color: var(--primary-color);
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.preference-item:hover .preference-header i,
.action-item:hover .action-header i {
  transform: scale(1.1);
}

.preference-header h4,
.action-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.preference-description,
.action-description {
  color: var(--secondary-text);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.language-select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.language-select:hover {
  border-color: var(--primary-color);
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-button:hover:not(:disabled) {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-button i {
  font-size: 1.1rem;
}

.success-message,
.error-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  max-width: 90%;
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--bg-color-rgb), 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .usuario-view {
    padding: 1rem;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 1.5rem auto;
  }

  .profile-section,
  .preferences-section,
  .genres-section,
  .account-actions-section {
    padding: 1.5rem;
  }

  .section-header h3 {
    font-size: 1.3rem;
  }

  .section-description {
    margin-left: 0;
  }

  .preference-item,
  .action-item {
    padding: 1.2rem;
  }

  .success-message,
  .error-message {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (min-width: 1200px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>