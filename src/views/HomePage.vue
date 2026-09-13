<template>
  <ion-page>
    <ion-header class="main-header">
      <ion-toolbar>
        <ion-title>Recipe Collection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="page-wrapper">

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-icon">
              <ion-icon :icon="restaurantOutline" />
            </div>

            <div>
              <p class="hero-label">MY KITCHEN</p>
              <h1>Recipe Collection</h1>
              <p class="hero-description">
                Discover, organize, and manage your favorite recipes
                in one place.
              </p>
            </div>
          </div>
        </section>

        <!-- Main Content -->
        <main class="main-content">

          <!-- Section Header -->
          <div class="section-heading">
            <div>
              <span class="section-label">YOUR COLLECTION</span>
              <h2>Manage Your Recipes</h2>
            </div>
          </div>

          <!-- CRUD Component -->
          <RecipeCRUD />

        </main>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon
} from '@ionic/vue'

import { restaurantOutline } from 'ionicons/icons'
import RecipeCRUD from '../Component/RecipeCRUD.vue'
</script>

<style scoped>
/* ==============================
   HEADER
============================== */

.main-header ion-toolbar {
  --background: #6f1d2a;
  --color: #ffffff;
  --border-width: 0;
}

.main-header ion-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

/* ==============================
   PAGE
============================== */

.page-wrapper {
  min-height: 100%;
  background: #f8f5f4;
}

/* ==============================
   HERO
============================== */

.hero-section {
  background:
    linear-gradient(135deg,
      #6f1d2a 0%,
      #7f2432 55%,
      #5a1722 100%);

  color: #ffffff;
  padding: 42px 24px 48px;
}

.hero-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 64px;
  height: 64px;
  min-width: 64px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-icon ion-icon {
  font-size: 32px;
}

.hero-label {
  margin: 0 0 5px;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;

  color: #f4d9dd;
}

.hero-section h1 {
  margin: 0;

  font-size: clamp(30px, 5vw, 44px);
  line-height: 1.1;
  font-weight: 800;
}

.hero-description {
  max-width: 600px;

  margin: 10px 0 0;

  font-size: 15px;
  line-height: 1.6;

  color: #f7e8ea;
}

/* ==============================
   MAIN CONTENT
============================== */

.main-content {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto;
  padding: 32px 20px 50px;
}

/* ==============================
   SECTION HEADING
============================== */

.section-heading {
  margin-bottom: 20px;
}

.section-label {
  display: block;

  margin-bottom: 5px;

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;

  color: #8b3442;
}

.section-heading h2 {
  margin: 0;

  font-size: 24px;
  font-weight: 800;

  color: #351219;
}

/* ==============================
   RESPONSIVE
============================== */

@media (max-width: 600px) {
  .hero-section {
    padding: 32px 20px 38px;
  }

  .hero-content {
    align-items: flex-start;
  }

  .hero-icon {
    width: 54px;
    height: 54px;
    min-width: 54px;
    border-radius: 15px;
  }

  .hero-icon ion-icon {
    font-size: 27px;
  }

  .hero-section h1 {
    font-size: 30px;
  }

  .hero-description {
    font-size: 14px;
  }

  .main-content {
    padding: 26px 14px 40px;
  }
}
</style>
