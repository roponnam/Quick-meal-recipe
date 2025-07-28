// src/components/RecipeGenerator.tsx

import React, { useState } from 'react';
import type { FilterOptions } from '../types'; // Import the interface
 // Import the interface

interface RecipeGeneratorProps {
  onGenerate: (options: FilterOptions) => void;
  onShowFavorites: () => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onGenerate, onShowFavorites }) => {
  const [ingredients, setIngredients] = useState<string>('');
  const [dietary, setDietary] = useState<string>('Any');
  const [mealType, setMealType] = useState<string>('Dinner');

  const dietaryOptions: string[] = ['Any', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Quick', 'Healthy'];
  const mealTypeOptions: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ ingredients, dietary, mealType });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Next Meal!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">
            Ingredients I have (comma-separated):
          </label>
          <input
            type="text"
            id="ingredients"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, broccoli"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dietary" className="block text-gray-700 text-sm font-bold mb-2">
              Dietary Preference:
            </label>
            <select
              id="dietary"
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
            >
              {dietaryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mealType" className="block text-gray-700 text-sm font-bold mb-2">
              Meal Type:
            </label>
            <select
              id="mealType"
              className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              {mealTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            type="submit"
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            Generate Recipe Idea
          </button>
          <button
            type="button"
            onClick={onShowFavorites}
            className="flex-grow bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            View Favorites
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeGenerator;