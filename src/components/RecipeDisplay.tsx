// src/components/RecipeDisplay.tsx

import React from 'react';
import type { Recipe } from '../types'; // Import the interface
 // Import the interface

interface RecipeDisplayProps {
  recipe: Recipe | null; // Can be null if no recipe generated yet
  onFavorite: (recipe: Recipe) => void;
  onDislike: (recipe: Recipe) => void;
  isFavorite: boolean;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onFavorite, onDislike, isFavorite }) => {
  if (!recipe) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
        Click "Generate Recipe Idea" to get started!
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
      <h3 className="text-3xl font-bold text-blue-700 mb-4 text-center">{recipe.name}</h3>
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-64 object-cover object-center rounded-lg mb-4 shadow-sm"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/600x400/ADD8E6/333?text=${recipe.name.replace(/\s/g, '+')}`; }}
      />
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-2">Ingredients:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-2">Instructions:</p>
        {/* Edamam often provides a URL for instructions, so link to it if available */}
        {recipe.sourceUrl ? (
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View full instructions here
          </a>
        ) : (
          <p className="text-gray-600 leading-relaxed">{recipe.instructions}</p>
        )}
      </div>

      {/* NEW: Display Preparation Methods */}
      {recipe.preparationMethods && recipe.preparationMethods.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-700 font-semibold mb-2">Preparation Methods:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {recipe.preparationMethods.map((method, index) => (
              <li key={index}>
                <strong>{method.method}:</strong> {method.temp ? `Temp: ${method.temp}, ` : ''}
                Time: {method.time}{method.notes ? ` (${method.notes})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => onFavorite(recipe)}
          className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 ${
            isFavorite ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-700 hover:bg-yellow-400'
          }`}
        >
          {isFavorite ? '★ Favorited' : '☆ Favorite'}
        </button>
        <button
          onClick={() => onDislike(recipe)}
          className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-colors duration-200"
        >
          Dislike
        </button>
      </div>
    </div>
  );
};

export default RecipeDisplay;