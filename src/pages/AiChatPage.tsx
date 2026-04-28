import { Authenticated, Unauthenticated } from "convex/react";
import { AiChat } from "@/components/AiChat";
import { SignInForm } from "@/components/SignInForm";
export function AiChatPage() {
  return (
    <>
      <Authenticated>
        <AiChat />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Войдите, чтобы использовать ИИ Чат
            </h1>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}