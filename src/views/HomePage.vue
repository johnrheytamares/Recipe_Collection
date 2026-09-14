<template>
  <ion-page>
    <ion-header class="main-header">
      <ion-toolbar>
        <ion-title>Recipe Box</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="home-page">

        <!-- =========================
             WELCOME
        ========================== -->
        <section class="welcome-section">
          <div class="welcome-content">

            <div class="welcome-icon">
              <ion-icon :icon="restaurantOutline" />
            </div>

            <div class="welcome-text">
              <span class="welcome-label">MY KITCHEN</span>

              <h1>
                Good food,<br />
                better moments.
              </h1>

              <p>
                Discover recipes shared by people who love good food.
              </p>
            </div>

          </div>
        </section>

        <!-- =========================
             HOME CONTENT
        ========================== -->
        <main class="home-content">

          <!-- Search -->
          <div class="search-box">
            <ion-icon :icon="searchOutline" />

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search recipes..."
            />
          </div>

          <!-- Popular Recipes -->
          <section class="featured-section">

            <div class="section-header">

              <div>
                <span class="section-label">
                  EXPLORE
                </span>

                <h2>
                  Popular Recipes
                </h2>
              </div>

              <button
                type="button"
                class="see-all-button"
                @click="goCollection"
              >
                See all
              </button>

            </div>

            <!-- Recipe Cards -->
            <div
              v-if="filteredRecipes.length"
              class="recipe-grid"
            >

              <article
                v-for="item in filteredRecipes"
                :key="item.id"
                class="recipe-card"
                @click="openRecipe(item)"
              >

                <!-- Image -->
                <div
                  v-if="item.imageBase64"
                  class="recipe-image"
                >
                  <img
                    :src="item.imageBase64"
                    :alt="item.recipeName"
                  />
                </div>

                <div
                  v-else
                  class="recipe-image recipe-placeholder"
                >
                  <ion-icon :icon="restaurantOutline" />
                </div>

                <!-- Info -->
                <div class="recipe-info">

                  <span class="category-tag">
                    {{ item.category || 'Recipe' }}
                  </span>

                  <h3>
                    {{ item.recipeName }}
                  </h3>

                  <div class="recipe-meta">

                    <span>
                      <ion-icon :icon="timeOutline" />
                      {{ item.preparationTime || '—' }}
                    </span>

                    <span>
                      <ion-icon :icon="peopleOutline" />
                      Shared recipe
                    </span>

                  </div>

                </div>

                <!-- View indicator -->
                <div class="view-indicator">
                  <span>View Recipe</span>
                  <ion-icon :icon="chevronForwardOutline" />
                </div>

              </article>

            </div>

            <!-- Empty -->
            <div
              v-else
              class="empty-home"
            >
              <ion-icon :icon="restaurantOutline" />

              <p>
                {{
                  searchQuery
                    ? 'No matching recipes.'
                    : 'No recipes have been shared yet.'
                }}
              </p>
            </div>

          </section>

        </main>
      </div>
    </ion-content>

    <!-- =========================
         BOTTOM NAVIGATION
    ========================== -->
    <ion-footer class="bottom-navigation">

      <ion-toolbar>

        <div class="nav-tabs">

          <button
            class="nav-tab active"
            type="button"
          >
            <ion-icon :icon="homeOutline" />
            <span>Home</span>
          </button>

          <button
            class="nav-tab"
            type="button"
            @click="goCollection"
          >
            <ion-icon :icon="bookOutline" />
            <span>My Collection</span>
          </button>

        </div>

      </ion-toolbar>

    </ion-footer>

    <!-- =====================================================
         RECIPE DETAIL OVERLAY
    ====================================================== -->
    <div
      v-if="showRecipeDetail && selectedRecipe"
      class="recipe-detail-overlay"
      @click.self="closeRecipe"
    >

      <div class="recipe-detail-modal">

        <!-- Close -->
        <button
          type="button"
          class="detail-close"
          aria-label="Close recipe"
          @click="closeRecipe"
        >
          <ion-icon :icon="closeOutline" />
        </button>

        <!-- Recipe Image -->
        <div
          v-if="selectedRecipe.imageBase64"
          class="detail-image"
        >
          <img
            :src="selectedRecipe.imageBase64"
            :alt="selectedRecipe.recipeName"
          />
        </div>

        <div
          v-else
          class="detail-image detail-placeholder"
        >
          <ion-icon :icon="restaurantOutline" />
        </div>

        <!-- Recipe Body -->
        <div class="detail-body">

          <span class="detail-category">
            {{ selectedRecipe.category || 'Recipe' }}
          </span>

          <h2>
            {{ selectedRecipe.recipeName }}
          </h2>

          <!-- Meta -->
          <div class="detail-meta">

            <span>
              <ion-icon :icon="timeOutline" />
              {{ selectedRecipe.preparationTime || 'No prep time' }}
            </span>

            <span>
              <ion-icon :icon="peopleOutline" />
              Shared recipe
            </span>

          </div>

          <!-- Divider -->
          <div class="detail-divider"></div>

          <!-- Ingredients -->
          <section class="detail-section">

            <h3>
              <ion-icon :icon="restaurantOutline" />
              Ingredients
            </h3>

            <div class="detail-text ingredients-text">
              <template
                v-for="(ingredient, index) in ingredientLines"
                :key="index"
              >
                <div class="ingredient-line">
                  <span class="bullet">•</span>
                  <span>{{ ingredient }}</span>
                </div>
              </template>
            </div>

          </section>

          <!-- Instructions -->
          <section class="detail-section">

            <h3>
              <ion-icon :icon="documentTextOutline" />
              Instructions
            </h3>

            <div class="detail-text">

              <div
                v-for="(instruction, index) in instructionLines"
                :key="index"
                class="instruction-line"
              >
                <span class="instruction-number">
                  {{ index + 1 }}
                </span>

                <span>
                  {{ instruction }}
                </span>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>

  </ion-page>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref
} from 'vue'

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

