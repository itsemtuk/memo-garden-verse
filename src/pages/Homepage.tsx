
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Users, Palette, Zap, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleGetStarted = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  };

  const features = [
    {
      icon: <Palette className="w-8 h-8 text-garden-primary" />,
      title: "Visual Organization",
      description: "Create beautiful cork boards with notes, images, and widgets arranged exactly how you want them."
    },
    {
      icon: <Users className="w-8 h-8 text-garden-secondary" />,
      title: "Real-time Collaboration",
      description: "Work together with others in real-time. See live cursors and changes as they happen."
    },
    {
      icon: <Zap className="w-8 h-8 text-garden-accent" />,
      title: "Smart Widgets",
      description: "Add weather, plants, shopping lists, timers and more to make your boards truly functional."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-garden-note via-garden-corkLight to-garden-image">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            {/* Navigation */}
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start p-6">
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <h1 className="text-2xl font-bold text-garden-text">🌱 MemoGarden</h1>
                </div>
              </div>
              <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/explore")}
                  className="text-garden-text hover:text-garden-primary"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explore
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth")}
                  className="text-garden-text hover:text-garden-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-garden-primary hover:bg-garden-primary-dark text-white"
                >
                  Get Started
                </Button>
              </div>
            </nav>

            {/* Hero Content */}
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-garden-text sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Cultivate your ideas in a</span>{' '}
                  <span className="block text-garden-primary xl:inline">digital garden</span>
                </h1>
                <p className="mt-3 text-base text-garden-textSecondary sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create beautiful, collaborative cork boards where your thoughts can grow. 
                  Organize notes, images, and smart widgets in your own digital garden space.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium bg-garden-primary hover:bg-garden-primary-dark text-white md:py-4 md:text-lg md:px-10"
                    >
                      Start Growing <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/explore")}
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium border-garden-primary text-garden-primary hover:bg-garden-primary hover:text-white md:py-4 md:text-lg md:px-10"
                    >
                      <Search className="mr-2 w-5 h-5" />
                      Explore Gardens
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90"
            src="https://images.unsplash.com/photo-1558051815-0f18e64e6280?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cork board with notes and ideas"
          />
          <div className="absolute inset-0 bg-garden-primary bg-opacity-10"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-garden-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-garden-text sm:text-4xl">
              Everything you need to organize beautifully
            </p>
            <p className="mt-4 max-w-2xl text-xl text-garden-textSecondary lg:mx-auto">
              MemoGarden combines the visual appeal of a cork board with modern digital collaboration tools.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                    isHovered === feature.title ? 'ring-2 ring-garden-primary' : ''
                  }`}
                  onMouseEnter={() => setIsHovered(feature.title)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-garden-text mb-2">{feature.title}</h3>
                    <p className="text-garden-textSecondary">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-garden-corkLight bg-opacity-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-garden-text sm:text-4xl">
              Loved by creators everywhere
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "MemoGarden has transformed how I organize my projects. It's like having a digital cork board that actually works!",
                author: "Sarah Chen",
                role: "Designer"
              },
              {
                quote: "The real-time collaboration is amazing. My team can brainstorm visually and see ideas come together instantly.",
                author: "Marcus Rodriguez",
                role: "Product Manager"
              },
              {
                quote: "Finally, a tool that combines beauty with functionality. My boards are both organized and gorgeous.",
                author: "Emily Thompson",
                role: "Writer"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-garden-textSecondary mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-garden-text">{testimonial.author}</p>
                    <p className="text-sm text-garden-textSecondary">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-garden-primary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start growing?</span>
            <span className="block">Create your first garden today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-garden-primary-light">
            Join thousands of creators who are organizing their ideas beautifully with MemoGarden.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="mt-8 w-full sm:w-auto bg-white text-garden-primary hover:bg-gray-100 px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
