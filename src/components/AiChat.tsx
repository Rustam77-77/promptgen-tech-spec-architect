import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
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
import { Send, Settings, Trash2, Plus, Menu, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
export function AiChat() {
  const isMobile = useIsMobile();
  const [selectedThreadId, setSelectedThreadId] = useState<Id<"chatThreads"> | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThreadListOpen, setIsThreadListOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("Вы — опытный архитектор ПО.");
  const [threadTitle, setThreadTitle] = useState("Новый чат");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useConvexAuth();
  const threads = useQuery(api.aiChat.listThreads, isAuthenticated ? {} : "skip");
  const threadData = useQuery(api.aiChat.getThread, isAuthenticated && selectedThreadId ? { threadId: selectedThreadId } : "skip");
  const createThread = useMutation(api.aiChat.createThread);
  const updateThread = useMutation(api.aiChat.updateThread);
  const deleteThread = useMutation(api.aiChat.deleteThread);
  const sendMessage = useAction(api.aiChat.sendMessage);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
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
      toast.success("Чат создан");
    } catch (error) {
      toast.error("Ошибка создания");
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
      toast.error("Ошибка отправки");
      setMessage(content);
    } finally {
      setIsSending(false);
    }
  };
  const ThreadList = (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <Button
          variant="default"
          className="w-full h-12 rounded-xl md-card"
          onClick={() => { setSelectedThreadId(null); setIsThreadListOpen(false); setIsSettingsOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> Новый чат
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {threads?.map(t => (
            <div
              key={t._id}
              className={cn(
                "flex items-center p-3 rounded-xl cursor-pointer ripple-effect group",
                selectedThreadId === t._id ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
              onClick={() => { setSelectedThreadId(t._id); setIsThreadListOpen(false); }}
            >
              <MessageSquare className="h-4 w-4 mr-3 opacity-70" />
              <span className="text-sm font-medium truncate flex-1">{t.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); if(confirm("Удалить?")) deleteThread({ threadId: t._id }); }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-background overflow-hidden">
      {!isMobile && <div className="w-72 border-r">{ThreadList}</div>}
      <div className="flex-1 flex flex-col relative">
        <header className="border-b h-16 flex justify-between items-center px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={isThreadListOpen} onOpenChange={setIsThreadListOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Мои чаты</SheetTitle>
                  </SheetHeader>
                  {ThreadList}
                </SheetContent>
              </Sheet>
            )}
            <h2 className="font-bold text-sm md:text-base truncate max-w-[200px]">
              {threadData?.thread.title || "Выберите чат"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}><Settings className="h-5 w-5 text-muted-foreground" /></Button>
        </header>
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto pb-4">
            {threadData?.messages.map(m => (
              <div key={m._id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-4 rounded-2xl shadow-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-muted p-4 rounded-2xl rounded-tl-none animate-pulse text-xs font-medium">Думает...</div>
              </div>
            )}
          </div>
        </ScrollArea>
        <footer className="p-4 border-t bg-background/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex gap-2 items-end">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Спросите о проекте..."
              className="min-h-[52px] max-h-32 rounded-2xl md-card resize-none py-4"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim() || !selectedThreadId}
              className="h-[52px] w-[52px] rounded-full p-0 shadow-lg ripple-effect shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </footer>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Настройки чата</DialogTitle>
              <DialogDescription>Инструкции для архитектора</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input value={threadTitle} onChange={e => setThreadTitle(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Инструкции (System Prompt)</Label>
                <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={selectedThreadId ? () => { updateThread({ threadId: selectedThreadId, title: threadTitle, systemPrompt }); setIsSettingsOpen(false); } : handleCreateThread}
                className="w-full h-12"
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}