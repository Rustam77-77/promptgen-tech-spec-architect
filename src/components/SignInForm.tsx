"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { PASSWORD_MIN_LENGTH } from "@shared/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
type FormStep = "signIn" | "signUp" | "verifyEmail" | "forgotPassword" | "resetPassword";
export function SignInForm() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<FormStep>("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.set("email", email);
    try {
      if (step === "signIn") {
        formData.set("password", password);
        formData.set("flow", "signIn");
        await signIn("password", formData);
      } else if (step === "signUp") {
        formData.set("password", password);
        formData.set("flow", "signUp");
        await signIn("password", formData);
        setStep("verifyEmail");
      } else if (step === "verifyEmail") {
        formData.set("code", otp);
        formData.set("flow", "email-verification");
        await signIn("password", formData);
        toast.success("Email подтвержден!");
      } else if (step === "forgotPassword") {
        formData.set("flow", "reset");
        await signIn("password", formData);
        setStep("resetPassword");
      } else if (step === "resetPassword") {
        formData.set("code", otp);
        formData.set("newPassword", newPassword);
        formData.set("flow", "reset-verification");
        await signIn("password", formData);
        toast.success("Пароль изменен!");
        setStep("signIn");
      }
    } catch (err) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setSubmitting(false);
    }
  };
  const inputClass = "w-full px-4 py-3 bg-secondary border border-input rounded-lg outline-none focus:ring-2 focus:ring-primary";
  return (
    <div className="w-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {(step === "signIn" || step === "signUp" || step === "forgotPassword") && (
          <input className={inputClass} type="email" placeholder="Электронная почта" value={email} onChange={e => setEmail(e.target.value)} required />
        )}
        {(step === "signIn" || step === "signUp") && (
          <input className={inputClass} type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        )}
        {(step === "verifyEmail" || step === "resetPassword") && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">Введите 6-значный код из письма</p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}
        {step === "resetPassword" && (
          <input className={inputClass} type="password" placeholder="Новый пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        )}
        <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50" type="submit" disabled={submitting}>
          {step === "signIn" ? "Войти" : step === "signUp" ? "Создать аккаунт" : "Продолжить"}
        </button>
        <div className="text-center text-sm flex flex-col gap-2">
          {step === "signIn" && <button type="button" className="text-primary hover:underline" onClick={() => setStep("signUp")}>Нет аккаунта? Зарегистрируйтесь</button>}
          {step === "signUp" && <button type="button" className="text-primary hover:underline" onClick={() => setStep("signIn")}>Уже есть аккаунт? Войдите</button>}
          {step === "signIn" && <button type="button" className="text-muted-foreground hover:underline" onClick={() => setStep("forgotPassword")}>Забыли пароль?</button>}
        </div>
      </form>
      <div className="my-6 border-t relative"><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">ИЛИ</span></div>
      <button className="w-full py-3 border rounded-lg hover:bg-muted" onClick={() => signIn("anonymous")}>Войти анонимно</button>
    </div>
  );
}