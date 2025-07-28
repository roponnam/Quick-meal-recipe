// src/components/FavoritesList.tsx

import React from 'react';
import type { Recipe } from '../types'; // Import the interface
 // Import the interface

interface FavoritesListProps {
  favorites: Recipe[];
  onRemoveFavorite: (id: string) => void;
  onShowRecipe: (recipe: Recipe) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemoveFavorite, onShowRecipe }) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        You haven't favorited any recipes yet!
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
      <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Your Favorite Recipes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map(recipe => (
          <div key={recipe.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-32 h-32 object-cover rounded-full mb-3 shadow-sm"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/128x128/ADD8E6/333?text=${recipe.name.replace(/\s/g, '+')}`; }}
            />
            <p className="text-lg font-semibold text-gray-800 mb-2">{recipe.name}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => onShowRecipe(recipe)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                View Recipe
              </button>
              <button
                onClick={() => onRemoveFavorite(recipe.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;