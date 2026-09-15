<template>
    <div class="recipe-container">
        <div class="collection-header">
            <div><span class="collection-label">RECIPES</span>
                <h2>Your Collection</h2>
            </div>
            <button class="add-button" type="button" aria-label="Add recipe" @click="openAddSheet"><ion-icon
                    :icon="addOutline" /></button>
        </div>

        <div class="search-box">
            <ion-icon :icon="searchOutline" /><input v-model="searchQuery" type="text"
                placeholder="Search recipes..." />
        </div>

        <div v-if="filteredRecipes.length" class="recipe-grid">
            <article v-for="item in filteredRecipes" :key="item.id" class="recipe-card" @click="openDetails(item)">
                <div v-if="item.imageBase64" class="recipe-image"><img :src="item.imageBase64" :alt="item.recipeName" />
                </div>
                <div v-else class="recipe-image recipe-image-placeholder"><ion-icon :icon="restaurantOutline" /></div>
                <div class="recipe-card-body">
                    <div class="card-top"><span class="category-tag">{{ item.category }}</span><span
                            class="time-note"><ion-icon :icon="timeOutline" />{{ item.preparationTime }}</span></div>
                    <h3>{{ item.recipeName }}</h3>
                    <p class="preview">{{ firstLine(item.ingredients) }}</p>
                    <div class="view-row"><span>View Recipe</span><ion-icon :icon="chevronForwardOutline" /></div>
                </div>
            </article>
        </div>

        <div v-else class="empty-state">
            <div class="empty-icon"><ion-icon :icon="restaurantOutline" /></div>
            <h3>{{ searchQuery ? 'No matching recipes' : 'The box is empty' }}</h3>
            <p>{{ searchQuery ? 'Try another recipe name or category.' : 'Tap + to add the first recipe.' }}</p>
        </div>

        <Teleport to="body">
            <Transition name="sheet-fade">
                <div v-if="sheetOpen" class="sheet-overlay" @click.self="closeSheet">
                    <div class="bottom-sheet" role="dialog" aria-modal="true">
                        <div class="sheet-handle"></div>

                        <template v-if="sheetMode === 'add' || sheetMode === 'edit'">
                            <div class="sheet-header">
                                <div><span class="sheet-eyebrow">{{ sheetMode === 'edit' ? 'EDIT RECIPE' : 'NEW RECIPE'
                                        }}</span>
                                    <h2>{{ sheetMode === 'edit' ? 'Edit Recipe' : 'Add a Recipe' }}</h2>
                                </div>
                                <button class="close-button" type="button" aria-label="Close"
                                    @click="closeSheet"><ion-icon :icon="closeOutline" /></button>
                            </div>

                            <form class="recipe-form" @submit.prevent="saveRecipe">
                                <div class="image-upload">
                                    <div v-if="recipe.imageBase64" class="image-preview">
                                        <img :src="recipe.imageBase64" alt="Recipe preview" />
                                        <button type="button" class="remove-image" aria-label="Remove image"
                                            @click="removeImage"><ion-icon :icon="closeOutline" /></button>
                                    </div>
                                    <label v-else class="upload-box">
                                        <input ref="imageInput" type="file" accept="image/*"
                                            @change="handleImageUpload" />
                                        <ion-icon :icon="cameraOutline" /><strong>Add Recipe Image</strong><span>JPG,
                                            PNG or WEBP</span>
                                    </label>
                                </div>

                                <div class="form-field"><label>Recipe name</label><ion-item lines="none"><ion-icon
                                            slot="start" :icon="restaurantOutline" /><ion-input
                                            v-model="recipe.recipeName" color="dark" placeholder="What are you cooking?"
                                            required /></ion-item></div>
                                <div class="form-row">
                                    <div class="form-field"><label>Category</label><ion-item lines="none"><ion-icon
                                                slot="start" :icon="gridOutline" /><ion-input v-model="recipe.category"
                                                color="dark" placeholder="Main, dessert, soup..." required /></ion-item>
                                    </div>
                                    <div class="form-field"><label>Prep time</label><ion-item lines="none"><ion-icon
                                                slot="start" :icon="timeOutline" /><ion-input
                                                v-model="recipe.preparationTime" color="dark" placeholder="30 minutes"
                                                required /></ion-item></div>
                                </div>
                                <div class="form-field"><label>Ingredients</label><ion-item lines="none"><ion-icon
                                            slot="start" :icon="listOutline" /><ion-textarea
                                            v-model="recipe.ingredients" color="dark"
                                            placeholder="List ingredients, one per line..." :auto-grow="true"
                                            required /></ion-item></div>
                                <div class="form-field"><label>Instructions</label><ion-item lines="none"><ion-icon
                                            slot="start" :icon="documentTextOutline" /><ion-textarea
                                            v-model="recipe.instructions" color="dark"
                                            placeholder="Write the cooking method..." :auto-grow="true"
                                            required /></ion-item></div>
                                <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
                                <button class="save-button" type="submit" :disabled="saving"><ion-icon
                                        :icon="editingId ? saveOutline : addOutline" />{{ saving ? 'Saving...' :
                                            editingId ? 'Update Recipe' : 'Save Recipe' }}</button>
                            </form>
                        </template>

                        <template v-else-if="sheetMode === 'details' && selectedRecipe">
                            <div class="sheet-header">
                                <div><span class="sheet-eyebrow">RECIPE</span>
                                    <h2>{{ selectedRecipe.recipeName }}</h2>
                                </div>
                                <button class="close-button" type="button" aria-label="Close"
                                    @click="closeSheet"><ion-icon :icon="closeOutline" /></button>
                            </div>
                            <div class="detail-content">
                                <div v-if="selectedRecipe.imageBase64" class="detail-image"><img
                                        :src="selectedRecipe.imageBase64" :alt="selectedRecipe.recipeName" /></div>
                                <div class="detail-meta"><span class="category-tag">{{ selectedRecipe.category
                                        }}</span><span><ion-icon :icon="timeOutline" />{{ selectedRecipe.preparationTime
                                        }}</span></div>
                                <section class="detail-section">
                                    <h3><ion-icon :icon="listOutline" />Ingredients</h3>
                                    <p class="multiline">{{ selectedRecipe.ingredients }}</p>
                                </section>
                                <section class="detail-section">
                                    <h3><ion-icon :icon="documentTextOutline" />Instructions</h3>
                                    <p class="multiline">{{ selectedRecipe.instructions }}</p>
                                </section>
                                <p class="owner-note">{{ isOwner(selectedRecipe) ? 'You shared this recipe.' :
                                    'Sharedby another recipe contributor.' }}</p>
                                <div v-if="isOwner(selectedRecipe)" class="detail-actions">
                                    <button class="edit-action" type="button"
                                        @click="openEdit(selectedRecipe)"><ion-icon
                                            :icon="createOutline" />Edit</button>
                                    <button class="delete-action" type="button"
                                        @click="openDelete(selectedRecipe)"><ion-icon
                                            :icon="trashOutline" />Delete</button>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="sheetMode === 'delete' && selectedRecipe">
                            <div class="confirm-content">
                                <div class="delete-icon"><ion-icon :icon="trashOutline" /></div>
                                <h2>Delete this recipe?</h2>
                                <p>This will permanently remove <strong>{{ selectedRecipe.recipeName }}</strong>.</p>
                                <div class="confirm-actions"><button class="cancel-action" type="button"
                                        @click="openDetails(selectedRecipe)">Cancel</button><button
                                        class="delete-action" type="button" :disabled="saving" @click="confirmDelete">{{
                                            saving ? 'Deleting...' : 'Delete' }}</button></div>
                            </div>
                        </template>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IonIcon, IonInput, IonItem, IonTextarea } from '@ionic/vue'
