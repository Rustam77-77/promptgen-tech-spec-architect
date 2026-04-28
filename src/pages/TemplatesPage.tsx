import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, ArrowRight, Zap, Globe, MessageSquare, ShoppingCart, ShieldCheck } from "lucide-react";
const STATIC_TEMPLATES = [
  {
    title: "E-Commerce App",
    description: "Multi-vendor marketplace with cart, payments, and inventory.",
    category: "Commerce",
    icon: ShoppingCart,
    presetData: JSON.stringify({
      appType: "E-Commerce Marketplace",
      audience: "Online shoppers and vendors",
      goal: "Facilitate secure product transactions and store management",
      features: ["User Authentication", "Payment Integration", "Search & Filtering"],
      designStyle: "Retail-focused, high trust",
      techStack: "Next.js, Stripe, Convex",
    })
  },
  {
    title: "SaaS Dashboard",
    description: "Analytics-heavy interface with team management.",
    category: "Business",
    icon: Zap,
    presetData: JSON.stringify({
      appType: "B2B SaaS Analytics",
      audience: "Operations Managers",
      goal: "Visualize KPIs and manage team productivity",
      features: ["Analytics Dashboard", "User Authentication", "Analytics Dashboard"],
      designStyle: "Density-optimized, minimal",
      techStack: "React, Recharts, Tailwind",
    })
  },
  {
    title: "Social Networking",
    description: "Feeds, messaging, and user profiles.",
    category: "Social",
    icon: Globe,
    presetData: JSON.stringify({
      appType: "Social Media Platform",
      audience: "Community members",
      goal: "Connect users through real-time content sharing",
      features: ["Real-time Chat", "File Uploads", "Social Media Feed"],
      designStyle: "Vibrant, engagement-driven",
      techStack: "React Native, Node.js, WebSockets",
    })
  }
];
export default function TemplatesPage() {
  const navigate = useNavigate();
  const handleUseTemplate = (presetData: string) => {
    navigate("/", { state: { presetData } });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Preset Templates</h1>
          <p className="text-muted-foreground text-lg">Kickstart your technical spec with professionally curated blueprints.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STATIC_TEMPLATES.map((template) => (
            <Card key={template.title} className="group relative overflow-hidden hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <template.icon className="w-24 h-24" />
              </div>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <template.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full group/btn" 
                  onClick={() => handleUseTemplate(template.presetData)}
                >
                  Start with Template 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}