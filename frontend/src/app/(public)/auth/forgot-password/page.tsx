"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { sendOtpAction, resetPasswordAction } from "@/actions";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

export default function ForgotPasswordPage() {
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [sent, setSent] = useState(false);
	const [busy, setBusy] = useState(false);
	const [done, setDone] = useState(false);

	async function sendCode() {
		if (!/^09\d{9}$/.test(phone)) { toast.error("شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود."); return; }
		setBusy(true);
		try {
			const data = new FormData();
			data.set("phone_number", phone);
			const result = await sendOtpAction(data, "reset_password");
			if (result.success) { setSent(true); toast.success("کد تأیید ارسال شد."); }
			else toast.error(result.message);
		} catch { toast.error("ارسال کد انجام نشد. دوباره تلاش کنید."); }
		finally { setBusy(false); }
	}

	async function resetPassword(event: React.FormEvent) {
		event.preventDefault();
		if (!/^\d{6}$/.test(code) || password.length < 8) {
			toast.error("کد ۶ رقمی و رمز عبور حداقل ۸ کاراکتری وارد کنید."); return;
		}
		setBusy(true);
		try {
			const data = new FormData();
			data.set("phone_number", phone);
			data.set("code", code);
			data.set("new_password", password);
			const result = await resetPasswordAction(data);
			if (result.success) { setDone(true); toast.success(result.message); }
			else toast.error(result.message);
		} catch { toast.error("تغییر رمز عبور انجام نشد. دوباره تلاش کنید."); }
		finally { setBusy(false); }
	}

	return <main className="flex min-h-screen items-center justify-center p-4" dir="rtl">
		<Card className="w-full max-w-sm">
			<CardHeader><CardTitle>بازیابی رمز عبور</CardTitle></CardHeader>
			<CardContent>
				{done ? <Link href="/auth/login" className="text-primary underline">بازگشت به ورود</Link> :
				<form onSubmit={resetPassword} className="flex flex-col gap-4">
					<label className="flex flex-col gap-2">شماره موبایل
						<Input type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={phone} disabled={sent || busy} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxxx" />
					</label>
					{sent && <>
						<label className="flex flex-col gap-2">کد تأیید
							<Input type="text" inputMode="numeric" autoComplete="one-time-code" dir="ltr" value={code} maxLength={6} onChange={e => setCode(e.target.value)} />
						</label>
						<label className="flex flex-col gap-2">رمز عبور جدید
							<Input type="password" autoComplete="new-password" dir="ltr" value={password} onChange={e => setPassword(e.target.value)} />
						</label>
						<Button type="submit" disabled={busy}>تغییر رمز عبور</Button>
						<Button type="button" variant="outline" disabled={busy} onClick={() => { setSent(false); setCode(""); }}>ویرایش شماره</Button>
					</>}
					{!sent && <Button type="button" disabled={busy} onClick={sendCode}>ارسال کد تأیید</Button>}
					<Link href="/auth/login" className="text-primary underline">بازگشت به ورود</Link>
				</form>}
			</CardContent>
		</Card>
	</main>;
}