import { addOutline, cameraOutline, chevronForwardOutline, closeOutline, createOutline, documentTextOutline, gridOutline, listOutline, restaurantOutline, saveOutline, searchOutline, timeOutline, trashOutline } from 'ionicons/icons'
//// Import Firebase Realtime Database functions.
import { get, onValue, push, ref as firebaseRef, remove, set, update } from 'firebase/database'
// Import the Firebase database configuration.
import { database } from '../firebase'

// Defines the structure of a recipe and the data it can contain.
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
    updatedAt?: number
}

// Defines the different states of the recipe bottom sheet.
type SheetMode =
    | 'none'
    | 'add'
    | 'edit'
    | 'details'
    | 'delete'


// Stores the recipe data, form state, selected recipe,
// loading state, and other UI states used by the component.
const recipes = ref<Recipe[]>([])
const searchQuery = ref('')
const sheetOpen = ref(false)
const sheetMode = ref<SheetMode>('none')
const selectedRecipe = ref<Recipe | null>(null)
const editingId = ref<string | null>(null)
const saving = ref(false)
const errorMessage = ref('')
const imageInput = ref<HTMLInputElement | null>(null)


// Stores the values entered in the Add/Edit Recipe form.
const recipe = ref({
    recipeName: '',
    category: '',
    ingredients: '',
    instructions: '',
    preparationTime: '',
    imageBase64: ''
})


