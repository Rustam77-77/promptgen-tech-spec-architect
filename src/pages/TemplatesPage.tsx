import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Globe, ShoppingCart } from "lucide-react";
const STATIC_TEMPLATES = [
  {
    title: "Интернет-магазин",
    description: "Маркетплейс с корзиной, платежами и управлением запасами.",
    category: "Торговля",
    icon: ShoppingCart,
    presetData: JSON.stringify({
      appType: "E-Commerce Маркетплейс",
      audience: "Онлайн-покупатели и продавцы",
      goal: "Обеспечение безопасных транзакций и управления магазином",
      features: ["Авторизация пользователей", "Интеграция платежей", "Поиск и фильтрация"],
      designStyle: "Ориентированный на ритейл, доверительный стиль",
      techStack: "Next.js, Stripe, Convex",
    })
  },
  {
    title: "SaaS Дашборд",
    description: "Аналитический интерфейс с управлением командой.",
    category: "Бизнес",
    icon: Zap,
    presetData: JSON.stringify({
      appType: "B2B SaaS Аналитика",
      audience: "Менеджеры по операциям",
      goal: "Визуализация KPI и управление продуктивностью команды",
      features: ["Аналитическая панель", "Авторизация пользователей"],
      designStyle: "Минималистичный, оптимизированный под данные",
      techStack: "React, Recharts, Tailwind",
    })
  },
  {
    title: "Социальная сеть",
    description: "Ленты новостей, мессенджер и профили пользователей.",
    category: "Социальное",
    icon: Globe,
    presetData: JSON.stringify({
      appType: "Социальная платформа",
      audience: "Сообщества",
      goal: "Соединение пользователей через обмен контентом в реальном времени",
      features: ["Чат в реальном времени", "Загрузка файлов", "Лента соцсетей"],
      designStyle: "Яркий, вовлекающий интерфейс",
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Готовые шаблоны</h1>
          <p className="text-muted-foreground text-lg">Начните работу с профессионально подготовленных чертежей техзаданий.</p>
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
                  Начать с шаблона
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