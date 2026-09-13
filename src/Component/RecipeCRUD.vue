<template>
    <div class="recipe-container">

        <!-- ==========================
         ADD / EDIT RECIPE
    =========================== -->
        <ion-card class="form-card">

            <ion-card-header>
                <div class="form-header">

                    <div class="form-icon">
                        <ion-icon :icon="editingId ? createOutline : addOutline" />
                    </div>

                    <div>
                        <ion-card-subtitle>
                            {{ editingId ? 'UPDATE RECIPE' : 'NEW RECIPE' }}
                        </ion-card-subtitle>

                        <ion-card-title>
                            {{ editingId ? 'Edit Recipe' : 'Add a Recipe' }}
                        </ion-card-title>
                    </div>

                </div>
            </ion-card-header>

            <ion-card-content>

                <!-- Recipe Name -->
                <div class="form-field">
                    <label>Recipe Name</label>

                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="restaurantOutline" />

                        <ion-input v-model="recipe.recipeName" placeholder="Enter recipe name" />
                    </ion-item>
                </div>

                <!-- Category -->
                <div class="form-field">
                    <label>Category</label>

                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="gridOutline" />

                        <ion-input v-model="recipe.category" placeholder="e.g. Main Dish, Dessert" />
                    </ion-item>
                </div>

                <!-- Preparation Time -->
                <div class="form-field">
                    <label>Preparation Time</label>

                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="timeOutline" />

                        <ion-input v-model="recipe.preparationTime" placeholder="e.g. 30 minutes" />
                    </ion-item>
                </div>

                <!-- Ingredients -->
                <div class="form-field">
                    <label>Ingredients</label>

                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="listOutline" />

                        <ion-textarea v-model="recipe.ingredients" placeholder="List the ingredients needed..."
                            :auto-grow="true" />
                    </ion-item>
                </div>

                <!-- Instructions -->
                <div class="form-field">
                    <label>Instructions</label>

                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="documentTextOutline" />

                        <ion-textarea v-model="recipe.instructions" placeholder="Write the cooking instructions..."
                            :auto-grow="true" />
                    </ion-item>
                </div>

                <!-- Buttons -->
                <div class="form-buttons">

                    <ion-button class="primary-button" expand="block" @click="saveRecipe">
                        <ion-icon slot="start" :icon="editingId ? saveOutline : addOutline" />

                        {{ editingId ? 'Update Recipe' : 'Add Recipe' }}
                    </ion-button>

                    <ion-button v-if="editingId" class="cancel-button" expand="block" fill="outline"
                        @click="cancelEdit">
                        Cancel
                    </ion-button>

                </div>

            </ion-card-content>
        </ion-card>


        <!-- ==========================
         RECIPE COLLECTION
    =========================== -->

        <div class="collection-header">

            <div>
                <span class="collection-label">RECIPES</span>
                <h2>Your Collection</h2>
            </div>

            <div class="recipe-count">
                {{ recipes.length }}
                {{ recipes.length === 1 ? 'Recipe' : 'Recipes' }}
            </div>

        </div>


        <!-- Empty State -->
        <div v-if="recipes.length === 0" class="empty-state">
            <div class="empty-icon">
                <ion-icon :icon="restaurantOutline" />
            </div>

            <h3>No Recipes Yet</h3>

            <p>
                Start building your recipe collection by
                adding your first recipe above.
            </p>
        </div>


        <!-- ==========================
         RECIPE CARDS
    =========================== -->

        <div v-else class="recipe-grid">

            <ion-card v-for="item in recipes" :key="item.id" class="recipe-card">

                <!-- Card Top -->
                <div class="recipe-card-top">

                    <div class="category-badge">
                        {{ item.category }}
                    </div>

                    <div class="time-badge">
                        <ion-icon :icon="timeOutline" />
                        {{ item.preparationTime }}
                    </div>

                </div>


                <!-- Recipe Title -->
                <ion-card-header class="recipe-header">

                    <ion-card-title>
                        {{ item.recipeName }}
                    </ion-card-title>

                </ion-card-header>


                <!-- Recipe Information -->
                <ion-card-content>

                    <!-- Ingredients -->
                    <div class="recipe-section">

                        <div class="recipe-section-title">
                            <ion-icon :icon="listOutline" />
                            <span>Ingredients</span>
                        </div>

                        <p>
                            {{ item.ingredients }}
                        </p>

                    </div>


                    <!-- Instructions -->
                    <div class="recipe-section">

                        <div class="recipe-section-title">
                            <ion-icon :icon="documentTextOutline" />
                            <span>Instructions</span>
                        </div>

                        <p>
                            {{ item.instructions }}
                        </p>

                    </div>


                    <!-- Actions -->
                    <div class="recipe-actions">

                        <ion-button class="edit-button" fill="outline" @click="editRecipe(item)">
                            <ion-icon slot="start" :icon="createOutline" />

                            Edit
                        </ion-button>

                        <ion-button class="delete-button" fill="outline" @click="deleteRecipe(item.id)">
                            <ion-icon slot="start" :icon="trashOutline" />

                            Delete
                        </ion-button>

                    </div>

                </ion-card-content>

            </ion-card>

        </div>

    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon
} from '@ionic/vue'