// References the recipes location in Firebase Realtime Database.
const recipesReference = firebaseRef(database, 'recipes')

// Stores the Firebase realtime listener unsubscribe function.
let unsubscribeRecipes: (() => void) | undefined

// Creates or retrieves a local owner ID used to identify
// recipes created from the current browser/device.
const ownerKey = 'recipe_collection_owner_id'

const getOwnerId = () => {
    let id = localStorage.getItem(ownerKey)

    if (!id) {
        id = `owner_${crypto.randomUUID()}`
        localStorage.setItem(ownerKey, id)
    }

    return id
}

const currentOwnerId = getOwnerId()



const filteredRecipes = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()

    // MY COLLECTION:
    // Only show recipes created by the current user.
    const myRecipes = recipes.value.filter(
        (recipe) => recipe.createdBy === currentOwnerId
    )

    // Search only within the current user's recipes.
    if (!q) {
        return myRecipes
    }

    return myRecipes.filter(
        (recipe) =>
            recipe.recipeName.toLowerCase().includes(q) ||
            recipe.category.toLowerCase().includes(q)
    )
})




// Converts raw Firebase recipe data into the format
// expected by the application.
const normalizeRecipe = (
    id: string,
    d: any
): Recipe => ({
    id,
    recipeName: d?.recipeName || '',
    category: d?.category || '',
    ingredients: d?.ingredients || '',
    instructions: d?.instructions || '',
    preparationTime: d?.preparationTime || '',
    imageBase64:
        d?.imageBase64 ||
        d?.imageUrl ||
        '',
    createdBy: d?.createdBy || '',
    createdAt: Number(d?.createdAt || 0),
    updatedAt: Number(d?.updatedAt || 0)
})


// Updates the local recipe list using the latest
// data received from Firebase.
const applySnapshot = (snapshot: any) => {
    if (!snapshot.exists()) {
        recipes.value = []
        return
    }

    const data = snapshot.val()

    recipes.value = Object.keys(data)
        .map((id) =>
            normalizeRecipe(id, data[id])
        )
        .sort(
            (a, b) =>
                (b.createdAt || 0) -
                (a.createdAt || 0)
        )
}


// Loads the current recipes from Firebase.
const loadRecipes = async () => {
    try {
        applySnapshot(
            await get(recipesReference)
        )
    } catch (e) {
        console.error(e)
        errorMessage.value =
            'Unable to load recipes.'
    }
}


// Clears the recipe form and resets the editing state.
const resetForm = () => {
    recipe.value = {
        recipeName: '',
        category: '',
        ingredients: '',
        instructions: '',
        preparationTime: '',
        imageBase64: ''
    }

    editingId.value = null
    errorMessage.value = ''

    if (imageInput.value) {
        imageInput.value.value = ''
    }
}


// Opens the bottom sheet for creating a new recipe.
const openAddSheet = () => {
    resetForm()
    selectedRecipe.value = null
    sheetMode.value = 'add'
    sheetOpen.value = true
}


