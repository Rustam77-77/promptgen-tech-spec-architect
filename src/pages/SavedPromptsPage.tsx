import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Calendar, Layout, Info } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ru } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
export default function SavedPromptsPage() {
  const isMobile = useIsMobile();
  const prompts = useQuery(api.prompts.listSavedPrompts);
  const deletePromptMutation = useMutation(api.prompts.deletePrompt);
  const [search, setSearch] = useState("");
  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    return prompts.filter(p => {
      const searchLower = search.toLowerCase();
      const titleMatch = p.title?.toLowerCase().includes(searchLower);
      const tagMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(searchLower));
      return titleMatch || tagMatch;
    });
  }, [prompts, search]);
  const handleCopy = (content: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Промпт скопирован!");
  };
  const handleDelete = async (id: any) => {
    try {
      await deletePromptMutation({ id });
      toast.success("Запись удалена");
    } catch (e) {
      toast.error("Не удалось удалить запись");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Библиотека</h1>
            <p className="text-muted-foreground mt-1">История ваших технических спецификаций</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или тегам..."
              className="pl-11 h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {!prompts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-muted/50 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <Card className="border-2 border-dashed bg-muted/10 rounded-3xl py-16 flex flex-col items-center text-center px-6">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Layout className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">Библиотека пуста</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              {search ? "По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска." : "Вы еще не сохранили ни одного промпта. Создайте свою первую спецификацию в генераторе."}
            </p>
            {!search && (
              <Button asChild className="h-12 rounded-xl px-8">
                <Link to="/">Перейти к генератору</Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt._id} className="md-card flex flex-col group border-border/50 hover:border-primary/30 active:scale-[0.98] transition-all duration-300">
                <CardHeader className="pb-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold line-clamp-1 leading-tight">{prompt.title}</CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0 rounded-md">
                      {prompt.appType || "Web"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(prompt.createdAt, "d MMMM yyyy", { locale: ru })}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="bg-muted/30 p-3 rounded-xl border border-border/20 mb-4">
                    <p className="text-xs text-muted-foreground line-clamp-3 italic leading-relaxed">
                      {prompt.content.split('\n').find(l => l.length > 20) || prompt.content}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(prompt.tags) && prompt.tags.slice(0, 4).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/50 text-[10px] px-2 py-0 font-medium rounded-lg">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 gap-3">
                  <Button 
                    variant="default" 
                    className="flex-1 h-12 rounded-xl font-bold shadow-sm" 
                    onClick={() => handleCopy(prompt.content)}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Копировать
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" 
                    onClick={() => {
                      if (confirm("Вы уверены, что хотите удалить этот промпт?")) {
                        handleDelete(prompt._id);
                      }
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}