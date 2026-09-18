"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signinSchema } from "@/lib/schema";
import { setCredentials } from "@/redux/slices/authSlice";
import { setCartCount } from "@/redux/slices/cartSlice";
import { postLogin } from "@/services/auth";
import { getCartsCount } from "@/services/participant";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import z from "zod";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const formSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoading(true);
    setLoginError("");
    try {
      const res = await postLogin(data);
      if (!res?.data?.token) {
        setLoginError(
          res?.message ||
            "Unable to sign in. Please check your email and password.",
        );
        return;
      }
      dispatch(
        setCredentials({
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          user: { name: res.data.name, email: res.data.email },
        }),
      );
      // A cart request failure should not prevent a successful sign-in.
      try {
        const countCart = await getCartsCount(res.data.token);
        dispatch(setCartCount(Number(countCart?.data?.count) || 0));
      } catch {
        dispatch(setCartCount(0));
      }
      router.push("/");
    } catch {
      setLoginError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "h-12 rounded-xl border-transparent bg-[#f4f2f2] px-4 text-sm text-[#1a1a1a] shadow-none placeholder:text-[#a3a3a3] focus-visible:border-[#aaa] focus-visible:ring-black/10";

  return (
    <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-[52px] lg:px-12 lg:py-[52px]">
      <div className="mx-auto w-full max-w-[420px] lg:mx-0 lg:flex lg:min-h-[700px] lg:max-w-none lg:flex-col">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 pt-1 text-[10px] font-semibold tracking-wider"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#454545] hover:text-black"
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            RETURN TO STORE
          </Link>
          <span className="text-[#b8b8b8]" aria-hidden="true">
            /
          </span>
          <span className="text-[#777]" aria-current="page">
            ACCOUNT
          </span>
        </nav>
        <p className="text-[10px] font-semibold tracking-[0.22em] text-[#68615b]">
          STOREWELL ACCOUNT
        </p>
        <h1 className="mt-2 text-[48px] leading-[1.15] font-semibold tracking-[-0.045em] text-black sm:text-[54px]">
          Sign In
        </h1>
        <p className="mt-4 max-w-[365px] text-sm leading-[1.6] text-[#393939]">
          Welcome back. Enter your credentials to access your curated wardrobe,
          order history, and saved preferences.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled
            title="Google sign-in is not available yet"
            aria-label="Google sign-in is not available yet"
            className="h-10 gap-3 rounded-xl bg-[#f4f2f2] text-[10px] font-semibold tracking-wider disabled:opacity-100"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            GOOGLE
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled
            title="Apple sign-in is not available yet"
            aria-label="Apple sign-in is not available yet"
            className="h-10 gap-3 rounded-xl bg-[#f4f2f2] text-[10px] font-semibold tracking-wider disabled:opacity-100"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.05 12.54c.03 3.15 2.76 4.2 2.79 4.21-.02.07-.44 1.5-1.44 2.98-.87 1.28-1.78 2.56-3.21 2.59-1.4.03-1.85-.84-3.45-.84-1.59 0-2.09.81-3.41.87-1.38.05-2.43-1.38-3.31-2.66-1.8-2.61-3.17-7.39-1.32-10.62.92-1.6 2.56-2.61 4.34-2.64 1.35-.03 2.62.92 3.45.92.82 0 2.37-1.14 3.99-.98.68.03 2.59.27 3.82 2.07-.1.06-2.28 1.33-2.25 4.1ZM14.42 4.63c.73-.89 1.22-2.12 1.08-3.35-1.05.04-2.33.7-3.08 1.59-.67.77-1.26 2-1.1 3.18 1.17.09 2.37-.59 3.1-1.42Z" />
            </svg>
            APPLE
          </Button>
        </div>
        <div className="my-6 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-black/5" />
          <span className="text-[10px] font-semibold tracking-widest text-[#727272]">
            OR SIGN IN WITH EMAIL
          </span>
          <span className="h-px flex-1 bg-black/5" />
        </div>

        <form
          onSubmit={form.handleSubmit(formSubmit)}
          className="space-y-5"
          aria-busy={loading}
        >
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[10px] font-semibold tracking-wide"
            >
              EMAIL ADDRESS
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className={inputClassName}
              required
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={
                form.formState.errors.email ? "email-error" : undefined
              }
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p id="email-error" className="text-xs text-red-700">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="password"
                className="text-[10px] font-semibold tracking-wide"
              >
                PASSWORD
              </Label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-semibold tracking-wide text-[#68615b] hover:text-black"
              >
                FORGOT PASSWORD?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                className={`${inputClassName} pr-12`}
                required
                aria-invalid={!!form.formState.errors.password}
                aria-describedby={
                  form.formState.errors.password ? "password-error" : undefined
                }
                {...form.register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-xl text-[#555] hover:text-black focus-visible:outline-2 focus-visible:outline-black"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p id="password-error" className="text-xs text-red-700">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-2.5 py-1 text-sm text-[#393939]">
            <input
              type="checkbox"
              className="size-4 cursor-pointer accent-black"
            />
            Keep me signed in
          </label>
          {loginError && (
            <p role="alert" className="text-sm text-red-700">
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full gap-3 rounded-xl bg-black text-[10px] font-semibold tracking-[0.2em] text-white shadow-lg shadow-black/10 hover:bg-[#242424] focus-visible:ring-black/20"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-[#393939]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline underline-offset-4 hover:text-[#68615b]"
          >
            Create an account
          </Link>
        </p>
        <div className="mt-10 flex items-center gap-3 pb-4 text-[10px] leading-tight font-semibold text-[#595959] lg:mt-auto lg:pt-10">
          <LockKeyhole
            className="size-3.5 shrink-0 text-[#68615b]"
            aria-hidden="true"
          />
          <p>
            Shop with confidence. Direct client concierge assistance available.
          </p>
        </div>
      </div>

      <aside
        aria-label="Storewell manifesto"
        className="relative mx-auto aspect-[0.76] w-full max-w-[580px] overflow-hidden rounded-xl bg-[#d6cfc7] lg:min-h-[700px] lg:max-w-none"
      >
        <Image
          src="/images/hero-sign-in.png"
          alt="Model wearing a sculptural beige jacket and matching trousers in a sunlit atelier"
          fill
          preload
          sizes="(min-width: 1152px) 550px, (min-width: 1024px) 50vw, (min-width: 640px) 580px, calc(100vw - 48px)"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/5 to-transparent" />
        <div className="absolute top-7 right-6 flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[9px] font-bold tracking-wider text-white backdrop-blur-sm sm:right-7">
          <span className="size-1.5 rounded-full bg-white/80" />
          VOL. 04 · AUTUMN SANCTUARY
        </div>
        <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-white/85">
            MANIFESTO
          </p>
          <blockquote className="max-w-[390px] text-[25px] leading-tight font-medium tracking-[-0.05em] sm:text-[29px]">
            &ldquo;Curating timeless essentials engineered for understated
            elegance and conscious longevity.&rdquo;
          </blockquote>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[9px] font-semibold tracking-widest text-white/85">
            <span>STOREWELL ATELIER · ZURICH</span>
            <span className="h-px w-7 bg-white/30" aria-hidden="true" />
            <span>EST. 2024</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