// Opens the bottom sheet and displays the selected recipe's details.
const openDetails = (item: Recipe) => {
    selectedRecipe.value = item
    editingId.value = null
    errorMessage.value = ''
    sheetMode.value = 'details'
    sheetOpen.value = true
}


// Checks whether the selected recipe was created
// by the current browser/device.
const isOwner = (item: Recipe) => {
    return Boolean(
        item.createdBy &&
        item.createdBy === currentOwnerId
    )
}


// Opens the edit form for a recipe owned by the current user.
const openEdit = (item: Recipe) => {
    if (!isOwner(item)) {
        return
    }

    selectedRecipe.value = item
    editingId.value = item.id

    recipe.value = {
        recipeName: item.recipeName,
        category: item.category,
        ingredients: item.ingredients,
        instructions: item.instructions,
        preparationTime: item.preparationTime,
        imageBase64: item.imageBase64 || ''
    }

    errorMessage.value = ''
    sheetMode.value = 'edit'
    sheetOpen.value = true
}


// Opens the delete confirmation for a recipe
// owned by the current user.
const openDelete = (item: Recipe) => {
    if (!isOwner(item)) {
        return
    }

    selectedRecipe.value = item
    sheetMode.value = 'delete'
    sheetOpen.value = true
}


// Closes the bottom sheet and clears its current state.
const closeSheet = () => {
    sheetOpen.value = false
    sheetMode.value = 'none'
    selectedRecipe.value = null
    editingId.value = null
    errorMessage.value = ''
}


// Converts an uploaded image into a resized Base64 image
// before it is stored in Firebase.
const resizeImageToBase64 = (
    file: File
): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            const image = new Image()

            image.onload = () => {
                const max = 1200
                const scale = Math.min(
                    1,
                    max / Math.max(
                        image.width,
                        image.height
                    )
                )

                const canvas =
                    document.createElement('canvas')

                canvas.width = Math.max(
                    1,
                    Math.round(image.width * scale)
                )

                canvas.height = Math.max(
                    1,
                    Math.round(image.height * scale)
                )

                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    return reject(
                        new Error(
                            'Canvas is not supported.'
                        )
                    )
                }

                ctx.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )

                resolve(
                    canvas.toDataURL(
                        'image/jpeg',
                        0.78
                    )
                )
            }

            image.onerror = () =>
                reject(
                    new Error('Invalid image.')
                )

            image.src = String(reader.result)
        }

        reader.onerror = () =>
            reject(
                reader.error ||
                new Error('File read failed.')
            )

        reader.readAsDataURL(file)
    })


// Validates the selected image, processes it,
// and stores it as Base64 for the recipe.
const handleImageUpload = async (
    event: Event
) => {
    const input =
        event.target as HTMLInputElement

    const file = input.files?.[0]

    if (!file) {
        return
    }

    if (!file.type.startsWith('image/')) {
        errorMessage.value =
            'Please select an image file.'
        return
    }

    if (file.size > 8 * 1024 * 1024) {
        errorMessage.value =
            'Image is too large. Please choose an image under 8 MB.'
        return
    }

    try {
        recipe.value.imageBase64 =
            await resizeImageToBase64(file)

        errorMessage.value = ''
    } catch (e) {
        console.error(e)

        errorMessage.value =
            'Unable to process the selected image.'
    }
}


// Removes the selected image from the recipe form.
const removeImage = () => {
    recipe.value.imageBase64 = ''

    if (imageInput.value) {
        imageInput.value.value = ''
    }
}


