import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Lightbulb, CheckCircle, ShieldCheck, Sparkles, UserCircle, Search, MessageSquare, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Post Jobs Easily",
      description: "Describe your project needs and budget in a simple form. Connect with qualified designers quickly.",
      link: "/post-job",
      linkText: "Post Your Job",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Discover Top Talent",
      description: "Browse profiles of skilled designers, view their portfolios, and find the perfect match for your project.",
      link: "/designers",
      linkText: "Find Designers",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "AI-Powered Matching",
      description: "Our smart system suggests relevant designers based on your job requirements and their skills.",
      link: "#",
      linkText: "Learn More",
    },
     {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "AI Bid Summaries",
      description: "Understand designer proposals faster with AI-generated summaries, ranked for your convenience.",
      link: "#",
      linkText: "Explore Features",
    }
  ];

  const howItWorksSteps = [
    { title: "Sign Up", description: "Create your account as a client or a designer.", icon: <UserCircle className="h-8 w-8 text-accent" /> },
    { title: "Post or Find", description: "Clients post job requirements. Designers showcase profiles and find projects.", icon: <Search className="h-8 w-8 text-accent" /> },
    { title: "Connect", description: "Utilize our matching or apply directly. Communicate and collaborate.", icon: <MessageSquare className="h-8 w-8 text-accent" /> },
    { title: "Achieve", description: "Complete your project successfully with the right talent.", icon: <Award className="h-8 w-8 text-accent" /> },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-secondary rounded-lg shadow-md">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-primary">
            Connect. Create. Conquer.
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
            WebConnect is your premier platform for finding expert web designers or showcasing your design prowess.
            Effortless job posting, intelligent matching, and AI-powered insights.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/post-job">Client</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
              <Link href="/designer/setup-profile">Web Professional</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose WebConnect?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="link" asChild className="text-primary p-0">
                     <Link href={feature.link}>{feature.linkText} &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full py-16 lg:py-24 bg-secondary rounded-lg shadow-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md">
                <div className="p-3 bg-accent/10 rounded-full mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder Section */}
      <section className="w-full py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Trusted by Professionals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Image data-ai-hint="person avatar" src={`https://picsum.photos/seed/${i+10}/50/50`} alt="User testimonial" width={50} height={50} className="rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-foreground">User {i}</p>
                      <p className="text-sm text-muted-foreground">{i % 2 === 0 ? "Happy Client" : "Talented Designer"}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "WebConnect made it incredibly easy to find {i % 2 === 0 ? "a skilled designer for my project" : "exciting new projects"}. The platform is intuitive and the AI features are a game-changer!"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 lg:py-24 bg-primary text-primary-foreground rounded-lg shadow-md">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Web Project?</h2>
          <p className="text-lg max-w-xl mx-auto mb-8">
            Join WebConnect today and experience a seamless way to connect, collaborate, and create amazing web experiences.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
             <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/pricing">Explore Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
