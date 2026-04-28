import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Copy, Save } from "lucide-react";
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
    toast.success("Промпт скопирован в буфер обмена!");
  };
  const onSave = async (data: PromptFormData) => {
    if (!data) return;
    try {
      await savePrompt({
        title: `${data.appType || "Новый проект"} - ТЗ Промпт`,
        content: compiledPrompt,
        tags: [data.appType, "AI Generated"].filter(Boolean),
        appType: data.appType || "General",
      });
      toast.success("Промпт сохранен в вашу библиотеку!");
    } catch (error) {
      toast.error("Войдите в систему, чтобы сохранять промпты.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Архитектор техзаданий</h1>
          <p className="text-muted-foreground text-lg">Настройте параметры вашего приложения для создания качественных промптов для ИИ.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Детали приложения</CardTitle>
                <CardDescription>Что вы создаете сегодня?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Тип приложения</Label>
                  <Input {...register("appType")} placeholder="напр. SaaS дашборд, фитнес-приложение" />
                </div>
                <div className="space-y-2">
                  <Label>Целевая аудитория</Label>
                  <Input {...register("audience")} placeholder="напр. владельцы малого бизнеса, геймеры" />
                </div>
                <div className="space-y-2">
                  <Label>Основная цель</Label>
                  <Textarea {...register("goal")} placeholder="Какую проблему решает это приложение?" rows={2} />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Функции и стек</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Ключевые функции</Label>
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
                  <Label>Технологический стек</Label>
                  <Input {...register("techStack")} placeholder="напр. React, TypeScript, Convex" />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button onClick={handleSubmit(onSave)} className="flex-1 bg-primary text-primary-foreground h-12">
                <Save className="mr-2 h-4 w-4" /> Сохранить в библиотеку
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
                  <span className="text-xs font-mono text-slate-400 ml-2 uppercase tracking-wider">Предпросмотр промпта</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <Copy className="h-4 w-4 mr-2" /> Копировать
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