import {
    restaurantOutline,
    addOutline,
    createOutline,
    saveOutline,
    trashOutline,
    timeOutline,
    listOutline,
    documentTextOutline,
    gridOutline
} from 'ionicons/icons'

import {
    ref as firebaseRef,
    push,
    set,
    get,
    update,
    remove
} from 'firebase/database'

import { database } from '../firebase'


interface Recipe {
    id: string
    recipeName: string
    category: string
    ingredients: string
    instructions: string
    preparationTime: string
}


const recipes = ref<Recipe[]>([])

const recipe = ref({
    recipeName: '',
    category: '',
    ingredients: '',
    instructions: '',
    preparationTime: ''
})

const editingId = ref<string | null>(null)

const recipesReference = firebaseRef(
    database,
    'recipes'
)


/* =========================
   LOAD RECIPES
========================= */

const loadRecipes = async () => {
    try {

        const snapshot = await get(
            recipesReference
        )

        const loadedRecipes: Recipe[] = []

        if (snapshot.exists()) {

            const data = snapshot.val()

            Object.keys(data).forEach((id) => {

                loadedRecipes.push({
                    id,
                    recipeName: data[id].recipeName || '',
                    category: data[id].category || '',
                    ingredients: data[id].ingredients || '',
                    instructions: data[id].instructions || '',
                    preparationTime:
                        data[id].preparationTime || ''
                })

            })
        }

        recipes.value = loadedRecipes

    } catch (error) {

        console.error(
            'Error loading recipes:',
            error
        )

    }
}


/* =========================
   ADD RECIPE
========================= */

const addRecipe = async () => {

    try {

        const newRecipeReference =
            push(recipesReference)

        await set(
            newRecipeReference,
            {
                recipeName:
                    recipe.value.recipeName,

                category:
                    recipe.value.category,

                ingredients:
                    recipe.value.ingredients,

                instructions:
                    recipe.value.instructions,

                preparationTime:
                    recipe.value.preparationTime
            }
        )

        await loadRecipes()

        clearForm()

        console.log(
            'Recipe added successfully.'
        )

    } catch (error) {

        console.error(
            'Error adding recipe:',
            error
        )

    }
}


/* =========================
   UPDATE RECIPE
========================= */

const updateRecipe = async () => {

    if (!editingId.value) {
        return
    }

    try {

        const recipeReference =
            firebaseRef(
                database,
                `recipes/${editingId.value}`
            )

        await update(
            recipeReference,
            {
                recipeName:
                    recipe.value.recipeName,

                category:
                    recipe.value.category,

                ingredients:
                    recipe.value.ingredients,

                instructions:
                    recipe.value.instructions,

                preparationTime:
                    recipe.value.preparationTime
            }
        )

        await loadRecipes()

        clearForm()

        console.log(
            'Recipe updated successfully.'
        )

    } catch (error) {

        console.error(
            'Error updating recipe:',
            error
        )

    }
}


/* =========================
   DELETE RECIPE
========================= */

const deleteRecipe = async (
    id: string
) => {

    const confirmed = window.confirm(
        'Are you sure you want to delete this recipe?'
    )

    if (!confirmed) {
        return
    }

    try {

        const recipeReference =
            firebaseRef(
                database,
                `recipes/${id}`
            )

        await remove(recipeReference)

        await loadRecipes()

        console.log(
            'Recipe deleted successfully.'
        )

    } catch (error) {

        console.error(
            'Error deleting recipe:',
            error
        )

    }
}


/* =========================
   EDIT RECIPE
========================= */

