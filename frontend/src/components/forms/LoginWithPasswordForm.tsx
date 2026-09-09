"use client";

import { useLoginWithPasswordForm } from "@/hooks";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
} from "@/components/ui";

function LoginWithPasswordForm() {
	const { form, onSubmit, loading } = useLoginWithPasswordForm();

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				dir="rtl">
				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>شماره تلفن</FormLabel>
							<FormControl>
								<Input
									autoFocus
									placeholder="09xxxxxxxxx"
									{...field}
									type="tel"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>رمز عبور</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="••••••••"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? (
						<Spinner className="size-4 me-2" />
					) : null}
					ورود
				</Button>
			</form>
		</Form>
	);
}

export default LoginWithPasswordForm;