import {
  bookOutline,
  homeOutline,
  peopleOutline,
  restaurantOutline,
  searchOutline,
  timeOutline,
  chevronForwardOutline,
  closeOutline,
  documentTextOutline
} from 'ionicons/icons'

import {
  onValue,
  ref as firebaseRef
} from 'firebase/database'

import { database } from '../firebase'


/* =====================================================
   RECIPE TYPE
===================================================== */

interface Recipe {
  id: string
  recipeName: string
  category: string
  ingredients: string
  instructions: string
  preparationTime: string
  imageBase64?: string
  createdBy?: string
  createdAt?: number
}


/* =====================================================
   STATE
===================================================== */

const router = useRouter()

const recipes = ref<Recipe[]>([])

const searchQuery = ref('')

const selectedRecipe = ref<Recipe | null>(null)

const showRecipeDetail = ref(false)


/* =====================================================
   FIREBASE
===================================================== */

const recipesReference = firebaseRef(
  database,
  'recipes'
)


/* =====================================================
   NORMALIZE FIREBASE DATA
===================================================== */

const normalizeRecipe = (
  id: string,
  data: any
): Recipe => ({
  id,

  recipeName:
    data?.recipeName || '',

  category:
    data?.category || '',

  ingredients:
    data?.ingredients || '',

  instructions:
    data?.instructions || '',

  preparationTime:
    data?.preparationTime || '',

  /*
   * Supports both:
   * imageBase64
   * imageUrl
   */
  imageBase64:
    data?.imageBase64 ||
    data?.imageUrl ||
    '',

  createdBy:
    data?.createdBy || '',

  createdAt:
    Number(data?.createdAt || 0)
})


/* =====================================================
   FILTER RECIPES
===================================================== */

const filteredRecipes = computed(() => {

  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  const all = recipes.value
    .filter(
      item => item.recipeName
    )
    .sort(
      (a, b) =>
        (b.createdAt || 0) -
        (a.createdAt || 0)
    )

  if (!query) {
    return all.slice(0, 8)
  }

  return all
    .filter(item =>
      item.recipeName
        .toLowerCase()
        .includes(query)
      ||
      item.category
        .toLowerCase()
        .includes(query)
    )
    .slice(0, 8)
})


