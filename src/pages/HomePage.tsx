import React, { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Copy, Save, Eye, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";
import { compilePrompt, PromptFormData } from "@/lib/prompt-compiler";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const FEATURE_OPTIONS = [
  "Авторизация пользователей",
  "Чат в реальном времени",
  "Загрузка файлов",
  "Интеграция платежей",
  "Аналитическая панель",
  "Push-уведомления",
  "Лента соцсетей",
  "Поиск и фильтрация",
];
export function HomePage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const location = useLocation();
  const presetData = useMemo(() => {
    if (!location.state?.presetData) return null;
    try {
      return JSON.parse(location.state.presetData);
    } catch (e) {
      console.error("Failed to parse preset data", e);
      return null;
    }
  }, [location.state?.presetData]);
  const { register, control, handleSubmit, setValue, getValues } = useForm<PromptFormData>({
    defaultValues: presetData || {
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
  const stableFormData = useMemo(() => ({
    appType: formData.appType,
    audience: formData.audience,
    goal: formData.goal,
    features: formData.features,
    designStyle: formData.designStyle,
    techStack: formData.techStack,
    extraRequirements: formData.extraRequirements,
  }), [
    formData.appType,
    formData.audience,
    formData.goal,
    formData.features,
    formData.designStyle,
    formData.techStack,
    formData.extraRequirements
  ]);
  const savePromptMutation = useMutation(api.prompts.savePrompt);
  const compiledPrompt = useMemo(() => {
    return compilePrompt(stableFormData);
  }, [stableFormData]);
  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    toast.success("Промпт скопирован!");
  };
  const onSave = async (data: PromptFormData) => {
    try {
      await savePromptMutation({
        title: `${data.appType || "Новый проект"} - ТЗ`,
        content: compiledPrompt,
        tags: [data.appType || "General", "Draft"].filter(Boolean),
        appType: data.appType || "General",
      });
      toast.success("Промпт сохранен в библиотеку!");
    } catch (error) {
      toast.error("Войдите в аккаунт, чтобы сохранить промпт.");
    }
  };
  const FormContent = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="md-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg">Детали приложения</CardTitle>
          <CardDescription>Введите базовую информацию о вашем проекте</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Тип приложения</Label>
            <Input {...register("appType")} className="h-12 rounded-xl" placeholder="напр. SaaS дашборд" />
          </div>
          <div className="space-y-2">
            <Label>Целевая аудитория</Label>
            <Input {...register("audience")} className="h-12 rounded-xl" placeholder="напр. геймеры или бухгалтеры" />
          </div>
          <div className="space-y-2">
            <Label>Основная цель</Label>
            <Textarea {...register("goal")} placeholder="Какую основную проблему решает продукт?" rows={3} className="rounded-xl resize-none" />
          </div>
        </CardContent>
      </Card>
      <Card className="md-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg">Функции и стек</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label>Ключевые функции</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURE_OPTIONS.map((feature) => (
                <div key={feature} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-accent/50 border border-transparent hover:border-border transition-all">
                  <Checkbox
                    id={feature}
                    checked={formData.features?.includes(feature)}
                    onCheckedChange={(checked) => {
                      const current = getValues("features") || [];
                      if (checked) setValue("features", [...current, feature]);
                      else setValue("features", current.filter(f => f !== feature));
                    }}
                    className="rounded-md"
                  />
                  <label htmlFor={feature} className="text-sm font-medium leading-none cursor-pointer flex-1">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Технологический стек</Label>
            <Input {...register("techStack")} className="h-12 rounded-xl" placeholder="React, Convex, Tailwind" />
          </div>
        </CardContent>
      </Card>
      <Button 
        onClick={handleSubmit(onSave)} 
        className="w-full h-14 text-base font-bold rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
      >
        <Save className="mr-2 h-5 w-5" /> Сохранить ТЗ
      </Button>
    </div>
  );
  const PreviewContent = (
    <div className={cn("lg:sticky lg:top-24 transition-all duration-300", isMobile ? "h-[calc(100vh-14rem)]" : "h-[calc(100vh-12rem)]")}>
      <Card className="bg-slate-950 border-slate-800 shadow-2xl overflow-hidden h-full flex flex-col rounded-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Live Output</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-400 hover:text-white hover:bg-white/10 h-8 rounded-lg">
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Копировать
            </Button>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={handleSubmit(onSave)} className="text-primary hover:text-primary-foreground hover:bg-primary h-8 rounded-lg">
                <Save className="h-3.5 w-3.5 mr-1.5" /> Сохранить
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="flex-1 p-5 font-mono text-xs md:text-sm text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap selection:bg-primary/30 selection:text-white">{compiledPrompt}</pre>
        </ScrollArea>
      </Card>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 md:py-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">v1.2 Stable</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter">Архитектор ТЗ</h1>
            <p className="text-muted-foreground mt-2 max-w-md">Создавайте профессиональные спецификации для ваших приложений за считанные секунды.</p>
          </div>
        </header>
        {isMobile ? (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-muted/50 p-1.5">
                <TabsTrigger value="edit" className="rounded-xl h-11 data-[state=active]:shadow-sm"><Edit3 className="w-4 h-4 mr-2" /> Параметры</TabsTrigger>
                <TabsTrigger value="preview" className="rounded-xl h-11 data-[state=active]:shadow-sm"><Eye className="w-4 h-4 mr-2" /> Результат</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="mt-4">
              {activeTab === "edit" ? FormContent : PreviewContent}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 xl:col-span-5">
              {FormContent}
            </div>
            <div className="lg:col-span-6 xl:col-span-7">
              {PreviewContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}