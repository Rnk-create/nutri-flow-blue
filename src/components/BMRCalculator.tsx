import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target, TrendingDown, TrendingUp } from 'lucide-react';

interface BMRResults {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  bulking: number;
}

const BMRCalculator = () => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [results, setResults] = useState<BMRResults | null>(null);

  const activityFactors = {
    sedentary: 1.2,
    lightly: 1.375,
    moderately: 1.55,
    very: 1.725,
    super: 1.9
  };

  const calculateBMR = () => {
    if (!age || !gender || !weight || !height || !activityLevel) {
      return;
    }

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Mifflin-St Jeor formula
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const activityFactor = activityFactors[activityLevel as keyof typeof activityFactors];
    const maintenance = bmr * activityFactor;

    setResults({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      weightLoss: Math.round(maintenance - 500),
      bulking: Math.round(maintenance + 500)
    });
  };

  const resetCalculator = () => {
    setAge('');
    setGender('');
    setWeight('');
    setHeight('');
    setActivityLevel('');
    setResults(null);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/10 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            BMR & Calorie Calculator
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your Basal Metabolic Rate and daily calorie needs based on your activity level
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="p-8 shadow-medium bg-white/40 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Enter Your Details</h3>
            </div>

            <div className="space-y-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-white/60 border-white/30 focus:border-primary"
                />
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="text-sm cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-sm cursor-pointer">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white/60 border-white/30 focus:border-primary"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-white/60 border-white/30 focus:border-primary"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="bg-white/60 border-white/30 focus:border-primary">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="lightly">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="super">Super Active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={calculateBMR}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white"
                  disabled={!age || !gender || !weight || !height || !activityLevel}
                >
                  Calculate BMR
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetCalculator}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Basal Metabolic Rate</p>
                      <p className="text-2xl font-bold text-primary">
                        {results.bmr} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Calories burned at rest
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Maintenance Calories</p>
                      <p className="text-2xl font-bold text-nutrition-calories">
                        {results.maintenance} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        To maintain current weight
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-nutrition-calories/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-nutrition-calories" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Weight Loss</p>
                      <p className="text-2xl font-bold text-destructive">
                        {results.weightLoss} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For 1 lb/week loss (-500 cal)
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Muscle Gain</p>
                      <p className="text-2xl font-bold text-success">
                        {results.bulking} cal/day
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For muscle building (+500 cal)
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 shadow-soft bg-white/20 backdrop-blur-sm border border-white/20 text-center">
                <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Calculate?
                </h3>
                <p className="text-muted-foreground">
                  Fill in your details on the left to see your personalized calorie recommendations.
                </p>
              </Card>
            )}
          </div>
        </div>

        {results && (
          <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="text-lg font-semibold text-foreground mb-3">Understanding Your Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="mb-2">
                  <strong>BMR:</strong> The calories your body burns at rest for basic functions like breathing and circulation.
                </p>
                <p>
                  <strong>Maintenance:</strong> Total daily calories needed to maintain your current weight based on your activity level.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Weight Loss:</strong> A 500-calorie deficit typically results in 1 lb of weight loss per week.
                </p>
                <p>
                  <strong>Muscle Gain:</strong> A 500-calorie surplus supports muscle growth when combined with strength training.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BMRCalculator;