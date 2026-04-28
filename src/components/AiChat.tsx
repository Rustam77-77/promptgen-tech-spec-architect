import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation, useAction, useConvexAuth } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Send, Settings, Trash2, Plus, Menu, MessageSquare, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
export function AiChat() {
  const isMobile = useIsMobile();
  const [selectedThreadId, setSelectedThreadId] = useState<Id<"chatThreads"> | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThreadListOpen, setIsThreadListOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("Вы — опытный архитектор программного обеспечения и продакт-менеджер. Отвечайте только на русском языке.");
  const [threadTitle, setThreadTitle] = useState("Новый чат");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useConvexAuth();
  const threads = useQuery(api.aiChat.listThreads);
  const threadData = useQuery(api.aiChat.getThread, selectedThreadId ? { threadId: selectedThreadId } : "skip");
  const createThread = useMutation(api.aiChat.createThread);
  const updateThread = useMutation(api.aiChat.updateThread);
  const deleteThread = useMutation(api.aiChat.deleteThread);
  const sendMessage = useAction(api.aiChat.sendMessage);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [threadData?.messages, isSending]);
  const handleCreateThread = async () => {
    try {
      const id = await createThread({
        title: threadTitle || "Новый чат",
        systemPrompt: systemPrompt || "Вы — опытный архитектор ПО.",
      });
      setSelectedThreadId(id);
      setIsSettingsOpen(false);
      setIsThreadListOpen(false);
      toast.success("Чат успешно создан");
    } catch (error) {
      toast.error("Ошибка при создании чата");
    }
  };
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedThreadId || isSending) return;
    const content = message.trim();
    setMessage("");
    setIsSending(true);
    try {
      await sendMessage({ threadId: selectedThreadId, content });
    } catch (error) {
      toast.error("Ошибка при отправке сообщения");
      setMessage(content);
    } finally {
      setIsSending(false);
    }
  };
  const ThreadList = (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      <div className="p-5 border-b">
        <Button
          variant="default"
          className="w-full h-14 rounded-2xl shadow-md font-bold md-card transition-all active:scale-[0.97]"
          onClick={() => { 
            setSelectedThreadId(null); 
            setIsThreadListOpen(false); 
            setThreadTitle(`Чат ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
            setIsSettingsOpen(true); 
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Новый диалог
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {threads?.map(t => (
            <div
              key={t._id}
              className={cn(
                "group flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent",
                selectedThreadId === t._id 
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              onClick={() => { setSelectedThreadId(t._id); setIsThreadListOpen(false); }}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mr-3 shrink-0 transition-colors",
                selectedThreadId === t._id ? "bg-primary/20" : "bg-muted group-hover:bg-background"
              )}>
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{t.title}</p>
                <p className="text-[10px] opacity-60 truncate">Обновлено {new Date(t.updatedAt).toLocaleDateString()}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if(confirm("Удалить этот диалог навсегда?")) deleteThread({ threadId: t._id }); 
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {threads?.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <MessageSquare className="h-10 w-10 mx-auto mb-2" />
              <p className="text-xs">Список чатов пуст</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-background overflow-hidden selection:bg-primary/20">
      {!isMobile && <div className="w-80 border-r bg-muted/20">{ThreadList}</div>}
      <div className="flex-1 flex flex-col relative bg-muted/5">
        <header className="border-b h-20 flex justify-between items-center px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet open={isThreadListOpen} onOpenChange={setIsThreadListOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-muted"><Menu className="h-6 w-6" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 rounded-r-3xl border-r-0">
                  <SheetHeader className="p-5 border-b">
                    <SheetTitle className="text-xl font-extrabold tracking-tight">Мои диалоги</SheetTitle>
                  </SheetHeader>
                  {ThreadList}
                </SheetContent>
              </Sheet>
            )}
            <div className="flex flex-col">
              <h2 className="font-extrabold text-base md:text-lg truncate max-w-[180px] md:max-w-md">
                {threadData?.thread.title || "Выберите диалог"}
              </h2>
              {threadData?.thread && <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Architect Mode</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-11 w-11 rounded-xl"
               onClick={() => setIsSettingsOpen(true)}
             >
               <Settings className="h-5 w-5 text-muted-foreground" />
             </Button>
          </div>
        </header>
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 md:p-6">
          {!selectedThreadId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-50">
              <Bot className="h-16 w-16 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Готов к проектированию</h3>
              <p className="text-sm">Выберите существующий чат или создайте новый, чтобы обсудить архитектуру вашего приложения.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-10">
              <div className="flex justify-center mb-8">
                <Badge variant="outline" className="bg-muted/50 rounded-full py-1 px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Начало диалога — {new Date(threadData?.thread.createdAt || 0).toLocaleDateString()}
                </Badge>
              </div>
              {threadData?.messages.map(m => (
                <div key={m._id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"
                  )}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card text-foreground rounded-tl-none border border-border/50"
                  )}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted border flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border border-dashed flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Архитектор думает</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <footer className={cn(
          "p-4 md:p-6 border-t bg-background/80 backdrop-blur-xl transition-opacity duration-300",
          !selectedThreadId ? "opacity-30 pointer-events-none" : "opacity-100"
        )}>
          <div className="max-w-4xl mx-auto flex gap-3 items-end">
            <div className="relative flex-1">
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Спросите архитектора..."
                className="min-h-[60px] max-h-40 rounded-2xl md-card resize-none py-5 px-6 pr-14 focus-visible:ring-primary/20 border-none bg-muted/40"
                onKeyDown={(e) => { 
                  if(e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSendMessage(); 
                  } 
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim() || !selectedThreadId}
                className="absolute right-3 bottom-3 h-10 w-10 rounded-xl p-0 shadow-lg ripple-effect shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </footer>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="rounded-3xl sm:max-w-md border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Параметры сессии</DialogTitle>
              <DialogDescription className="font-medium">
                Настройте поведение ИИ-архитектора
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Название чата</Label>
                <Input 
                  value={threadTitle} 
                  onChange={e => setThreadTitle(e.target.value)} 
                  className="h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/30" 
                  placeholder="напр. Редизайн Маркетплейса"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Системные инструкции</Label>
                <Textarea 
                  value={systemPrompt} 
                  onChange={e => setSystemPrompt(e.target.value)} 
                  rows={5} 
                  className="rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/30 resize-none"
                  placeholder="Опишите роль ИИ..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={selectedThreadId 
                  ? async () => { 
                      await updateThread({ threadId: selectedThreadId, title: threadTitle, systemPrompt }); 
                      setIsSettingsOpen(false); 
                      toast.success("Настройки сохранены");
                    } 
                  : handleCreateThread
                }
                className="w-full h-14 rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-primary/20 transition-all"
              >
                {selectedThreadId ? "Применить" : "Начать диалог"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}