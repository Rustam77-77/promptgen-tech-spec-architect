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
  const savePromptMutation = useMutation(api.prompts.savePrompt);
  const compiledPrompt = useMemo(() => {
    return compilePrompt(formData as PromptFormData);
  }, [formData]);
  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    toast.success("Промпт скопирован!");
  };
  const onSave = async (data: PromptFormData) => {
    try {
      await savePromptMutation({
        title: `${data.appType || "Новый проект"} - ТЗ`,
        content: compiledPrompt,
        tags: [data.appType, "Mobile"].filter(Boolean),
        appType: data.appType || "General",
      });
      toast.success("Промпт сохранен!");
    } catch (error) {
      toast.error("Войдите, чтобы сохранить.");
    }
  };
  const FormContent = (
    <div className="space-y-6">
      <Card className="md-card">
        <CardHeader>
          <CardTitle>Детали приложения</CardTitle>
          <CardDescription>Введите базовую информацию</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Тип приложения</Label>
            <Input {...register("appType")} className="h-12" placeholder="напр. SaaS дашборд" />
          </div>
          <div className="space-y-2">
            <Label>Целевая аудитория</Label>
            <Input {...register("audience")} className="h-12" placeholder="напр. геймеры" />
          </div>
          <div className="space-y-2">
            <Label>Основная цель</Label>
            <Textarea {...register("goal")} placeholder="Какую проблему решает?" rows={3} />
          </div>
        </CardContent>
      </Card>
      <Card className="md-card">
        <CardHeader>
          <CardTitle>Функции и стек</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Ключевые функции</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURE_OPTIONS.map((feature) => (
                <div key={feature} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent touch-target">
                  <Checkbox
                    id={feature}
                    onCheckedChange={(checked) => {
                      const current = getValues("features") || [];
                      if (checked) setValue("features", [...current, feature]);
                      else setValue("features", current.filter(f => f !== feature));
                    }}
                  />
                  <label htmlFor={feature} className="text-sm font-medium leading-none">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Технологический стек</Label>
            <Input {...register("techStack")} className="h-12" placeholder="React, Convex, Tailwind" />
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSubmit(onSave)} className="w-full h-14 text-base font-semibold md-card ripple-effect">
        <Save className="mr-2 h-5 w-5" /> Сохранить в библиотеку
      </Button>
    </div>
  );
  const PreviewContent = (
    <div className={cn("lg:sticky lg:top-24", isMobile && "h-[calc(100vh-12rem)]")}>
      <Card className="bg-slate-950 border-slate-800 shadow-xl overflow-hidden h-full flex flex-col rounded-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Предпросмотр</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-400 hover:text-white">
            <Copy className="h-4 w-4 mr-2" /> Копировать
          </Button>
        </div>
        <ScrollArea className="flex-1 p-6 font-mono text-sm text-slate-300">
          <pre className="whitespace-pre-wrap">{compiledPrompt}</pre>
        </ScrollArea>
      </Card>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 md:py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Архитектор ТЗ</h1>
          <p className="text-muted-foreground mt-1">Оптимизировано для Android & Web</p>
        </header>
        {isMobile ? (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
                <TabsTrigger value="edit" className="rounded-lg h-10"><Edit3 className="w-4 h-4 mr-2" /> Редактор</TabsTrigger>
                <TabsTrigger value="preview" className="rounded-lg h-10"><Eye className="w-4 h-4 mr-2" /> Просмотр</TabsTrigger>
              </TabsList>
            </Tabs>
            {activeTab === "edit" ? FormContent : PreviewContent}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {FormContent}
            {PreviewContent}
          </div>
        )}
      </div>
    </div>
  );
}