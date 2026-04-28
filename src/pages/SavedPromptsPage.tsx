import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Calendar, Tags as TagIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ru } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
export default function SavedPromptsPage() {
  const isMobile = useIsMobile();
  const prompts = useQuery(api.prompts.listSavedPrompts);
  const deletePromptMutation = useMutation(api.prompts.deletePrompt);
  const [search, setSearch] = useState("");
  const filteredPrompts = prompts?.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Скопировано!");
  };
  const handleDelete = async (id: any) => {
    if (confirm("Удалить этот промпт?")) {
      await deletePromptMutation({ id });
      toast.success("Удалено.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 md:py-10">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Библиотека</h1>
            <p className="text-muted-foreground text-sm">Ваши сохраненные спецификации</p>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-9 h-12 rounded-xl bg-muted/50 border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {!prompts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : filteredPrompts?.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed flex flex-col items-center">
            <Search className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Ничего не найдено</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts?.map((prompt) => (
              <Card key={prompt._id} className="md-card flex flex-col group active:scale-[0.98] transition-transform">
                <CardHeader className="pb-3 space-y-1">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-bold line-clamp-1">{prompt.title}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{prompt.appType}</Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Calendar className="h-3 w-3" />
                    {format(prompt.createdAt, "d MMM yyyy", { locale: ru })}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic mb-3">
                    {prompt.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t gap-2 flex">
                  <Button variant="default" size={isMobile ? "lg" : "sm"} className="flex-1 h-11" onClick={() => handleCopy(prompt.content)}>
                    <Copy className="h-4 w-4 mr-2" /> Копировать
                  </Button>
                  <Button variant="ghost" size={isMobile ? "lg" : "sm"} className="h-11 w-11 p-0 text-destructive" onClick={() => handleDelete(prompt._id)}>
                    <Trash2 className="h-4 w-4" />
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