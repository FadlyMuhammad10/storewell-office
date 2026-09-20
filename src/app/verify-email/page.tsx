"use client";

import { Button } from "@/components/ui/button";
import { resendVerifyEmail, verifyEmail } from "@/services/auth";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Mail,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type VerificationStatus = "pending" | "verifying" | "verified" | "error";

function getApiMessage(response: unknown, fallback: string) {
  if (!response || typeof response !== "object") return fallback;

  const result = response as Record<string, unknown>;
  if (Array.isArray(result.message)) return result.message.join(". ");
  if (typeof result.message === "string") return result.message;

  const data = result.data;
  if (data && typeof data === "object") {
    const message = (data as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }

  return fallback;
}

function isApiSuccess(response: unknown) {
  if (!response || typeof response !== "object") return false;

  const result = response as Record<string, unknown>;
  const statusCode = Number(result.statusCode ?? result.status_code ?? 200);
  const message = getApiMessage(response, "").toLowerCase();

  if (result.success === false || result.error || statusCode >= 400)
    return false;

  return !/(request failed|unexpected error|invalid|expired|not found|unauthori[sz]ed)/.test(
    message,
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token =
    searchParams.get("token") ||
    searchParams.get("verification_token") ||
    searchParams.get("verificationToken");
  const emailFromUrl = searchParams.get("email")?.trim() || "";
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "verifying" : "pending",
  );
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (emailFromUrl) {
      sessionStorage.setItem("pendingVerificationEmail", emailFromUrl);
      setEmail(emailFromUrl);
      return;
    }

    const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (storedEmail) setEmail(storedEmail);
  }, [emailFromUrl]);

  useEffect(() => {
    if (!token || verificationStarted.current) return;

    verificationStarted.current = true;

    async function confirmEmail() {
      const response = await verifyEmail(token as string);

      if (isApiSuccess(response)) {
        setStatus("verified");
        setMessage(
          getApiMessage(
            response,
            "Your email has been verified. You can now sign in to Storewell.",
          ),
        );
        sessionStorage.removeItem("pendingVerificationEmail");
        return;
      }

      setStatus("error");
      setMessage(
        getApiMessage(
          response,
          "This verification link is invalid or has expired. Request a new link to continue.",
        ),
      );
    }

    void confirmEmail();
  }, [token]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || isResending || cooldown > 0) return;

    setIsResending(true);
    setMessage("");
    const response = await resendVerifyEmail(email);

    if (isApiSuccess(response)) {
      setStatus("pending");
      setCooldown(60);
      setMessage(
        getApiMessage(
          response,
          "A new verification link has been sent to your email.",
        ),
      );
    } else {
      setMessage(
        getApiMessage(
          response,
          "We could not resend the verification email. Please try again.",
        ),
      );
    }

    setIsResending(false);
  };

  const isVerified = status === "verified";
  const isVerifying = status === "verifying";
  const hasError = status === "error";

  return (
    <section className="mx-auto flex min-h-[620px] max-w-6xl flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
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
          VERIFY EMAIL
        </span>
      </nav>

      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-[525px] rounded-2xl border border-black/8 bg-white px-6 py-10 text-center shadow-[0_14px_45px_rgba(0,0,0,0.035)] sm:px-10 sm:py-11">
          <div
            className={`mx-auto flex size-14 items-center justify-center rounded-full ${
              isVerified
                ? "bg-emerald-50 text-emerald-700"
                : hasError
                  ? "bg-red-50 text-red-700"
                  : "bg-[#f1efef] text-black"
            }`}
          >
            {isVerified ? (
              <Check className="size-6" aria-hidden="true" />
            ) : hasError ? (
              <TriangleAlert className="size-6" aria-hidden="true" />
            ) : isVerifying ? (
              <RefreshCw className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Mail className="size-5" aria-hidden="true" />
            )}
          </div>

          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-[#f1efef] px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-[#555]">
            <span
              className={`size-1.5 rounded-full ${isVerified ? "bg-emerald-600" : hasError ? "bg-red-600" : "bg-black"}`}
              aria-hidden="true"
            />
            {isVerified
              ? "EMAIL VERIFIED"
              : hasError
                ? "VERIFICATION FAILED"
                : isVerifying
                  ? "VERIFYING EMAIL"
                  : "PENDING VERIFICATION"}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black">
            {isVerified
              ? "Email Verified"
              : hasError
                ? "Link Could Not Be Verified"
                : isVerifying
                  ? "Verifying Your Email"
                  : "Check Your Inbox"}
          </h1>
          <p className="mx-auto mt-3 max-w-[400px] text-sm leading-6 text-[#555]">
            {isVerified || hasError || isVerifying
              ? message || "Please wait while we confirm your email address."
              : "We have sent a verification link to your email. Open the email and follow the link to activate your Storewell account."}
          </p>

          {email && !isVerified && (
            <div className="mt-7 flex h-12 items-center justify-center gap-3 rounded-lg bg-[#f4f2f2] px-4 text-sm font-medium text-black">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{email}</span>
            </div>
          )}

          {!isVerified && !isVerifying && (
            <>
              <a
                href="mailto:"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-5 text-[10px] font-semibold tracking-[0.14em] text-white transition-colors hover:bg-[#242424] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                OPEN EMAIL APP
              </a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href="https://mail.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f1efef] px-3 text-[9px] font-semibold tracking-wider text-black hover:bg-[#e8e5e5]"
                >
                  <ExternalLink className="size-3" aria-hidden="true" />
                  GOOGLE MAIL
                </a>
                <a
                  href="https://outlook.live.com/mail/0/inbox"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f1efef] px-3 text-[9px] font-semibold tracking-wider text-black hover:bg-[#e8e5e5]"
                >
                  <ExternalLink className="size-3" aria-hidden="true" />
                  OUTLOOK MAIL
                </a>
              </div>

              <div className="mt-7 border-t border-black/[0.07] pt-6">
                <p className="text-xs text-[#666]">
                  Didn&apos;t receive it? Check your spam or promotions folder.
                </p>
                {message && (
                  <p
                    role="status"
                    className={`mt-3 text-xs ${hasError ? "text-red-700" : "text-emerald-700"}`}
                  >
                    {message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!email || isResending || cooldown > 0}
                  onClick={handleResend}
                  className="mt-2 h-9 gap-2 px-3 text-[10px] font-semibold tracking-wider text-black hover:bg-[#f4f2f2] disabled:opacity-50"
                >
                  <RefreshCw
                    className={`size-3 ${isResending ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                  {isResending
                    ? "SENDING..."
                    : cooldown > 0
                      ? `RESEND IN ${cooldown}S`
                      : "RESEND VERIFICATION LINK"}
                </Button>
              </div>
            </>
          )}

          {isVerified && (
            <Link
              href="/login"
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg bg-black px-5 text-[10px] font-semibold tracking-[0.14em] text-white transition-colors hover:bg-[#242424]"
            >
              CONTINUE TO SIGN IN
            </Link>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-black/[0.07] pt-6 text-[9px] font-semibold tracking-wider text-[#444]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 hover:text-black hover:underline"
            >
              <ArrowLeft className="size-3" aria-hidden="true" />
              RETURN TO SIGN IN
            </Link>
            <Link
              href="/#footer-support"
              className="hover:text-black hover:underline"
            >
              CONTACT CONCIERGE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[620px] items-center justify-center bg-[#fbf9f9]">
          <RefreshCw className="size-5 animate-spin text-[#555]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
