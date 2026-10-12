import { LoginForm } from "@/components/forms";
import { AuthShell } from "@/components/forms/AuthShell";

function LoginPage() {
	return (
		<AuthShell title="ورود به حساب کاربری" description="برای درخواست و پیگیری نوبت، با رمز عبور یا کد پیامکی وارد شوید.">
			<LoginForm />
		</AuthShell>
	);
}

export default LoginPage;
