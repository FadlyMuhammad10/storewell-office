"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema } from "@/lib/schema";
import { postRegister } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CircleStar,
  Eye,
  EyeOff,
  HandPlatter,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const privileges = [
  {
    icon: CircleStar,
    title: "Priority Archive & Drop Access",
    description:
      "24-hour advance entry to limited-run collections, runway previews, and archival private sales.",
  },
  {
    icon: Truck,
    title: "Insured Express Logistics",
    description:
      "Real-time end-to-end telemetry and complimentary expedited delivery with climate neutralization.",
  },
  {
    icon: HandPlatter,
    title: "Bespoke Size Profiling",
    description:
      "Intelligent fitting memory across maison ateliers and tailored editorial recommendations.",
  },
];

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="text-xs text-red-700">
      {message}
    </p>
  ) : null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { errors } = form.formState;
  const password = form.watch("password");
  const strength = !password
    ? 0
    : password.length < 8
      ? 1
      : 2 +
        Number(/[A-Z]/.test(password) && /[a-z]/.test(password)) +
        Number(/\d/.test(password) && /[^a-zA-Z0-9]/.test(password));
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const formSubmit = async (payload: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setRegisterError("");
    try {
      const res = await postRegister(payload);
      if (!res?.data?.user_id) {
        const message = Array.isArray(res?.message)
          ? res.message.join(". ")
          : res?.message;
        setRegisterError(
          message || "Unable to create your account. Please try again.",
        );
        return;
      }
      router.push("/login");
    } catch {
      setRegisterError(
        "Unable to create your account right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "h-12 rounded-sm border-transparent bg-[#f4f2f2] px-3.5 text-sm text-[#1a1a1a] shadow-none placeholder:text-[#777] focus-visible:border-[#aaa] focus-visible:ring-black/10";
  const labelClassName =
    "gap-1 text-[10px] font-semibold tracking-wide text-[#68615b]";

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:pt-[52px] lg:pb-14">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto mb-10 flex max-w-[520px] items-center gap-2 text-[10px] font-medium tracking-wide lg:max-w-none"
      >
        <Link href="/" className="text-[#555] hover:text-black">
          HOME
        </Link>
        <span className="text-[#999]" aria-hidden="true">
          /
        </span>
        <Link href="/login" className="text-[#555] hover:text-black">
          ACCOUNT
        </Link>
        <span className="text-[#999]" aria-hidden="true">
          /
        </span>
        <span aria-current="page" className="font-semibold">
          CREATE ACCOUNT
        </span>
      </nav>

      <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-[88px] xl:gap-[120px]">
        <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em] text-[#68615b]">
            <span
              className="size-1.5 rounded-full bg-black"
              aria-hidden="true"
            />
            MEMBER REGISTRATION
          </p>
          <h1 className="mt-2 text-[40px] leading-[1.15] font-semibold tracking-[-0.05em] text-black sm:text-[54px] lg:text-[50px] xl:text-[54px]">
            Create Account
          </h1>
          <p className="mt-4 text-sm leading-[1.65] text-[#393939]">
            Join the Storewell collective for private collection previews,
            complimentary carbon-neutral shipping, and seamless checkout.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled
              title="Google sign-up is not available yet"
              aria-label="Google sign-up is not available yet"
              className="h-10 gap-2 rounded-sm bg-[#efeded] px-2 text-[9px] font-semibold tracking-wide disabled:opacity-100 sm:text-[10px]"
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
              SIGN UP WITH GOOGLE
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled
              title="Apple sign-up is not available yet"
              aria-label="Apple sign-up is not available yet"
              className="h-10 gap-2 rounded-sm bg-[#efeded] px-2 text-[9px] font-semibold tracking-wide disabled:opacity-100 sm:text-[10px]"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 12.54c.03 3.15 2.76 4.2 2.79 4.21-.02.07-.44 1.5-1.44 2.98-.87 1.28-1.78 2.56-3.21 2.59-1.4.03-1.85-.84-3.45-.84-1.59 0-2.09.81-3.41.87-1.38.05-2.43-1.38-3.31-2.66-1.8-2.61-3.17-7.39-1.32-10.62.92-1.6 2.56-2.61 4.34-2.64 1.35-.03 2.62.92 3.45.92.82 0 2.37-1.14 3.99-.98.68.03 2.59.27 3.82 2.07-.1.06-2.28 1.33-2.25 4.1ZM14.42 4.63c.73-.89 1.22-2.12 1.08-3.35-1.05.04-2.33.7-3.08 1.59-.67.77-1.26 2-1.1 3.18 1.17.09 2.37-.59 3.1-1.42Z" />
              </svg>
              SIGN UP WITH APPLE
            </Button>
          </div>
          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-black/5" />
            <span className="text-[10px] font-semibold tracking-widest text-[#555]">
              OR REGISTER WITH EMAIL
            </span>
            <span className="h-px flex-1 bg-black/5" />
          </div>

          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(formSubmit)}
            aria-busy={loading}
          >
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    name: "firstName",
                    label: "FIRST NAME",
                    placeholder: "e.g. Julian",
                    autoComplete: "given-name",
                  },
                  {
                    name: "lastName",
                    label: "LAST NAME",
                    placeholder: "e.g. Sterling",
                    autoComplete: "family-name",
                  },
                ] as const
              ).map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className={labelClassName}>
                    {field.label}
                    <span className="text-red-700">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    className={inputClassName}
                    required
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={
                      errors[field.name] ? `${field.name}-error` : undefined
                    }
                    {...form.register(field.name)}
                  />
                  <FieldError
                    id={`${field.name}-error`}
                    message={errors[field.name]?.message}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={labelClassName}>
                EMAIL ADDRESS<span className="text-red-700">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. julian.sterling@example.com"
                  className={`${inputClassName} pr-12`}
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...form.register("email")}
                />
                <Mail
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#777]"
                  aria-hidden="true"
                />
              </div>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password" className={labelClassName}>
                  PASSWORD<span className="text-red-700">*</span>
                </Label>
                <span
                  id="password-hint"
                  className="text-[9px] font-semibold tracking-wide text-[#454545]"
                >
                  MINIMUM 8 CHARACTERS
                </span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create password"
                  className={`${inputClassName} pr-12`}
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={`password-hint${errors.password ? " password-error" : ""}`}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-sm text-[#777] hover:text-black focus-visible:outline-2 focus-visible:outline-black"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <div className="flex h-1 gap-1 pt-1" aria-hidden="true">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1 flex-1 rounded-full ${segment <= strength ? (strength < 3 ? "bg-[#a58b69]" : "bg-[#5d735c]") : "bg-[#e3e1e1]"}`}
                  />
                ))}
              </div>
              <p className="sr-only" role="status">
                {password && `Password strength: ${strengthLabels[strength]}`}
              </p>
              <FieldError
                id="password-error"
                message={errors.password?.message}
              />
            </div>
            <div className="space-y-2 pt-1">
              <Label htmlFor="confirmPassword" className={labelClassName}>
                CONFIRM PASSWORD<span className="text-red-700">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className={`${inputClassName} pr-12`}
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-sm text-[#777] hover:text-black focus-visible:outline-2 focus-visible:outline-black"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <FieldError
                id="confirmPassword-error"
                message={errors.confirmPassword?.message}
              />
            </div>
            <div className="space-y-3 pt-2 text-sm leading-[1.4] text-[#393939]">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 size-3.5 shrink-0 cursor-pointer accent-black"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/"
                    className="text-black underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/"
                    className="text-black underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  . <span className="text-red-700">*</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-3.5 shrink-0 cursor-pointer accent-black"
                />
                <span>
                  Receive curated editorial releases, private sale invitations,
                  and seasonal lookbooks.
                </span>
              </label>
            </div>
            {registerError && (
              <p role="alert" className="text-sm text-red-700">
                {registerError}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="mt-3 h-11 w-full gap-3 rounded-lg bg-black text-[10px] font-semibold tracking-wider text-white shadow-md shadow-black/10 hover:bg-[#242424] focus-visible:ring-black/20"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-12 text-center text-sm text-[#393939]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="ml-1 font-semibold text-black hover:underline"
            >
              Sign In
            </Link>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2 rounded-sm bg-[#f4f2f2] px-2 py-4 text-[8px] font-semibold tracking-wide text-[#68615b] sm:px-3 sm:text-[9px]">
            <span className="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row">
              <ShieldCheck
                className="size-3 shrink-0 text-black"
                aria-hidden="true"
              />
              VERIFIED SAFE CHECKOUT
            </span>
            <span className="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row">
              <LockKeyhole
                className="size-3 shrink-0 text-black"
                aria-hidden="true"
              />
              ENCRYPTED VAULT
            </span>
            <span className="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row">
              <Leaf className="size-3 shrink-0 text-black" aria-hidden="true" />
              CARBON-NEUTRAL
            </span>
          </div>
        </div>

        <aside
          aria-label="Storewell collective and membership privileges"
          className="mx-auto w-full max-w-[520px] space-y-7 lg:max-w-none"
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-[#d6cfc7] shadow-lg shadow-black/10">
            <Image
              src="/images/hero-sign-in.png"
              alt="Model wearing a sculptural beige jacket and matching trousers in a sunlit atelier"
              fill
              preload
              sizes="(min-width: 1152px) 410px, (min-width: 1024px) 40vw, (min-width: 640px) 520px, calc(100vw - 48px)"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="mb-2 text-[10px] font-semibold tracking-wider text-white/85">
                EDITORIAL EDITION 04
              </p>
              <blockquote className="max-w-[350px] text-[21px] leading-[1.35] font-semibold tracking-[-0.04em] sm:text-[23px] lg:text-[21px]">
                &ldquo;The Storewell Collective — Tailored silhouettes and
                conscious luxury.&rdquo;
              </blockquote>
              <p className="mt-2 text-[9px] font-semibold tracking-wide text-white/65">
                CURATED FOR DISCERNING VISIONARIES WORLDWIDE
              </p>
            </div>
          </div>
          <section
            aria-labelledby="membership-heading"
            className="rounded-xl bg-[#efeded] p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold tracking-wider">
              <h2 id="membership-heading" className="text-black">
                MEMBERSHIP PRIVILEGES
              </h2>
              <span className="text-[#68615b]">TIER I COMPLIMENTARY</span>
            </div>
            <ul className="mt-8 space-y-5">
              {privileges.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-4">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-black"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-black">{title}</h3>
                    <p className="mt-1 text-sm leading-[1.65] text-[#393939]">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between gap-5 text-[9px] leading-tight font-semibold tracking-wider">
              <p className="max-w-[150px] text-[#68615b]">
                STOREWELL ATELIER · GLOBAL
              </p>
              <p className="max-w-[100px] text-black">0% ANNUAL SURCHARGE</p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
