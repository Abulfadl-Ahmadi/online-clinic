import { RegisterForm } from "@/components/forms";
import { AuthShell } from "@/components/forms/AuthShell";

function RegisterPage() {
	return (
		<AuthShell title="ساخت حساب کاربری" description="شماره موبایل خود را تأیید کنید و اطلاعات لازم برای نوبت‌دهی را تکمیل کنید.">
			<RegisterForm />
		</AuthShell>
	);
}

export default RegisterPage;
