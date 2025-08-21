import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

interface WeeklyData {
  day: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  highestCalorieDay: string;
  totalDaysLogged: number;
}

const WeeklyDashboard = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = () => {
    const data: WeeklyData[] = [];
    const today = new Date();
    
    // Get last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Load data from localStorage
      const savedEntries = localStorage.getItem(`foodlog_${dateStr}`);
      let dayTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        dayTotals = entries.reduce(
          (acc: any, entry: any) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      }

      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        ...dayTotals
      });
    }

    setWeeklyData(data);
    calculateWeeklyStats(data);
  };

  const calculateWeeklyStats = (data: WeeklyData[]) => {
    const daysWithData = data.filter(day => day.calories > 0);
    const totalDaysLogged = daysWithData.length;

    if (totalDaysLogged === 0) {
      setWeeklyStats({
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        highestCalorieDay: 'None',
        totalDaysLogged: 0
      });
      return;
    }

    const totals = daysWithData.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const highestCalorieDay = daysWithData.reduce((prev, current) => 
      (prev.calories > current.calories) ? prev : current
    );

    setWeeklyStats({
      avgCalories: Math.round(totals.calories / totalDaysLogged),
      avgProtein: Math.round(totals.protein / totalDaysLogged),
      avgCarbs: Math.round(totals.carbs / totalDaysLogged),
      avgFat: Math.round(totals.fat / totalDaysLogged),
      highestCalorieDay: highestCalorieDay.day,
      totalDaysLogged
    });
  };

  const macroData = weeklyData.map(day => ({
    day: day.day,
    Protein: day.protein,
    Carbs: day.carbs,
    Fat: day.fat
  }));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Weekly Nutrition Overview</h1>
              </div>
              <p className="text-muted-foreground">Your nutrition journey over the past 7 days</p>
            </div>
          </div>
          <Button onClick={loadWeeklyData} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-soft bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Daily Calories</p>
                <p className="text-2xl font-bold text-nutrition-calories">
                  {weeklyStats?.avgCalories || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-nutrition-calories/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-nutrition-calories" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft bg-gradient-to-br from-card to-success/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Protein</p>
                <p className="text-2xl font-bold text-nutrition-protein">
                  {weeklyStats?.avgProtein || 0}g
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-nutrition-protein/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-nutrition-protein" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Carbs</p>
                <p className="text-2xl font-bold text-nutrition-carbs">
                  {weeklyStats?.avgCarbs || 0}g
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-nutrition-carbs/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-nutrition-carbs" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft bg-gradient-to-br from-card to-yellow-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Fat</p>
                <p className="text-2xl font-bold text-nutrition-fat">
                  {weeklyStats?.avgFat || 0}g
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-nutrition-fat/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-nutrition-fat" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Calorie Trend Chart */}
          <Card className="p-6 shadow-medium">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Daily Calorie Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="hsl(var(--calories))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--calories))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Macro Distribution Chart */}
          <Card className="p-6 shadow-medium">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Daily Macronutrients
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="Protein" fill="hsl(var(--protein))" />
                  <Bar dataKey="Carbs" fill="hsl(var(--carbs))" />
                  <Bar dataKey="Fat" fill="hsl(var(--fat))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="p-6 shadow-medium bg-primary/5">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Weekly Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-soft">
                <div className="w-2 h-2 rounded-full bg-nutrition-calories"></div>
                <span className="text-sm text-foreground">
                  <strong>Highest calorie day:</strong> {weeklyStats?.highestCalorieDay || 'None'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-soft">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-foreground">
                  <strong>Days logged:</strong> {weeklyStats?.totalDaysLogged || 0} out of 7
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-soft">
                <div className="w-2 h-2 rounded-full bg-nutrition-protein"></div>
                <span className="text-sm text-foreground">
                  <strong>Protein intake:</strong> {
                    (weeklyStats?.avgProtein || 0) > 50 ? 'Excellent consistency' : 
                    (weeklyStats?.avgProtein || 0) > 20 ? 'Good progress' : 'Room for improvement'
                  }
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-soft">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-sm text-foreground">
                  <strong>Consistency:</strong> {
                    (weeklyStats?.totalDaysLogged || 0) >= 5 ? 'Great tracking habit!' : 
                    (weeklyStats?.totalDaysLogged || 0) >= 3 ? 'Building momentum' : 'Keep logging daily'
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyDashboard;