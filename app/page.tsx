import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Apple,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Utensils,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Apple className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CaloriTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Track Your Nutrition,
            <span className="text-primary"> The Smart Way</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            India's first calorie tracker with intelligent meal grading.
            Track calories, balance macros, and achieve your health goals.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">
            Powerful features to help you reach your nutrition goals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Indian Food Database</h3>
              <p className="text-muted-foreground text-sm">
                Track aloo paratha, dosa, biryani and more. Built for Indian meals.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Meal Grading</h3>
              <p className="text-muted-foreground text-sm">
                Get A-D grades based on macro balance. Know instantly if your meal is healthy.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Beautiful Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Charts, trends, and insights. Track your progress over time.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-orange-100 w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Goals</h3>
              <p className="text-muted-foreground text-sm">
                Set your own calorie and macro targets. Personalized for you.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Streaks</h3>
              <p className="text-muted-foreground text-sm">
                Build consistency. Track your daily logging streak.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-yellow-100 w-12 h-12 flex items-center justify-center mb-4">
                <Apple className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
              <p className="text-muted-foreground text-sm">
                Simple, clean interface. Log meals in seconds.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Get started in 3 simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Add Your Foods</h3>
            <p className="text-muted-foreground">
              Build your personal database with your favorite Indian dishes
            </p>
          </div>

          <div className="text-center">
            <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Log Your Meals</h3>
            <p className="text-muted-foreground">
              Track what you eat and get instant grades on meal balance
            </p>
          </div>

          <div className="text-center">
            <div className="rounded-full bg-primary text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              View analytics, charts, and reach your health goals
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why CaloriTrack?</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Built for Indian Food</h3>
                <p className="text-muted-foreground">
                  Unlike other apps, we understand aloo paratha, dosa, biryani, and more. Track your authentic meals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Focus on Balance, Not Just Calories</h3>
                <p className="text-muted-foreground">
                  Our grading system helps you understand meal quality, not just quantity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Free Forever</h3>
                <p className="text-muted-foreground">
                  No hidden fees, no premium plans. All features available to everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your data is yours. We never sell your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-primary rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join hundreds of users tracking their nutrition the smart way
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Apple className="h-6 w-6 text-primary" />
              <span className="font-semibold">CaloriTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CaloriTrack. Built with ❤️ for better nutrition.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}