/* =====================================================
   INGREDIENT LINES
===================================================== */

const ingredientLines = computed(() => {

  if (!selectedRecipe.value?.ingredients) {
    return ['No ingredients provided.']
  }

  return selectedRecipe.value.ingredients
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)
})


/* =====================================================
   INSTRUCTION LINES
===================================================== */

const instructionLines = computed(() => {

  if (!selectedRecipe.value?.instructions) {
    return ['No instructions provided.']
  }

  return selectedRecipe.value.instructions
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)
})


/* =====================================================
   OPEN RECIPE
===================================================== */

const openRecipe = (recipe: Recipe) => {

  selectedRecipe.value = recipe

  showRecipeDetail.value = true

  /*
   * Prevent background page scrolling
   */
  document.body.style.overflow = 'hidden'
}


/* =====================================================
   CLOSE RECIPE
===================================================== */

const closeRecipe = () => {

  showRecipeDetail.value = false

  selectedRecipe.value = null

  document.body.style.overflow = ''
}


/* =====================================================
   NAVIGATION
===================================================== */

const goCollection = () => {
  router.push('/collection')
}


/* =====================================================
   REALTIME FIREBASE LISTENER
===================================================== */

let unsubscribe: (() => void) | null = null

onMounted(() => {

  unsubscribe = onValue(
    recipesReference,
    snapshot => {

      if (!snapshot.exists()) {

        recipes.value = []

        return
      }

      const data = snapshot.val()

      recipes.value =
        Object.keys(data)
          .map(id =>
            normalizeRecipe(
              id,
              data[id]
            )
          )
    }
  )
})


/* =====================================================
   CLEANUP
===================================================== */

onUnmounted(() => {

  unsubscribe?.()

  document.body.style.overflow = ''
})
</script>


<style scoped>
@import url(
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap'
);


/* =====================================================
   PAGE
===================================================== */

.home-page {
  min-height: 100%;
  background: #f8f5f4;
  padding-bottom: 90px;
  font-family: 'Inter', sans-serif;
  color: #351219;
}


/* =====================================================
   HEADER
===================================================== */

.main-header ion-toolbar {
  --background: #fff;
  --color: #351219;
  --border-width: 0;

  box-shadow:
    0 1px 8px rgba(40,15,20,.06);
}

.main-header ion-title {
  font-size: 18px;
  font-weight: 800;
}


/* =====================================================
   WELCOME
===================================================== */

.welcome-section {
  background:
    linear-gradient(
      135deg,
      #6f1d2a 0%,
      #7f2432 55%,
      #5a1722 100%
    );

  color: #fff;

  padding:
    32px
    18px
    38px;
}

.welcome-content {
  width: 100%;
  max-width: 760px;

  margin: 0 auto;

  display: flex;
  align-items: center;

  gap: 15px;
}

.welcome-icon {
  width: 54px;
  height: 54px;
  min-width: 54px;

  border-radius: 15px;

  display: grid;
  place-items: center;

  background:
    rgba(255,255,255,.13);

  border:
    1px solid
    rgba(255,255,255,.18);
}

.welcome-icon ion-icon {
  font-size: 28px;
}

.welcome-label {
  display: block;

  margin-bottom: 4px;

  color: #f4d9dd;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 1.8px;
}

.welcome-text h1 {
  margin: 0;

  font-size: 30px;

  line-height: 1.05;

  font-weight: 800;
}

.welcome-text p {
  max-width: 500px;

  margin: 9px 0 0;

  color: #f7e8ea;

  font-size: 13px;

  line-height: 1.55;
}


/* =====================================================
   CONTENT
===================================================== */

.home-content {
  width: 100%;
  max-width: 760px;

  margin: 0 auto;

  padding:
    18px
    14px
    35px;
}


/* =====================================================
   SEARCH
===================================================== */

.search-box {
  height: 46px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding:
    0
    13px;

  border:
    1px solid
    #eadfe0;

  border-radius: 12px;

  background: #fff;

  box-shadow:
    0 3px 12px
    rgba(40,15,20,.04);
}

