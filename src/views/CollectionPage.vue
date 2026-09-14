<template>
  <ion-page>
    <ion-header class="main-header">
      <ion-toolbar>
        <ion-title>Recipe Collection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="page-wrapper">

        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-icon">
              <ion-icon :icon="restaurantOutline" />
            </div>

            <div>
              <p class="hero-label">MY KITCHEN</p>
              <h1>Recipe Collection</h1>
              <p class="hero-description">
                Discover, organize, and manage recipes shared by your kitchen community.
              </p>
            </div>
          </div>
        </section>

        <main class="main-content">
          <RecipeCRUD />
        </main>

      </div>
    </ion-content>

    <ion-footer class="bottom-navigation">
      <ion-toolbar>
        <div class="nav-tabs">

          <button class="nav-tab" type="button" @click="goHome">
            <ion-icon :icon="homeOutline" />
            <span>Home</span>
          </button>

          <button class="nav-tab active" type="button" aria-current="page">
            <ion-icon :icon="bookOutline" />
            <span>My Collection</span>
          </button>

        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonIcon
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { bookOutline, homeOutline, restaurantOutline } from 'ionicons/icons'
import RecipeCRUD from '../Component/RecipeCRUD.vue'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.main-header ion-toolbar {
  --background: #6f1d2a;
  --color: #0a0909;
  --border-width: 0;
}

.main-header ion-title {
  font-size: 18px;
  font-weight: 800;
}

.page-wrapper {
  min-height: 100%;
  background: #f8f5f4;
}

.hero-section {
  background: linear-gradient(135deg, #6f1d2a 0%, #7f2432 55%, #5a1722 100%);
  color: #fff;
  padding: 34px 20px 38px;
}

.hero-content {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-icon {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.13);
  border: 1px solid rgba(255,255,255,.18);
}

.hero-icon ion-icon {
  font-size: 29px;
}

.hero-label {
  margin: 0 0 4px;
  color: #f4d9dd;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.hero-section h1 {
  margin: 0;
  font-size: clamp(28px, 6vw, 40px);
  line-height: 1.05;
  font-weight: 800;
}

.hero-description {
  max-width: 560px;
  margin: 8px 0 0;
  color: #f7e8ea;
  font-size: 13px;
  line-height: 1.55;
}

.main-content {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px 100px;
}

.bottom-navigation {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  --border-width: 0;
  box-shadow: 0 -4px 18px rgba(40,15,20,.08);
}

.bottom-navigation ion-toolbar {
  --background: #fff;
  --border-width: 0;
  --min-height: 64px;
  padding: 0;
}

.nav-tabs {
  width: 100%;
  max-width: 760px;
  height: 64px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.nav-tab {
  appearance: none;
  border: 0;
  background: transparent;
  color: #806d72;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.nav-tab ion-icon {
  font-size: 21px;
}

.nav-tab.active {
  color: #741f2e;
}

@media (max-width: 600px) {
  .hero-section {
    padding: 30px 18px 34px;
  }

  .hero-content {
    align-items: flex-start;
  }

  .hero-icon {
    width: 52px;
    height: 52px;
    min-width: 52px;
  }

  .hero-section h1 {
    font-size: 29px;
  }

  .main-content {
    padding: 20px 14px 90px;
  }
}
</style>
