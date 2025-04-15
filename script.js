const apiKey = 'f4915e660f324beb9ea6ccdeaa04c744';
const findRecipesButton = document.getElementById('find-recipes');
const ingredientInput = document.getElementById('ingredient-input');
const recipeList = document.getElementById('recipe-list');

async function fetchRecipes(ingredients) {
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const recipes = await response.json();

        recipeList.innerHTML = recipes.length
            ? ''
            : '<p>No recipes found for the given ingredients.</p>';

        if (recipes.length) {
            displayRecipes(recipes);
        }
    } catch (error) {
        recipeList.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
        console.error(error);
    }
}

async function fetchRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

async function displayRecipes(recipes) {
    for (const recipe of recipes) {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const toggleBtn = document.createElement('button');
        toggleBtn.classList.add('toggle-button');
        toggleBtn.textContent = 'Show Recipe Steps';

        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('steps-container');

        toggleBtn.onclick = async () => {
            if (stepsContainer.style.display === 'none' || stepsContainer.style.display === '') {
                const details = await fetchRecipeDetails(recipe.id);
                stepsContainer.innerHTML = `
                    <h4>Instructions:</h4>
                    <p>${details.instructions || 'No steps available.'}</p>
                `;
                stepsContainer.style.display = 'block';
                toggleBtn.textContent = 'Hide Recipe Steps';
            } else {
                stepsContainer.style.display = 'none';
                toggleBtn.textContent = 'Show Recipe Steps';
            }
        };

        recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <p>Used: ${recipe.usedIngredientCount}, Missing: ${recipe.missedIngredientCount}</p>
                <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">View Full Recipe</a>
            </div>
        `;

        recipeCard.appendChild(toggleBtn);
        recipeCard.appendChild(stepsContainer);
        recipeList.appendChild(recipeCard);
    }
}

findRecipesButton.addEventListener('click', () => {
    const ingredients = ingredientInput.value.trim().replace(/\s+/g, ',');
    if (ingredients) {
        fetchRecipes(ingredients);
    } else {
        recipeList.innerHTML = '<p>Please enter some ingredients.</p>';
    }
});
