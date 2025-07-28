// src/App.tsx
import React, { useState, useEffect } from 'react';
import RecipeGenerator from './components/RecipeGenerator';
import RecipeDisplay from './components/RecipeDisplay';
import FavoritesList from './components/FavoritesList';
import './index.css'; // Your Tailwind CSS import
import type { Recipe, FilterOptions } from './types'; // Import interfaces
 // Import interfaces

function App() {
  // --- API Configuration (Using TheMealDB for easier demo) ---
  const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'; // TheMealDB base URL
  // TheMealDB does not require API keys for basic search
  const API_SEARCH_ENDPOINT = '/search.php?s='; // Search by meal name
  const API_RANDOM_ENDPOINT = '/random.php'; // Get a random meal

  // Edamam API configuration (commented out)
  // const EDAMAM_APP_ID = 'bf2eea18';
  // const EDAMAM_APP_KEY = '8760d97c11848ffdd4874b60e9bec036';
  // const API_ENDPOINT = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [showFavoritesView, setShowFavoritesView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const fetchRecipes = async (options: FilterOptions) => {
    setIsLoading(true);
    setError(null);
    setCurrentRecipe(null);

    let url = `${API_BASE_URL}${API_RANDOM_ENDPOINT}`; // Default to random if no ingredients
    if (options.ingredients) {
      url = `${API_BASE_URL}${API_SEARCH_ENDPOINT}${options.ingredients}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('TheMealDB API Response:', data);

      const fetchedRecipes: Recipe[] = [];
      if (data.meals && data.meals.length > 0) {
        // TheMealDB returns an array of meals
        data.meals.forEach((meal: any) => {
          // Basic mapping for TheMealDB
          const ingredients: string[] = [];
          for (let i = 1; i <= 20; i++) { // TheMealDB has up to 20 ingredients
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
              ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
            }
          }

          fetchedRecipes.push({
            id: meal.idMeal,
            name: meal.strMeal,
            ingredients: ingredients,
            instructions: meal.strInstructions,
            dietary: meal.strCategory ? [meal.strCategory] : [], // TheMealDB has category, not specific dietary labels
            mealType: meal.strCategory ? [meal.strCategory] : [], // Reusing category for mealType for simplicity
            image: meal.strMealThumb,
            sourceUrl: meal.strSource, // This property will now be allowed by the updated interface
            preparationMethods: [ // Basic placeholder for preparation methods
                { method: 'Stovetop', temp: 'Medium', time: 'Varies by recipe', notes: 'Follow instructions carefully.' },
                { method: 'Oven', temp: '350°F (175°C)', time: 'Varies by recipe', notes: 'Check doneness regularly.' }
            ]
          });
        });
      }

      setAllRecipes(fetchedRecipes);
      if (fetchedRecipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * fetchedRecipes.length);
        setCurrentRecipe(fetchedRecipes[randomIndex]);
      } else {
        setCurrentRecipe(null);
        alert('No recipes found matching your criteria. Try different filters!');
      }

    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes from TheMealDB. Try a different search term or check network.');
      setCurrentRecipe(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes({ ingredients: '', dietary: 'Any', mealType: 'Dinner' }); // Initial fetch with default
  }, []);

  const handleFavoriteRecipe = (recipeToFavorite: Recipe) => {
    if (!favorites.some(fav => fav.id === recipeToFavorite.id)) {
      setFavorites([...favorites, recipeToFavorite]);
    }
  };

  const handleDislikeRecipe = (recipeToDislike: Recipe) => {
    fetchRecipes({
      ingredients: (document.getElementById('ingredients') as HTMLInputElement)?.value || '',
      dietary: (document.getElementById('dietary') as HTMLSelectElement)?.value || 'Any',
      mealType: (document.getElementById('mealType') as HTMLSelectElement)?.value || 'Dinner'
    });
  };

  const handleRemoveFavorite = (idToRemove: string) => {
    setFavorites(favorites.filter(fav => fav.id !== idToRemove));
  };

  const handleShowRecipeFromFavorites = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setShowFavoritesView(false);
  };

  return (
    <div className="min-h-screen font-inter antialiased flex flex-col"
         style={{
           backgroundImage: `url('https://placehold.co/1920x1080/F5F5DC/6B8E23?text=Kitchen+Background')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed',
           backgroundColor: '#F5F5DC'
         }}>
      <header className="bg-orange-600 text-white p-4 shadow-md fixed w-full z-10 rounded-b-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">What's for Dinner?</h1>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 pt-20">
        <div className="max-w-3xl mx-auto">
          {showFavoritesView ? (
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavorite}
              onShowRecipe={handleShowRecipeFromFavorites}
            />
          ) : (
            <>
              <RecipeGenerator
                onGenerate={fetchRecipes}
                onShowFavorites={() => setShowFavoritesView(true)}
              />
              {isLoading && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
                  Loading recipes...
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}
              {!isLoading && !error && currentRecipe ? (
                <RecipeDisplay
                  recipe={currentRecipe}
                  onFavorite={handleFavoriteRecipe}
                  onDislike={handleDislikeRecipe}
                  isFavorite={favorites.some(fav => fav.id === currentRecipe.id)}
                />
              ) : (!isLoading && !error && !currentRecipe && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
                  No recipes found for your criteria. Try different filters!
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      <footer className="bg-orange-800 text-white p-4 text-center text-sm rounded-t-lg mt-8">
        &copy; {new Date().getFullYear()} What's for Dinner? App.
      </footer>
    </div>
  );
}

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const styleTag = document.createElement('style');
styleTag.innerHTML = `
  body {
    font-family: 'Inter', sans-serif;
  }
`;
document.head.appendChild(styleTag);

export default App;