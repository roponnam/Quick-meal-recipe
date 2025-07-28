export interface PreparationMethod { // NEW interface for preparation methods
    method: string;
    temp: string;
    time: string;
    notes?: string; // Optional notes
  }
  
  export interface Recipe {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string;
    dietary: string[]; // e.g., ['Vegetarian', 'Healthy']
    mealType: string[]; // e.g., ['Dinner', 'Lunch']
    image: string;
    preparationMethods?: PreparationMethod[]; // NEW optional array of preparation methods
    sourceUrl?: string; // Added sourceUrl to Recipe interface
  }
  
  export interface FilterOptions {
    ingredients: string;
    dietary: string;
    mealType: string;
  }