// Creates a new recipe or updates an existing recipe
// in Firebase after validating the required fields.
const saveRecipe = async () => {
    errorMessage.value = ''

    if (
        !recipe.value.recipeName.trim() ||
        !recipe.value.category.trim() ||
        !recipe.value.ingredients.trim() ||
        !recipe.value.instructions.trim() ||
        !recipe.value.preparationTime.trim()
    ) {
        errorMessage.value =
            'Please fill in all required fields.'

        return
    }

    saving.value = true

    try {
        const now = Date.now()

        if (editingId.value) {
            const existing = recipes.value.find(
                (x) => x.id === editingId.value
            )

            if (
                !existing ||
                !isOwner(existing)
            ) {
                throw new Error(
                    'You can only edit recipes you created.'
                )
            }

            await update(
                firebaseRef(
                    database,
                    `recipes/${editingId.value}`
                ),
                {
                    recipeName:
                        recipe.value.recipeName.trim(),

                    category:
                        recipe.value.category.trim(),

                    ingredients:
                        recipe.value.ingredients.trim(),

                    instructions:
                        recipe.value.instructions.trim(),

                    preparationTime:
                        recipe.value.preparationTime.trim(),

                    imageBase64:
                        recipe.value.imageBase64 || '',

                    updatedAt: now
                }
            )
        } else {
            const r = push(
                recipesReference
            )

            await set(r, {
                recipeName:
                    recipe.value.recipeName.trim(),

                category:
                    recipe.value.category.trim(),

                ingredients:
                    recipe.value.ingredients.trim(),

                instructions:
                    recipe.value.instructions.trim(),

                preparationTime:
                    recipe.value.preparationTime.trim(),

                imageBase64:
                    recipe.value.imageBase64 || '',

                createdBy: currentOwnerId,
                createdAt: now,
                updatedAt: now
            })
        }

        closeSheet()
    } catch (e) {
        console.error(e)

        errorMessage.value =
            e instanceof Error
                ? e.message
                : 'Unable to save recipe.'
    } finally {
        saving.value = false
    }
}


// Deletes the selected recipe from Firebase
// after confirming that the current user owns it.
const confirmDelete = async () => {
    if (
        !selectedRecipe.value ||
        !isOwner(selectedRecipe.value)
    ) {
        return
    }

    saving.value = true

    try {
        await remove(
            firebaseRef(
                database,
                `recipes/${selectedRecipe.value.id}`
            )
        )

        closeSheet()
    } catch (e) {
        console.error(e)

        errorMessage.value =
            'Unable to delete this recipe.'
    } finally {
        saving.value = false
    }
}


// Returns the first non-empty ingredient line
// for displaying a short ingredient preview.
const firstLine = (text: string) => {
    return (
        text
            .split('\n')
            .map((x) => x.trim())
            .find(Boolean) ||
        'No ingredients listed.'
    )
}


// Closes the bottom sheet when the Escape key is pressed.
const handleEscape = (
    e: KeyboardEvent
) => {
    if (
        e.key === 'Escape' &&
        sheetOpen.value
    ) {
        closeSheet()
    }
}


// Loads recipes, starts realtime Firebase updates,
// and registers the keyboard event when the component loads.
onMounted(() => {
    loadRecipes()

    unsubscribeRecipes = onValue(
        recipesReference,
        applySnapshot,
        (e) =>
            console.error(
                'Realtime recipe listener error:',
                e
            )
    )

    window.addEventListener(
        'keydown',
        handleEscape
    )
})


// Removes Firebase and keyboard listeners
// when the component is destroyed.
onUnmounted(() => {
    unsubscribeRecipes?.()

    window.removeEventListener(
        'keydown',
        handleEscape
    )
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');

.recipe-container {
    --card: #fff;
    --ink: #351219;
    --soft: #806d72;
    --burgundy: #741f2e;
    --line: #eadfe0;
    width: 100%;
    color: var(--ink);
    font-family: Inter, sans-serif
}

.collection-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px
}

.collection-label {
    display: block;
    margin-bottom: 4px;
    color: #8b3442;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px
}

.collection-header h2 {
    margin: 0;
    color: var(--ink);
    font-size: 24px;
    font-weight: 800
}

.add-button {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border: 0;
    border-radius: 50%;
    background: var(--burgundy);
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 25px;
    box-shadow: 0 6px 18px rgba(116, 31, 46, .25);
    cursor: pointer;
    position: relative;
    z-index: 2
}

.add-button ion-icon {
    color: #fff;
    font-size: 25px
}

.search-box {
    height: 46px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 13px;
    margin-bottom: 16px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: #fff
}

.search-box ion-icon {
    color: #927f84;
    font-size: 18px
}

.search-box input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 13px
}

.search-box input::placeholder {
    color: #a49499
}

.recipe-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px
}

.recipe-card {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 15px;
    background: var(--card);
    box-shadow: 0 7px 22px rgba(70, 18, 28, .07);
    cursor: pointer;
    transition: .18s
}

.recipe-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(70, 18, 28, .11)
}

.recipe-image {
    width: 100%;
    aspect-ratio: 16/9;
    background: #efe6e8
}

.recipe-image img,
.detail-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover
}

.recipe-image-placeholder {
    display: grid;
    place-items: center;
    color: #a56c78
}

.recipe-image-placeholder ion-icon {
    font-size: 34px
}

.recipe-card-body {
    padding: 12px
}

.card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px
}

.category-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 8px;
    background: #f8e9ec;
    color: var(--burgundy);
    font-size: 9px;
    font-weight: 800;
    text-transform: capitalize
}

.time-note {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--soft);
    font-size: 9px;
    white-space: nowrap
}

.time-note ion-icon {
    font-size: 12px
}

.recipe-card h3 {
    margin: 10px 0 5px;
    color: var(--ink);
    font-family: Fraunces, serif;
    font-size: 17px;
    line-height: 1.12
}

.preview {
    min-height: 30px;
    margin: 0;
    color: var(--soft);
    font-size: 10px;
    line-height: 1.5
}

.view-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    margin-top: 10px;
    padding-top: 9px;
    border-top: 1px solid #f0e8e9;
    color: var(--burgundy);
    font-size: 10px;
    font-weight: 800
}

.view-row ion-icon {
    font-size: 14px
}

.empty-state {
    padding: 48px 20px;
    text-align: center;
    color: var(--soft)
}

.empty-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 12px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f4e4e7;
    color: var(--burgundy)
}

.empty-icon ion-icon {
    font-size: 27px
}

.empty-state h3 {
    margin: 0 0 6px;
    color: var(--ink);
    font-size: 17px
}

.empty-state p {
    margin: 0;
    font-size: 12px
}

.sheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(18, 15, 17, .58);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px)
}

.bottom-sheet {
    width: min(760px, 100%);
    max-height: min(88vh, 820px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 12px 20px calc(24px + env(safe-area-inset-bottom));
    border-radius: 26px 26px 0 0;
    background: #fff;
    color: #351219;
    box-shadow: 0 -12px 40px rgba(0, 0, 0, .18);
    position: relative;
    z-index: 100000
}

.sheet-handle {
    width: 42px;
    height: 5px;
    margin: 0 auto 14px;
    border-radius: 999px;
    background: #cfc4c7
}

.sheet-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px
}

.sheet-eyebrow {
    display: block;
    margin-bottom: 3px;
    color: #963746;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px
}

.sheet-header h2 {
    margin: 0;
    color: #351219;
    font-family: Fraunces, serif;
    font-size: 25px;
    line-height: 1.1
}

.close-button {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 50%;
    background: #f4e8ea;
    color: var(--burgundy);
    display: grid;
    place-items: center;
    font-size: 20px;
    cursor: pointer
}

.close-button ion-icon {
    color: var(--burgundy)
}

.recipe-form {
    display: flex;
    flex-direction: column;
    gap: 14px
}

.upload-box,
.image-preview {
    position: relative;
    width: 100%;
    min-height: 155px;
    overflow: hidden;
    border-radius: 15px;
    box-sizing: border-box
}

.upload-box {
    border: 1.5px dashed #d8bfc4;
    background: #fcf7f8;
    color: var(--burgundy);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer
}

.upload-box input {
    display: none
}

.upload-box ion-icon {
    font-size: 30px;
    color: var(--burgundy)
}

.upload-box strong {
    color: var(--burgundy);
    font-size: 13px
}

.upload-box span {
    color: var(--soft);
    font-size: 10px
}

.image-preview img {
    width: 100%;
    height: 100%;
    min-height: 155px;
    display: block;
    object-fit: cover
}

.remove-image {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, .94);
    color: #b51f2e;
    display: grid;
    place-items: center;
    cursor: pointer
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px
}

.form-field label {
    display: block;
    margin: 0 0 6px 3px;
    color: #4d252c;
    font-size: 11px;
    font-weight: 800
}

.form-field ion-item {
    --background: #faf7f7;
    --color: #351219;
    --border-color: transparent;
    --padding-start: 11px;
    --inner-padding-end: 10px;
    --highlight-color-focused: #8a2a39;
    min-height: 48px;
    border: 1px solid #eadcde;
    border-radius: 11px
}

.form-field ion-item:focus-within {
    border-color: #8a2a39;
    background: #fff
}

.form-field ion-icon {
    color: #8a2a39;
    font-size: 18px;
    margin-right: 7px
}

.form-field ion-input,
.form-field ion-textarea {
    --color: #351219;
    --placeholder-color: #9b8b90;
    --placeholder-opacity: 1;
    color: #351219;
    font-size: 13px
}

.form-field ion-input::part(native),
.form-field ion-textarea::part(native) {
    color: #351219;
    caret-color: #741f2e
}

.form-error {
    margin: 0;
    padding: 9px 11px;
    border-radius: 9px;
    background: #fff0f1;
    color: #a61d2e;
    font-size: 11px
}

.save-button,
.edit-action,
.delete-action,
.cancel-action {
    min-height: 46px;
    border: 0;
    border-radius: 11px;
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer
}

.save-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: #23845f;
    color: #fff
}

.save-button ion-icon {
    color: #fff
}

.save-button:disabled,
.delete-action:disabled {
    opacity: .6;
    cursor: wait
}

.detail-image {
    overflow: hidden;
    margin: 0 -20px 16px;
    max-height: 290px;
    aspect-ratio: 16/8;
    background: #f2e7e9
}

.detail-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    color: var(--soft);
    font-size: 11px
}

.detail-meta>span:last-child {
    display: flex;
    align-items: center;
    gap: 4px
}

.detail-section {
    padding: 15px 0;
    border-top: 1px solid #eee4e6
}

.detail-section h3 {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 9px;
    color: var(--ink);
    font-size: 14px
}

.detail-section h3 ion-icon {
    color: var(--burgundy)
}

.detail-section p {
    margin: 0;
    color: #6d5e63;
    font-size: 12px;
    line-height: 1.7
}

.multiline {
    white-space: pre-line
}

.owner-note {
    margin: 4px 0 14px;
    color: #907e84;
    font-size: 10px;
    text-align: center
}

.detail-actions,
.confirm-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px
}

.edit-action,
.delete-action,
.cancel-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px
}

.edit-action {
    background: #f3f6f7;
    color: #3f5962
}

.delete-action {
    background: #e92d3c;
    color: #fff
}

.cancel-action {
    background: #f0ebec;
    color: #654e54
}

.delete-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: #ffe9eb;
    color: #e92d3c;
    display: grid;
    place-items: center;
    font-size: 28px
}

.confirm-content {
    padding: 25px 8px 12px;
    text-align: center
}

.confirm-content h2 {
    margin: 0 0 8px;
    color: var(--ink);
    font-family: Fraunces, serif;
    font-size: 24px
}

.confirm-content p {
    margin: 0 auto 22px;
    max-width: 330px;
    color: var(--soft);
    font-size: 12px;
    line-height: 1.6
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
    transition: opacity .2s
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
    opacity: 0
}

@media(max-width:600px) {
    .recipe-grid {
        grid-template-columns: 1fr
    }

    .form-row {
        grid-template-columns: 1fr
    }

    .bottom-sheet {
        width: 100%;
        max-height: 91vh;
        padding-left: 14px;
        padding-right: 14px
    }

    .detail-image {
        margin-left: -14px;
        margin-right: -14px
    }

    .sheet-header h2 {
        font-size: 22px
    }
}
</style>
