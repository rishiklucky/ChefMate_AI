const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: SchemaType = String, default: '' },
  unit: { type: String, default: '' },
  note: { type: String, default: '' },
  checked: { type: Boolean, default: false }
}, { _id: true });

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  temperatureC: { type: Number, default: null },
  heatLevel: { type: String, default: '' },
  timeMinutes: { type: Number, default: null },
  quantityDetails: { type: String, default: '' },
  visualCue: { type: String, default: '' }
}, { _id: true });

const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dishName: { type: String, required: true },
    servings: { type: Number, default: 2 },
    spiceLevel: { type: String, default: 'Medium' },
    cookingMethod: { type: String, default: 'Gas Stove' },
    totalTimeMinutes: { type: Number, default: 30 },
    prepTimeMinutes: { type: Number, default: 10 },
    cookTimeMinutes: { type: Number, default: 20 },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, default: '' },
        unit: { type: String, default: '' },
        note: { type: String, default: '' },
        checked: { type: Boolean, default: false },
      },
    ],
    equipment: [{ type: String }],
    steps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        instruction: { type: String, required: true },
        temperatureC: { type: Number, default: null },
        heatLevel: { type: String, default: '' },
        timeMinutes: { type: Number, default: null },
        quantityDetails: { type: String, default: '' },
        visualCue: { type: String, default: '' },
      },
    ],
    tips: [{ type: String }],
    commonMistakes: [{ type: String }],
    servingSuggestion: { type: String, default: '' },
    storageInstructions: { type: String, default: '' },
    nutritionNote: { type: String, default: '' },
    warnings: [{ type: String }],
    isSaved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
