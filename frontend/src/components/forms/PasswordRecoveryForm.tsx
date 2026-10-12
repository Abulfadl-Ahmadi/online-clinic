"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { sendOtpAction, resetPasswordAction } from "@/actions";
import { Button, Input } from "@/components/ui";

export function PasswordRecoveryForm() {
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [sent, setSent] = useState(false);
	const [busy, setBusy] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState("");

	async function sendCode() {
		if (!/^09\d{9}$/.test(phone)) { setError("شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود."); return; }
		setError(""); setBusy(true);
		try {
			const data = new FormData(); data.set("phone_number", phone);
			const result = await sendOtpAction(data, "reset_password");
			if (result.success) { setSent(true); toast.success(result.message); }
			else setError(result.message);
		} catch { setError("ارسال کد انجام نشد. دوباره تلاش کنید."); }
		finally { setBusy(false); }
	}

	async function resetPassword(event: FormEvent) {
		event.preventDefault();
		if (!/^\d{6}$/.test(code) || password.length < 8) { setError("کد ۶ رقمی و رمز عبور حداقل ۸ کاراکتری وارد کنید."); return; }
		setError(""); setBusy(true);
		try {
			const data = new FormData(); data.set("phone_number", phone); data.set("code", code); data.set("new_password", password);
			const result = await resetPasswordAction(data);
			if (result.success) { setDone(true); toast.success(result.message); }
			else setError(result.message);
		} catch { setError("تغییر رمز عبور انجام نشد. دوباره تلاش کنید."); }
		finally { setBusy(false); }
	}

	if (done) return <div className="space-y-5"><p role="status" className="leading-8 text-[var(--brand-ink)]">رمز عبور تغییر کرد. اکنون می‌توانید وارد حساب خود شوید.</p><Link href="/auth/login" className="auth-submit brand-link-ring inline-flex min-h-12 w-full items-center justify-center rounded-xl font-bold">بازگشت به ورود</Link></div>;

	return <form onSubmit={resetPassword} className="flex flex-col gap-5" dir="rtl">
		<div className="flex flex-col gap-2"><label htmlFor="recovery-phone" className="font-semibold text-[var(--brand-ink)]">شماره موبایل</label>
			<Input id="recovery-phone" className="auth-input" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={phone} disabled={sent || busy} aria-invalid={!!error && !sent} onChange={event => { setPhone(event.target.value); setError(""); }} placeholder="09123456789" />
			<p className="text-sm text-[var(--brand-muted)]">کد تأیید به این شماره پیامک می‌شود.</p>
		</div>
		{sent && <>
			<div className="flex flex-col gap-2"><label htmlFor="recovery-code" className="font-semibold text-[var(--brand-ink)]">کد تأیید</label><Input id="recovery-code" className="auth-input text-center text-xl font-bold tabular-nums" type="text" inputMode="numeric" autoComplete="one-time-code" dir="ltr" value={code} maxLength={6} onChange={event => { setCode(event.target.value); setError(""); }} /></div>
			<div className="flex flex-col gap-2"><label htmlFor="recovery-password" className="font-semibold text-[var(--brand-ink)]">رمز عبور جدید</label><Input id="recovery-password" className="auth-input" type="password" autoComplete="new-password" dir="ltr" value={password} onChange={event => { setPassword(event.target.value); setError(""); }} /><p className="text-sm text-[var(--brand-muted)]">رمز عبور باید دست‌کم ۸ کاراکتر داشته باشد.</p></div>
		</>}
		{error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm leading-7 text-destructive">{error}</p>}
		{sent ? <><Button type="submit" className="auth-submit w-full" disabled={busy}>{busy ? "در حال تغییر…" : "تغییر رمز عبور"}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => { setSent(false); setCode(""); setError(""); }}>ویرایش شماره</Button></> : <Button type="button" className="auth-submit w-full" disabled={busy} onClick={sendCode}>{busy ? "در حال ارسال…" : "ارسال کد تأیید"}</Button>}
		<Link href="/auth/login" className="brand-link-ring self-center text-sm font-semibold text-[var(--brand-ink)] underline underline-offset-4">بازگشت به ورود</Link>
	</form>;
}
