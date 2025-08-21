import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, BarChart3, Target, TrendingUp, Award, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/nutrition-hero.jpg';

const Index = () => {
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
                  className="border-white text-white hover:bg-white hover:text-primary shadow-large font-semibold px-8 py-4 text-lg"
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
            <Card className="p-8 text-center shadow-medium hover:shadow-large transition-shadow bg-card-gradient">
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
            <Card className="p-8 text-center shadow-medium hover:shadow-large transition-shadow bg-card-gradient">
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
            <Card className="p-8 text-center shadow-medium hover:shadow-large transition-shadow bg-card-gradient">
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
