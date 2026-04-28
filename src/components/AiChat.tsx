import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, Settings, Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
export function AiChat() {
  const [selectedThreadId, setSelectedThreadId] = useState<Id<"chatThreads"> | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  }, [threadData?.messages]);
  useEffect(() => {
    if (threadData?.thread) {
      setSystemPrompt(threadData.thread.systemPrompt);
      setThreadTitle(threadData.thread.title);
    }
  }, [threadData?.thread]);
  const handleCreateThread = async () => {
    try {
      const id = await createThread({
        title: threadTitle || "Новый чат",
        systemPrompt: systemPrompt || "Вы — опытный архитектор ПО.",
      });
      setSelectedThreadId(id);
      setIsSettingsOpen(false);
      toast.success("Чат создан");
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
      toast.error("Ошибка при отправке");
      setMessage(content);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r bg-muted/50 flex flex-col">
        <div className="p-4 border-b">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={() => setSelectedThreadId(null)}>
                <Plus className="w-4 h-4 mr-2" /> Новый чат
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedThreadId ? "Настройки чата" : "Новый чат"}</DialogTitle>
                <DialogDescription>Настройте параметры поведения ИИ.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Название</Label>
                  <Input value={threadTitle} onChange={e => setThreadTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Системный промпт</Label>
                  <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={selectedThreadId ? () => updateThread({ threadId: selectedThreadId, title: threadTitle, systemPrompt }) : handleCreateThread}>
                  {selectedThreadId ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {threads?.map(t => (
              <div key={t._id} className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-accent ${selectedThreadId === t._id ? "bg-accent" : ""}`} onClick={() => setSelectedThreadId(t._id)}>
                <span className="text-sm truncate flex-1">{t.title}</span>
                <Trash2 className="h-3 w-3 opacity-50 hover:text-destructive" onClick={(e) => { e.stopPropagation(); if(confirm("Удалить этот чат?")) deleteThread({ threadId: t._id }); }} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedThreadId && threadData ? (
          <>
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="font-semibold">{threadData.thread.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}><Settings className="h-4 w-4" /></Button>
            </div>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {threadData.messages.map(m => (
                  <div key={m._id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <Card className={`max-w-[80%] p-3 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </Card>
                  </div>
                ))}
                {isSending && <div className="text-sm text-muted-foreground">Думает...</div>}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Сообщение..." rows={1} />
                <Button onClick={handleSendMessage} disabled={isSending}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-muted-foreground">Выберите чат или создайте новый</div>}
      </div>
    </div>
  );
}