const editRecipe = (
    item: Recipe
) => {

    editingId.value = item.id

    recipe.value = {

        recipeName:
            item.recipeName,

        category:
            item.category,

        ingredients:
            item.ingredients,

        instructions:
            item.instructions,

        preparationTime:
            item.preparationTime
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}


/* =========================
   SAVE RECIPE
========================= */

const saveRecipe = async () => {

    if (
        !recipe.value.recipeName.trim() ||
        !recipe.value.category.trim() ||
        !recipe.value.ingredients.trim() ||
        !recipe.value.instructions.trim() ||
        !recipe.value.preparationTime.trim()
    ) {

        alert(
            'Please fill in all fields.'
        )

        return
    }

    if (editingId.value) {

        await updateRecipe()

    } else {

        await addRecipe()

    }
}


/* =========================
   CLEAR FORM
========================= */

const clearForm = () => {

    recipe.value = {

        recipeName: '',
        category: '',
        ingredients: '',
        instructions: '',
        preparationTime: ''

    }

    editingId.value = null
}


/* =========================
   CANCEL EDIT
========================= */

const cancelEdit = () => {

    clearForm()

}


/* =========================
   LOAD ON PAGE START
========================= */

onMounted(() => {

    loadRecipes()

})
</script>


<style scoped>
/* =================================
   MAIN CONTAINER
================================= */

.recipe-container {
    width: 100%;
}


/* =================================
   FORM CARD
================================= */

.form-card {
    margin: 0 0 36px;

    border-radius: 20px;

    background: #ffffff;

    box-shadow:
        0 8px 30px rgba(70, 18, 28, 0.08);

    border: 1px solid #eee1e3;

    overflow: hidden;
}


/* =================================
   FORM HEADER
================================= */

.form-card ion-card-header {
    padding: 24px 24px 12px;
}

.form-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.form-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;

    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #f6e8eb;
}

.form-icon ion-icon {
    font-size: 25px;
    color: #751f2e;
}

.form-card ion-card-subtitle {
    margin: 0 0 3px;

    font-size: 10px;
    font-weight: 800;

    letter-spacing: 1.5px;

    color: #963746;
}

.form-card ion-card-title {
    font-size: 22px;
    font-weight: 800;

    color: #351219;
}


/* =================================
   FORM CONTENT
================================= */

.form-card ion-card-content {
    padding: 12px 24px 26px;
}

.form-field {
    margin-bottom: 16px;
}

.form-field>label {
    display: block;

    margin: 0 0 7px 3px;

    font-size: 13px;
    font-weight: 700;

    color: #4d252c;
}

.form-field ion-item {
    --background: #faf7f7;
    --border-color: transparent;
    --highlight-color: #761f2f;

    --padding-start: 13px;
    --inner-padding-end: 13px;

    border: 1px solid #eadcde;
    border-radius: 12px;

    min-height: 50px;

    transition: 0.2s ease;
}

.form-field ion-item:focus-within {
    border-color: #8a2a39;
    background: #ffffff;
}

.form-field ion-icon {
    color: #8a2a39;

    font-size: 19px;

    margin-right: 8px;
}

.form-field ion-input,
.form-field ion-textarea {
    --color: #351219;
    --placeholder-color: #9c8589;

    font-size: 14px;
}


/* =================================
   BUTTONS
================================= */

.form-buttons {
    margin-top: 24px;

    display: flex;
    gap: 10px;
}

.form-buttons ion-button {
    --border-radius: 12px;

    height: 48px;

    margin: 0;
}

.primary-button {
    --background: #741f2e;
    --background-hover: #5e1825;
    --background-activated: #5e1825;

    --box-shadow:
        0 6px 16px rgba(116, 31, 46, 0.22);

    font-weight: 700;

    flex: 1;
}

.cancel-button {
    --color: #741f2e;
    --border-color: #d5b8bd;

    font-weight: 700;
}


/* =================================
   COLLECTION HEADER
================================= */

.collection-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    margin-bottom: 18px;
}

.collection-label {
    display: block;

    margin-bottom: 3px;

    font-size: 10px;
    font-weight: 800;

    letter-spacing: 1.5px;

    color: #963746;
}

.collection-header h2 {
    margin: 0;

    font-size: 25px;
    font-weight: 800;

    color: #351219;
}