.search-box ion-icon {
  color: #927f84;
  font-size: 18px;
}

.search-box input {
  width: 100%;

  border: 0;
  outline: 0;

  background: transparent;

  color: #351219;

  font: inherit;

  font-size: 13px;
}


/* =====================================================
   SECTION
===================================================== */

.featured-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 12px;
}

.section-label {
  display: block;

  margin-bottom: 3px;

  color: #8b3442;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

.section-header h2 {
  margin: 0;

  color: #351219;

  font-size: 22px;

  font-weight: 800;
}

.see-all-button {
  border: 0;

  background: transparent;

  color: #741f2e;

  font: inherit;

  font-size: 11px;

  font-weight: 800;

  cursor: pointer;
}


/* =====================================================
   RECIPE GRID
===================================================== */

.recipe-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 10px;
}


/* =====================================================
   RECIPE CARD
===================================================== */

.recipe-card {
  position: relative;

  overflow: hidden;

  border:
    1px solid
    #eadfe0;

  border-radius: 13px;

  background: #fff;

  box-shadow:
    0 4px 14px
    rgba(40,15,20,.06);

  cursor: pointer;

  transition:
    transform .18s ease,
    box-shadow .18s ease;
}

.recipe-card:active {
  transform: scale(.98);
}

.recipe-card:hover {
  box-shadow:
    0 7px 20px
    rgba(40,15,20,.11);
}


/* =====================================================
   IMAGE
===================================================== */

.recipe-image {
  width: 100%;

  aspect-ratio: 16 / 10;

  background: #eee3e5;
}

.recipe-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.recipe-placeholder {
  display: grid;

  place-items: center;

  color: #a66c77;
}

.recipe-placeholder ion-icon {
  font-size: 30px;
}


/* =====================================================
   CARD INFO
===================================================== */

.recipe-info {
  padding:
    9px
    9px
    6px;
}

.category-tag {
  display: inline-flex;

  padding:
    3px
    7px;

  border-radius: 7px;

  background: #f8e9ec;

  color: #741f2e;

  font-size: 8px;

  font-weight: 800;

  text-transform: capitalize;
}

.recipe-info h3 {
  margin:
    7px
    0
    6px;

  color: #351219;

  font-family:
    'Fraunces',
    serif;

  font-size: 13px;

  line-height: 1.18;
}

.recipe-meta {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #151213;

  font-size: 7.5px;
}

.recipe-meta span {
  display: flex;

  align-items: center;

  gap: 2px;
}

.recipe-meta ion-icon {
  font-size: 10px;
}


/* =====================================================
   VIEW INDICATOR
===================================================== */

.view-indicator {
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 3px;

  padding:
    4px
    9px
    9px;

  color: #741f2e;

  font-size: 8px;

  font-weight: 800;
}

.view-indicator ion-icon {
  font-size: 11px;
}


/* =====================================================
   EMPTY
===================================================== */

.empty-home {
  padding: 45px 10px;

  text-align: center;

  color: #806d72;
}

.empty-home ion-icon {
  font-size: 35px;

  color: #a66c77;
}

.empty-home p {
  margin: 9px 0 0;

  font-size: 12px;
}


/* =====================================================
   BOTTOM NAVIGATION
===================================================== */

