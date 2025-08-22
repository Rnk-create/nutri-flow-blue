import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, BarChart3, Target, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import heroImage from '@/assets/nutrition-hero.jpg';
import BMRCalculator from '@/components/BMRCalculator';

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
  totalDaysLogged: number;
}

const Index = () => {
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

    setWeeklyStats({
      avgCalories: Math.round(totals.calories / totalDaysLogged),
      avgProtein: Math.round(totals.protein / totalDaysLogged),
      avgCarbs: Math.round(totals.carbs / totalDaysLogged),
      avgFat: Math.round(totals.fat / totalDaysLogged),
      totalDaysLogged
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative container max-w-6xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Track Your Meals.<br />
              <span className="text-primary-light">Stay on Goal.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Simple, clear nutrition tracking for everyday health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/food-log">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-blue-50 shadow-large font-semibold px-8 py-4 text-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Log My Meals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/weekly-dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary shadow-large font-semibold px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Weekly Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to track nutrition
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From daily logging to weekly insights, NutriTrack makes healthy eating simple and sustainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300 bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Simple Food Logging
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Just type what you ate in plain English. Our system understands "2 eggs and toast" 
                and automatically calculates calories and macros.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300 bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Daily Nutrition Tracking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                See your calories, protein, carbs, and fat intake update in real-time. 
                Perfect for maintaining your health goals.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300 bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60">
              <div className="w-16 h-16 rounded-full bg-nutrition-carbs/20 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-nutrition-carbs" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Weekly Insights
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed charts and analytics showing your nutrition patterns, 
                trends, and areas for improvement over time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* BMR Calculator Section */}
      <BMRCalculator />

      {/* Weekly Dashboard Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Weekly Progress
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your nutrition journey with real-time insights and beautiful analytics
            </p>
          </div>

          {/* Weekly Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/40 transition-all duration-300">
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

            <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/40 transition-all duration-300">
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

            <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/40 transition-all duration-300">
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

            <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20 hover:bg-white/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days Logged</p>
                  <p className="text-2xl font-bold text-primary">
                    {weeklyStats?.totalDaysLogged || 0}/7
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-medium bg-white/40 backdrop-blur-md border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  7-Day Calorie Trend
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
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="hsl(var(--calories))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--calories))', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: 'hsl(var(--calories))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card className="p-6 shadow-soft bg-white/30 backdrop-blur-md border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/food-log" className="block">
                    <Button 
                      className="w-full justify-start bg-primary hover:bg-primary-dark text-white"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Log Today's Food
                    </Button>
                  </Link>
                  <Link to="/weekly-dashboard" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/30 hover:bg-primary/10"
                      size="sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Full Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-4 shadow-soft bg-gradient-to-br from-success/10 to-primary/10 backdrop-blur-md border border-white/20">
                <div className="text-center">
                  <Award className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    {weeklyStats?.totalDaysLogged === 7 ? 'Perfect Week!' : 
                     weeklyStats && weeklyStats.totalDaysLogged >= 5 ? 'Great Progress!' : 
                     'Keep Logging!'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {weeklyStats?.totalDaysLogged || 0} days logged this week
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2 Minutes</div>
              <div className="text-lg text-muted-foreground">Average logging time per meal</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-nutrition-protein">95%</div>
              <div className="text-lg text-muted-foreground">Nutrition data accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-nutrition-calories">7 Days</div>
              <div className="text-lg text-muted-foreground">To build a healthy tracking habit</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <Award className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Start tracking today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who've transformed their eating habits with simple, 
              effective nutrition tracking.
            </p>
            <div className="pt-4">
              <Link to="/food-log">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark shadow-medium font-semibold px-8 py-4 text-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Start Logging Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
