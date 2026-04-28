import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Calendar, Tags as TagIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ru } from "date-fns/locale";
export default function SavedPromptsPage() {
  const prompts = useQuery(api.prompts.listSavedPrompts);
  const deletePrompt = useMutation(api.prompts.deletePrompt);
  const [search, setSearch] = useState("");
  const filteredPrompts = prompts?.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Промпт скопирован!");
  };
  const handleDelete = async (id: any) => {
    if (confirm("Вы уверены, что хотите удалить этот промпт?")) {
      await deletePrompt({ id });
      toast.success("Промпт удален.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Сохраненная библиотека</h1>
            <p className="text-muted-foreground">Управляйте вашими сгенерированными промптами для техзаданий.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск промптов или тегов..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {!prompts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : filteredPrompts?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Промпты не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts?.map((prompt) => (
              <Card key={prompt._id} className="group hover:shadow-md transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold line-clamp-1">{prompt.title}</CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{prompt.appType}</Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(prompt.createdAt, "d MMM yyyy", { locale: ru })}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 italic">
                    {prompt.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {prompt.tags.map(tag => (
                      <div key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
                        <TagIcon className="h-2 w-2" /> {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/50 gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleCopy(prompt.content)}>
                    <Copy className="h-3.5 w-3.5 mr-2" /> Скопировать
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(prompt._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
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