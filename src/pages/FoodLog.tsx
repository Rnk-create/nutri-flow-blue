import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, RotateCcw, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FoodEntry {
  id: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
}

interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FoodLog = () => {
  const [mealInput, setMealInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState<DailyTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load today's entries from localStorage
    const savedEntries = localStorage.getItem(`foodlog_${today}`);
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      setTodayEntries(entries);
      calculateTotals(entries);
    }
  }, [today]);

  const calculateTotals = (entries: FoodEntry[]) => {
    const totals = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setDailyTotals(totals);
  };

  // Mock parser function - in real app this would call backend API
  const parseFoodEntry = async (foodText: string): Promise<Omit<FoodEntry, 'id' | 'timestamp'>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock nutrition data per unit
    const mockNutritionData: { [key: string]: any } = {
      'egg': { calories: 78, protein: 6, carbs: 1, fat: 5 },
      'rice': { calories: 130, protein: 3, carbs: 28, fat: 0.3 }, // per cup
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, // per 100g
      'banana': { calories: 89, protein: 1, carbs: 23, fat: 0.3 },
      'bread': { calories: 79, protein: 3, carbs: 14, fat: 1 } // per slice
    };

    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    // Enhanced parsing logic to handle quantities
    const text = foodText.toLowerCase();
    const words = text.split(/\s+/);
    
    // Extract numbers and food items
    Object.keys(mockNutritionData).forEach(food => {
      const foodRegex = new RegExp(`\\b\\d*\\s*\\w*\\s*${food}s?\\b`, 'i');
      const match = text.match(foodRegex);
      
      if (match) {
        // Extract quantity from the match
        const quantityMatch = match[0].match(/\b(\d+(?:\.\d+)?)\b/);
        const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
        
        const nutrition = mockNutritionData[food];
        totalNutrition.calories += nutrition.calories * quantity;
        totalNutrition.protein += nutrition.protein * quantity;
        totalNutrition.carbs += nutrition.carbs * quantity;
        totalNutrition.fat += nutrition.fat * quantity;
      }
    });

    // If no matches found, provide default values
    if (totalNutrition.calories === 0) {
      totalNutrition = { calories: 150, protein: 8, carbs: 20, fat: 5 };
    }

    return {
      food: foodText,
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein),
      carbs: Math.round(totalNutrition.carbs),
      fat: Math.round(totalNutrition.fat)
    };
  };

  const addMeal = async () => {
    if (!mealInput.trim()) return;
    
    setIsLoading(true);
    try {
      const nutritionData = await parseFoodEntry(mealInput);
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        ...nutritionData,
        timestamp: new Date()
      };

      const updatedEntries = [...todayEntries, newEntry];
      setTodayEntries(updatedEntries);
      calculateTotals(updatedEntries);
      
      // Save to localStorage
      localStorage.setItem(`foodlog_${today}`, JSON.stringify(updatedEntries));
      
      setMealInput('');
      toast({
        title: "Meal added successfully!",
        description: `${nutritionData.food} - ${nutritionData.calories} calories`
      });
    } catch (error) {
      toast({
        title: "Error adding meal",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const startNewDay = () => {
    setTodayEntries([]);
    setDailyTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    localStorage.removeItem(`foodlog_${today}`);
    toast({
      title: "New day started!",
      description: "Your food log has been reset for today."
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Daily Food Log</h1>
          </div>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8 bg-card-gradient shadow-soft">
          <div className="flex gap-4">
            <Input
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="Enter your meal, e.g., 2 boiled eggs and 1 cup rice"
              className="flex-1 border-2 border-primary/20 focus:border-primary"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && addMeal()}
            />
            <Button 
              onClick={addMeal}
              disabled={isLoading || !mealInput.trim()}
              variant="default"
              className="bg-primary hover:bg-primary-dark transition-colors shadow-soft"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add to Log
            </Button>
          </div>
        </Card>

        {/* Food Entries Table */}
        <Card className="mb-8 shadow-medium">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
              {todayEntries.length > 0 && (
                <Button 
                  onClick={startNewDay}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start New Day
                </Button>
              )}
            </div>

            {todayEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No meals logged today. Add your first meal above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-foreground">Food Item</th>
                      <th className="text-right py-3 px-2 font-medium text-nutrition-calories">Calories</th>
                      <th className="text-right py-3 px-2 font-medium text-nutrition-protein">Protein (g)</th>
                      <th className="text-right py-3 px-2 font-medium text-nutrition-carbs">Carbs (g)</th>
                      <th className="text-right py-3 px-2 font-medium text-nutrition-fat">Fat (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/50">
                        <td className="py-3 px-2 text-foreground">{entry.food}</td>
                        <td className="py-3 px-2 text-right font-medium text-nutrition-calories">{entry.calories}</td>
                        <td className="py-3 px-2 text-right font-medium text-nutrition-protein">{entry.protein}</td>
                        <td className="py-3 px-2 text-right font-medium text-nutrition-carbs">{entry.carbs}</td>
                        <td className="py-3 px-2 text-right font-medium text-nutrition-fat">{entry.fat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Daily Totals */}
        {todayEntries.length > 0 && (
          <Card className="p-6 shadow-medium bg-primary/5">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Daily Totals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <div className="text-2xl font-bold text-nutrition-calories">{dailyTotals.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <div className="text-2xl font-bold text-nutrition-protein">{dailyTotals.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <div className="text-2xl font-bold text-nutrition-carbs">{dailyTotals.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card shadow-soft">
                <div className="text-2xl font-bold text-nutrition-fat">{dailyTotals.fat}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FoodLog;