.recipe-count {
    padding: 7px 12px;

    border-radius: 20px;

    background: #f3e4e7;

    color: #741f2e;

    font-size: 12px;
    font-weight: 700;
}


/* =================================
   RECIPE GRID
================================= */

.recipe-grid {
    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 20px;
}


/* =================================
   RECIPE CARD
================================= */

.recipe-card {
    margin: 0;

    border-radius: 18px;

    background: #ffffff;

    border: 1px solid #eee1e3;

    box-shadow:
        0 6px 22px rgba(70, 18, 28, 0.07);

    overflow: hidden;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.recipe-card:hover {
    transform: translateY(-3px);

    box-shadow:
        0 12px 30px rgba(70, 18, 28, 0.12);
}


/* =================================
   CARD TOP
================================= */

.recipe-card-top {
    display: flex;

    justify-content: space-between;
    align-items: center;

    padding: 18px 18px 0;
}

.category-badge {
    display: inline-flex;

    align-items: center;

    padding: 6px 10px;

    border-radius: 20px;

    background: #f6e7ea;

    color: #741f2e;

    font-size: 11px;
    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: 0.4px;
}

.time-badge {
    display: flex;

    align-items: center;

    gap: 4px;

    font-size: 11px;
    font-weight: 700;

    color: #80656a;
}

.time-badge ion-icon {
    font-size: 15px;

    color: #8b3442;
}


/* =================================
   RECIPE HEADER
================================= */

.recipe-header {
    padding: 15px 18px 10px;
}

.recipe-header ion-card-title {
    font-size: 22px;

    line-height: 1.2;

    font-weight: 800;

    color: #351219;
}


/* =================================
   RECIPE CONTENT
================================= */

.recipe-card ion-card-content {
    padding: 8px 18px 18px;
}

.recipe-section {
    margin-bottom: 18px;
}

.recipe-section-title {
    display: flex;

    align-items: center;

    gap: 7px;

    margin-bottom: 7px;

    font-size: 12px;

    font-weight: 800;

    color: #741f2e;

    text-transform: uppercase;

    letter-spacing: 0.5px;
}

.recipe-section-title ion-icon {
    font-size: 16px;
}

.recipe-section p {
    margin: 0;

    color: #6c5b5f;

    font-size: 13px;

    line-height: 1.6;

    white-space: pre-line;

    display: -webkit-box;
    line-clamp: 5;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;

    overflow: hidden;
}


/* =================================
   ACTION BUTTONS
================================= */

.recipe-actions {
    display: flex;

    gap: 9px;

    padding-top: 4px;

    border-top: 1px solid #f0e6e8;
}

.recipe-actions ion-button {
    flex: 1;

    height: 42px;

    margin: 13px 0 0;

    --border-radius: 10px;

    font-size: 12px;

    font-weight: 700;
}

.edit-button {
    --color: #741f2e;
    --border-color: #cfaeb4;
}

.delete-button {
    --color: #a33a48;
    --border-color: #e0bfc4;
}


/* =================================
   EMPTY STATE
================================= */

.empty-state {
    padding: 55px 25px;

    text-align: center;

    background: #ffffff;

    border: 1px dashed #d8bdc1;

    border-radius: 18px;
}

.empty-icon {
    width: 65px;
    height: 65px;

    margin: 0 auto 15px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 18px;

    background: #f6e7ea;
}

.empty-icon ion-icon {
    font-size: 30px;

    color: #7a2332;
}

.empty-state h3 {
    margin: 0 0 7px;

    font-size: 19px;

    font-weight: 800;

    color: #351219;
}

.empty-state p {
    max-width: 390px;

    margin: 0 auto;

    font-size: 13px;

    line-height: 1.6;

    color: #806d72;
}


/* =================================
   RESPONSIVE
================================= */

@media (max-width: 760px) {

    .recipe-grid {
        grid-template-columns: 1fr;
    }

}


@media (max-width: 520px) {

    .form-card ion-card-header {
        padding: 20px 17px 10px;
    }

    .form-card ion-card-content {
        padding: 10px 17px 20px;
    }

    .form-buttons {
        flex-direction: column;
    }

    .collection-header h2 {
        font-size: 22px;
    }

    .recipe-card-top {
        padding: 15px 15px 0;
    }

    .recipe-header {
        padding: 13px 15px 8px;
    }

    .recipe-card ion-card-content {
        padding: 8px 15px 16px;
    }

}
</style>
