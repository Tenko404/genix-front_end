<template>
  <div class="profile-section">
    <h3>Informações Pessoais</h3>
    <div class="form-group">
      <label for="email">E-mail</label>
      <div class="input-with-button">
        <input type="email" id="email" v-model="localEmail" :disabled="!emailEditingEnabled" />
        <button @click="handleEmailEdit" class="edit-btn">
          <i :class="['fas', emailEditingEnabled ? 'fa-check' : 'fa-pen']"></i>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="current-password">Senha Atual</label>
      <div class="input-with-button">
        <input
          type="password"
          id="current-password"
          v-model="localCurrentPassword"
          :disabled="!passwordEditingEnabled"
        />
      </div>
    </div>

    <div v-if="passwordEditingEnabled" class="form-group">
      <label for="new-password">Nova Senha</label>
      <div class="input-with-button">
        <input
          type="password"
          id="new-password"
          v-model="localNewPassword"
        />
      </div>
    </div>

    <div v-if="passwordEditingEnabled" class="form-group">
      <label for="confirm-password">Confirmar Nova Senha</label>
      <div class="input-with-button">
        <input
          type="password"
          id="confirm-password"
          v-model="localConfirmPassword"
        />
      </div>
    </div>

    <div class="password-edit-controls">
      <button v-if="!passwordEditingEnabled" @click="$emit('start-password-edit')" class="edit-password-btn">
        Alterar Senha
      </button>
      <div v-else class="password-buttons">
        <button @click="handlePasswordSave" class="save-btn">Salvar</button>
        <button @click="$emit('cancel-password-edit')" class="cancel-btn">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfoSection',
  props: {
    email: {
      type: String,
      required: true
    },
    emailEditingEnabled: {
      type: Boolean,
      default: false
    },
    currentPassword: {
      type: String,
      required: true
    },
    newPassword: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    },
    passwordEditingEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localEmail: this.email,
      localCurrentPassword: this.currentPassword,
      localNewPassword: this.newPassword,
      localConfirmPassword: this.confirmPassword
    }
  },
  watch: {
    email(newVal) {
      this.localEmail = newVal
    },
    currentPassword(newVal) {
      this.localCurrentPassword = newVal
    },
    newPassword(newVal) {
      this.localNewPassword = newVal
    },
    confirmPassword(newVal) {
      this.localConfirmPassword = newVal
    }
  },
  methods: {
    handleEmailEdit() {
      if (this.emailEditingEnabled) {
        this.$emit('save-email', this.localEmail)
      } else {
        this.$emit('toggle-email-edit')
      }
    },
    handlePasswordSave() {
      this.$emit('save-password', {
        currentPassword: this.localCurrentPassword,
        newPassword: this.localNewPassword,
        confirmPassword: this.localConfirmPassword
      })
    }
  }
}
</script>

<style scoped>
.profile-section {
  background-color: var(--header-bg);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(to right, #4CAF50, #45a049);
}

.profile-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.profile-section h3 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-section h3::before {
  content: '\f007';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  font-size: 1.2rem;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 0.8rem;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 2rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.8rem;
  color: var(--secondary-text);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group:focus-within label {
  color: #4CAF50;
  transform: translateX(4px);
}

.input-with-button {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-with-button input {
  flex: 1;
  padding: 1rem 1.2rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--search-bg);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.input-with-button input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  outline: none;
  transform: translateY(-1px);
}

.input-with-button input:disabled {
  background-color: var(--hover-bg);
  cursor: not-allowed;
  opacity: 0.7;
}

.edit-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background-color: var(--header-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  border: 2px solid var(--border-color);
}

.edit-btn:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
}

.password-edit-controls {
  display: flex;
  justify-content: flex-start;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.password-buttons {
  display: flex;
  gap: 1.5rem;
}

.edit-password-btn,
.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  min-width: 80px;
}

.edit-password-btn {
  background-color: transparent;
  color: var(--text-color);
  border-color: var(--border-color);
}

.edit-password-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.save-btn {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
  border-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  border-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #e53935;
  border-color: #e53935;
}

@media (max-width: 768px) {
  .profile-section {
    padding: 2rem;
  }

  .password-edit-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .password-buttons {
    display: flex;
    gap: 1rem;
  }

  .edit-password-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-section {
    padding: 1.5rem;
  }

  .profile-section h3 {
    font-size: 1.3rem;
  }

  .input-with-button {
    flex-direction: column;
    gap: 0.5rem;
  }

  .edit-btn {
    width: 100%;
    flex-direction: row;
    gap: 0.5rem;
  }

  .edit-btn i {
    margin: 0;
  }

  .edit-password-btn,
  .save-btn,
  .cancel-btn {
    font-size: 0.8125rem;
  }
}
</style> 