.bottom-navigation {
  position: fixed;

  left: 0;
  right: 0;
  bottom: 0;

  z-index: 1000;

  --border-width: 0;

  box-shadow:
    0 -4px 18px
    rgba(40,15,20,.08);
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

  grid-template-columns:
    repeat(2, 1fr);
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


/* =====================================================
   RECIPE DETAIL OVERLAY
===================================================== */

.recipe-detail-overlay {
  position: fixed;

  inset: 0;

  z-index: 5000;

  display: flex;

  align-items: flex-end;

  justify-content: center;

  background:
    rgba(20, 12, 14, .58);

  backdrop-filter:
    blur(3px);
}


/* =====================================================
   DETAIL MODAL
===================================================== */

.recipe-detail-modal {
  position: relative;

  width: 100%;

  max-width: 620px;

  max-height: 92vh;

  overflow-y: auto;

  background: #fff;

  border-radius:
    24px
    24px
    0
    0;

  box-shadow:
    0 -8px 35px
    rgba(0,0,0,.22);

  animation:
    recipeSlideUp .22s ease;
}

@keyframes recipeSlideUp {

  from {
    transform:
      translateY(100%);
  }

  to {
    transform:
      translateY(0);
  }

}


/* =====================================================
   CLOSE
===================================================== */

.detail-close {
  position: absolute;

  top: 12px;
  right: 12px;

  z-index: 10;

  width: 38px;
  height: 38px;

  display: grid;

  place-items: center;

  border: 0;

  border-radius: 50%;

  background:
    rgba(255,255,255,.92);

  color: #351219;

  box-shadow:
    0 3px 12px
    rgba(0,0,0,.12);

  cursor: pointer;
}

.detail-close ion-icon {
  font-size: 21px;
}


/* =====================================================
   DETAIL IMAGE
===================================================== */

.detail-image {
  width: 100%;

  aspect-ratio: 16 / 9;

  background: #eee3e5;
}

.detail-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.detail-placeholder {
  display: grid;

  place-items: center;

  color: #a66c77;
}

.detail-placeholder ion-icon {
  font-size: 55px;
}


/* =====================================================
   DETAIL BODY
===================================================== */

.detail-body {
  padding:
    20px
    20px
    28px;
}

.detail-category {
  display: inline-flex;

  padding:
    5px
    9px;

  border-radius: 8px;

  background: #f8e9ec;

  color: #741f2e;

  font-size: 10px;

  font-weight: 800;

  text-transform: capitalize;
}

.detail-body h2 {
  margin:
    9px
    0
    8px;

  color: #351219;

  font-family:
    'Fraunces',
    serif;

  font-size: 26px;

  line-height: 1.15;
}


/* =====================================================
   DETAIL META
===================================================== */

.detail-meta {
  display: flex;

  align-items: center;

  gap: 15px;

  color: #806d72;

  font-size: 11px;
}

.detail-meta span {
  display: flex;

  align-items: center;

  gap: 5px;
}

.detail-meta ion-icon {
  font-size: 15px;

  color: #741f2e;
}


/* =====================================================
   DIVIDER
===================================================== */

.detail-divider {
  height: 1px;

  margin:
    17px
    0;

  background: #eadfe0;
}


/* =====================================================
   DETAIL SECTIONS
===================================================== */

.detail-section {
  margin-top: 18px;
}

.detail-section h3 {
  display: flex;

  align-items: center;

  gap: 7px;

  margin:
    0
    0
    10px;

  color: #351219;

  font-family:
    'Fraunces',
    serif;

  font-size: 17px;
}

.detail-section h3 ion-icon {
  color: #741f2e;

  font-size: 18px;
}


/* =====================================================
   INGREDIENTS
===================================================== */

.ingredient-line {
  display: flex;

  align-items: flex-start;

  gap: 8px;

  margin-bottom: 7px;

  color: #6d5b60;

  font-size: 12px;

  line-height: 1.5;
}

.bullet {
  color: #741f2e;

  font-weight: 800;
}


/* =====================================================
   INSTRUCTIONS
===================================================== */

.instruction-line {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  margin-bottom: 9px;

  color: #6d5b60;

  font-size: 12px;

  line-height: 1.5;
}

.instruction-number {
  width: 22px;
  height: 22px;

  min-width: 22px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #f8e9ec;

  color: #741f2e;

  font-size: 10px;

  font-weight: 800;
}


/* =====================================================
   DONE BUTTON
===================================================== */

.detail-done-button {
  width: 100%;

  height: 46px;

  margin-top: 24px;

  border: 0;

  border-radius: 11px;

  background: #741f2e;

  color: #fff;

  font: inherit;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 380px) {

  .recipe-grid {
    grid-template-columns:
      1fr 1fr;

    gap: 8px;
  }

  .recipe-info h3 {
    font-size: 12px;
  }

  .detail-body {
    padding:
      18px
      16px
      25px;
  }

  .detail-body h2 {
    font-size: 23px;
  }

}
</style>