<template>
  <div class="profile-header">
    <div class="profile-photo-container">
      <div class="photo-wrapper">
        <img :src="profilePhoto" alt="Foto de perfil" class="profile-photo" />
        <div class="photo-overlay">
          <button class="photo-upload-btn" @click="triggerPhotoUpload">
            <i class="fas fa-camera"></i>
            <span>Alterar foto</span>
          </button>
        </div>
      </div>
      <input
        type="file"
        ref="photoInput"
        @change="handlePhotoUpload"
        accept="image/*"
        style="display: none"
      />
    </div>
    <div class="user-info">
      <h2 class="profile-name">{{ userName }}</h2>
      <span class="profile-subtitle">Membro desde 2024</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileHeader',
  props: {
    profilePhoto: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  },
  methods: {
    triggerPhotoUpload() {
      this.$refs.photoInput.click()
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.$emit('photo-uploaded', e.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--header-bg) 0%, var(--card-bg) 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: 0;
}

.profile-photo-container {
  position: relative;
  margin-bottom: 2rem;
  z-index: 1;
}

.photo-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 4px solid var(--card-bg);
}

.photo-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.photo-wrapper:hover .profile-photo {
  filter: brightness(0.8);
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

.photo-upload-btn {
  background: transparent;
  border: 2px solid white;
  border-radius: 30px;
  padding: 0.8rem 1.4rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.photo-upload-btn:hover {
  background: white;
  color: var(--text-color);
  transform: scale(1.05);
}

.photo-upload-btn i {
  font-size: 1.2rem;
}

.user-info {
  text-align: center;
  z-index: 1;
}

.profile-name {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--text-color) 0%, var(--secondary-text) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-subtitle {
  color: var(--secondary-text);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.profile-subtitle::before,
.profile-subtitle::after {
  content: '';
  height: 1px;
  width: 30px;
  background: var(--border-color);
}

@media (max-width: 768px) {
  .profile-header {
    padding: 1.5rem;
  }

  .photo-wrapper {
    width: 150px;
    height: 150px;
  }

  .profile-name {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .photo-wrapper {
    width: 120px;
    height: 120px;
  }

  .profile-name {
    font-size: 1.6rem;
  }

  .photo-upload-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}
</style> 