"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activateAccountSchema } from "@/lib/schema";
import { activateAccount } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Circle,
  Eye,
  EyeOff,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const privileges = [
  {
    icon: Sparkles,
    title: "Priority Archive & Drop Access",
    description: "Preview quarterly capsules 48 hours prior to public release.",
  },
  {
    icon: Truck,
    title: "Insured Express Logistics",
    description: "Complimentary priority shipping with carbon-neutral transit.",
  },
  {
    icon: PackageCheck,
    title: "Bespoke Size Profiling",
    description: "Algorithmic architectural fitting adapted to your profile.",
  },
];

function getMessage(response: unknown, fallback: string) {
  if (!response || typeof response !== "object") return fallback;

  const message = (response as Record<string, unknown>).message;
  if (Array.isArray(message)) return message.join(". ");
  return typeof message === "string" ? message : fallback;
}

function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";
  const emailFromUrl = searchParams.get("email")?.trim() || "";
  const [email, setEmail] = useState(emailFromUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [activated, setActivated] = useState(false);

  const form = useForm<z.infer<typeof activateAccountSchema>>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: { password: "", passwordConfirmation: "" },
  });
  const password = form.watch("password");
  const passwordConfirmation = form.watch("passwordConfirmation");
  const hasMinimumLength = password.length >= 8;
  const passwordsMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      return;
    }

    const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (storedEmail) setEmail(storedEmail);
  }, [emailFromUrl]);

  const formSubmit = async (
    payload: z.infer<typeof activateAccountSchema>,
  ) => {
    if (!token) {
      setActivationError(
        "The activation token is missing. Please open the link from your verification email.",
      );
      return;
    }

    setSubmitting(true);
    setActivationError("");

    try {
      const response = await activateAccount(token, payload);
      if (
        response?.success === true &&
        response?.data?.account_activated === true
      ) {
        sessionStorage.removeItem("pendingVerificationEmail");
        setActivated(true);
        return;
      }

      setActivationError(
        getMessage(
          response,
          "We could not activate your account. The link may be invalid or expired.",
        ),
      );
    } catch {
      setActivationError(
        "We could not activate your account right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "h-12 rounded-md border-transparent bg-[#f4f2f2] px-3.5 text-sm text-[#1a1a1a] shadow-none placeholder:text-[#777] focus-visible:border-[#aaa] focus-visible:ring-black/10";
  const labelClassName =
    "text-[10px] font-semibold tracking-wide text-[#555]";

  return (
    <section className="mx-auto max-w-6xl px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-[#555]"
      >
        <Link href="/" className="hover:text-black">
          HOME
        </Link>
        <span className="text-[#aaa]" aria-hidden="true">
          /
        </span>
        <Link href="/login" className="hover:text-black">
          ACCOUNT
        </Link>
        <span className="text-[#aaa]" aria-hidden="true">
          /
        </span>
        <span className="text-black" aria-current="page">
          SET PASSWORD
        </span>
      </nav>

      <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.25fr_0.85fr] lg:gap-24">
        <div className="mx-auto w-full max-w-[540px] lg:mx-0">
          {activated ? (
            <div className="rounded-xl border border-black/8 bg-white p-8 text-center shadow-[0_14px_45px_rgba(0,0,0,0.035)] sm:p-12">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-emerald-700">
                ACCOUNT ACTIVATED
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-black">
                Your Account Is Ready
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#555]">
                Your password has been created successfully. Sign in to access
                your Storewell account.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black px-5 text-[10px] font-semibold tracking-[0.14em] text-white hover:bg-[#242424]"
              >
                CONTINUE TO SIGN IN
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-[#68615b]">
                STEP 02 / 02&nbsp;&nbsp; • &nbsp;&nbsp;EMAIL VERIFIED
              </p>
              <h1 className="mt-4 text-[40px] leading-tight font-semibold tracking-[-0.05em] text-black sm:text-[46px]">
                Create Your Password
              </h1>
              <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#444]">
                Your email address has been authenticated. Establish your
                secure credentials to finalize access to the Storewell
                Collective.
              </p>

              <div className="mt-7 flex items-center justify-between gap-4 rounded-md bg-[#f4f2f2] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ShieldCheck
                    className="size-4 shrink-0 text-[#555]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold tracking-wider text-[#666]">
                      AUTHENTICATED IDENTIFIER
                    </p>
                    <p className="truncate text-xs font-medium text-black">
                      {email || "Verified email address"}
                    </p>
                  </div>
                </div>
                <LockKeyhole
                  className="size-4 shrink-0 text-[#555]"
                  aria-hidden="true"
                />
              </div>

              {!token && (
                <p
                  role="alert"
                  className="mt-5 flex items-start gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  Activation token is missing. Open this page using the link
                  from your verification email.
                </p>
              )}

              <form
                onSubmit={form.handleSubmit(formSubmit)}
                aria-busy={submitting}
                className="mt-7 space-y-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password" className={labelClassName}>
                      PASSWORD
                    </Label>
                    <span className="text-[8px] font-semibold tracking-wider text-[#777]">
                      AWAITING ENTRY
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter secure password"
                      className={`${inputClassName} pr-12`}
                      required
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby={
                        form.formState.errors.password
                          ? "password-error"
                          : "password-requirements"
                      }
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#555] hover:text-black"
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

                <div
                  id="password-requirements"
                  className="rounded-md bg-[#f4f2f2] px-4 py-4"
                >
                  <p className="text-[9px] font-bold tracking-wider text-[#555]">
                    SECURITY ARCHITECTURE STANDARDS
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-[#444]">
                    <li className="flex items-center gap-2">
                      {hasMinimumLength ? (
                        <Check className="size-3.5 text-emerald-700" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                      Minimum 8 characters in length
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="size-3.5" />
                      Use a password unique to Storewell
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordsMatch ? (
                        <Check className="size-3.5 text-emerald-700" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                      Confirmation must match your password
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="passwordConfirmation"
                    className={labelClassName}
                  >
                    CONFIRM PASSWORD
                  </Label>
                  <div className="relative">
                    <Input
                      id="passwordConfirmation"
                      type={showConfirmation ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      className={`${inputClassName} pr-12`}
                      required
                      aria-invalid={
                        !!form.formState.errors.passwordConfirmation
                      }
                      aria-describedby={
                        form.formState.errors.passwordConfirmation
                          ? "password-confirmation-error"
                          : undefined
                      }
                      {...form.register("passwordConfirmation")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmation((current) => !current)
                      }
                      aria-label={
                        showConfirmation ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#555] hover:text-black"
                    >
                      {showConfirmation ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.passwordConfirmation && (
                    <p
                      id="password-confirmation-error"
                      className="text-xs text-red-700"
                    >
                      {form.formState.errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>

                {activationError && (
                  <p role="alert" className="text-sm text-red-700">
                    {activationError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !token}
                  className="h-12 w-full gap-3 rounded-md bg-black text-[10px] font-semibold tracking-[0.14em] text-white hover:bg-[#242424]"
                >
                  {submitting
                    ? "ACTIVATING ACCOUNT..."
                    : "COMPLETE REGISTRATION"}
                  {submitting ? (
                    <RefreshCw className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="size-3.5" />
                  )}
                </Button>
              </form>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-6 text-[9px] font-semibold tracking-wider text-[#555]">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  256-BIT SSL ENCRYPTED STANDARD
                </span>
                <Link href="/#footer-support" className="hover:underline">
                  NEED HELP? CONTACT CONCIERGE
                </Link>
              </div>
            </>
          )}
        </div>

        <aside className="mx-auto w-full max-w-[440px] space-y-6 lg:mx-0">
          <div className="relative aspect-[0.82] overflow-hidden rounded-xl bg-[#d6cfc7] shadow-lg shadow-black/10">
            <Image
              src="/images/hero-sign-in.png"
              alt="Storewell editorial collection"
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 440px, calc(100vw - 48px)"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="text-[9px] font-semibold tracking-wider text-white/80">
                • COLLECTION PREVIEW
              </p>
              <h2 className="mt-2 text-xl font-medium tracking-[-0.04em]">
                Editorial Edition 04
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/80">
                The Storewell Collective embodies deliberate form, tactile
                restraint, and enduring presence.
              </p>
            </div>
          </div>

          <section className="rounded-xl bg-[#f1efef] p-6">
            <div className="flex items-center justify-between gap-4 text-[8px] font-bold tracking-[0.14em] text-[#555]">
              <h2>COLLECTIVE TIER 01</h2>
              <span>AUTOMATIC ACTIVATION</span>
            </div>
            <ul className="mt-5 space-y-4">
              {privileges.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                    <Icon className="size-3" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-black">{title}</h3>
                    <p className="mt-1 text-[10px] leading-4 text-[#555]">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[620px] items-center justify-center">
          <RefreshCw className="size-5 animate-spin text-[#555]" />
        </div>
      }
    >
      <ActivateAccountContent />
    </Suspense>
  );
}
