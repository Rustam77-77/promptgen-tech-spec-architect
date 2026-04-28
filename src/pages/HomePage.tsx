import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Wand2, Copy, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { compilePrompt, PromptFormData } from "@/lib/prompt-compiler";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
const FEATURE_OPTIONS = [
  "User Authentication",
  "Real-time Chat",
  "File Uploads",
  "Payment Integration",
  "Analytics Dashboard",
  "Push Notifications",
  "Social Media Feed",
  "Search & Filtering",
];
export function HomePage() {
  const location = useLocation();
  const presetData = location.state?.presetData;
  const { register, control, handleSubmit, setValue, getValues } = useForm<PromptFormData>({
    defaultValues: presetData ? JSON.parse(presetData) : {
      appType: "",
      audience: "",
      goal: "",
      features: [],
      designStyle: "",
      techStack: "",
      extraRequirements: "",
    },
  });
  const formData = useWatch({ control });
  const savePrompt = useMutation(api.prompts.savePrompt);
  const compiledPrompt = useMemo(() => {
    return compilePrompt(formData as PromptFormData);
  }, [formData]);
  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    toast.success("Prompt copied to clipboard!");
  };
  const onSave = async (data: PromptFormData) => {
    try {
      await savePrompt({
        title: `${data.appType || "New Project"} Spec Prompt`,
        content: compiledPrompt,
        tags: [data.appType, "AI Generated"].filter(Boolean),
        appType: data.appType,
      });
      toast.success("Prompt saved to your library!");
    } catch (error) {
      toast.error("Sign in to save prompts.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Tech Spec Architect</h1>
          <p className="text-muted-foreground text-lg">Configure your application parameters to generate high-fidelity LLM prompts.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>What are you building today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>App Type</Label>
                  <Input {...register("appType")} placeholder="e.g. SaaS Dashboard, Mobile Fitness App" />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input {...register("audience")} placeholder="e.g. Small business owners, Gen Z gamers" />
                </div>
                <div className="space-y-2">
                  <Label>Core Goal</Label>
                  <Textarea {...register("goal")} placeholder="What problem does this solve?" rows={2} />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Features & Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Key Features</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {FEATURE_OPTIONS.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          onCheckedChange={(checked) => {
                            const current = getValues("features") || [];
                            if (checked) setValue("features", [...current, feature]);
                            else setValue("features", current.filter(f => f !== feature));
                          }}
                        />
                        <label htmlFor={feature} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <Input {...register("techStack")} placeholder="e.g. Next.js, Tailwind, Convex" />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button onClick={handleSubmit(onSave)} className="flex-1 bg-primary text-primary-foreground h-12">
                <Save className="mr-2 h-4 w-4" /> Save to Library
              </Button>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <Card className="bg-slate-950 border-slate-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2 uppercase tracking-wider">Live Prompt Preview</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6 font-mono text-sm leading-relaxed text-slate-300">
                <pre className="whitespace-pre-wrap">{compiledPrompt}</pre>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}