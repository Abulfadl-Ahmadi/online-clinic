import { AuthShell } from "@/components/forms/AuthShell";
import { PasswordRecoveryForm } from "@/components/forms/PasswordRecoveryForm";

export default function ForgotPasswordPage() {
	return <AuthShell title="بازیابی رمز عبور" description="شماره موبایل خود را وارد کنید تا برای تعیین رمز جدید، کد تأیید بفرستیم.">
		<PasswordRecoveryForm />
	</AuthShell>;
}
