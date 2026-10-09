"use client";

import { useState, useEffect, useRef } from "react";
import { getDoctors } from "@/actions/clinic";
import {
	// Search,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

import { DoctorProfile } from "@/types";
import { DoctorCard } from "@/components/clinic";
import {
	Button,
	// Input ,
	Skeleton,
} from "@/components/ui";

export default function DoctorsPage() {
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);
	const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
	// const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [hasPrevious, setHasPrevious] = useState(false);
	const requestId = useRef(0);

	useEffect(() => {
		void loadDoctors();
		return () => { requestId.current += 1; };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const loadDoctors = async () => {
		const currentRequest = ++requestId.current;
		setLoading(true);
		setLoadError(false);
		try {
			const result = await getDoctors(page, true);
			if (currentRequest !== requestId.current) return;
			if (result.success) {
				setDoctors(result.data.results);
				setHasNext(!!result.data.next);
				setHasPrevious(!!result.data.previous);
				setTotalPages(Math.max(1, Math.ceil(result.data.count / 10)));
			} else {
				setLoadError(true);
			}
		} catch {
			if (currentRequest === requestId.current) setLoadError(true);
		} finally {
			if (currentRequest === requestId.current) setLoading(false);
		}
	};

	// const handleSearch = () => {
	// 	setPage(1);
	// 	loadDoctors();
	// };

	// const handleKeyPress = (e: React.KeyboardEvent) => {
	// 	if (e.key === "Enter") {
	// 		handleSearch();
	// 	}
	// };

	return (
		<div className="container mx-auto px-4 py-8" dir="rtl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">پزشکان کلینیک</h1>
				<p className="text-muted-foreground">
					پزشک مورد نظر خود را انتخاب و نوبت ویزیت دریافت کنید
				</p>
			</div>

			{/* Search */}
			{/* <div className="mb-8">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="جستجو بر اساس نام یا تخصص..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyPress={handleKeyPress}
							className="pr-10"
						/>
					</div>
					<Button onClick={handleSearch}>جستجو</Button>
				</div>
			</div> */}

			{/* Doctors Grid */}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-[350px]" />
					))}
				</div>
			) : loadError ? (
				<div className="flex flex-col items-center gap-4 py-12 text-center" role="alert">
					<p className="text-muted-foreground">دریافت فهرست پزشکان ممکن نشد. اتصال خود را بررسی کنید و دوباره تلاش کنید.</p>
					<Button variant="outline" onClick={() => void loadDoctors()}>تلاش دوباره</Button>
				</div>
			) : doctors.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">پزشکی یافت نشد</p>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{doctors.map((doctor) => (
							<DoctorCard key={doctor.id} doctor={doctor} />
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-4 mt-8">
							<Button
								variant="outline"
								size="icon"
								aria-label="صفحه قبل"
								onClick={() => setPage((p) => p - 1)}
								disabled={!hasPrevious}>
								<ChevronRight className="size-4" />
							</Button>
							<span className="text-sm">
								صفحه {page} از {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								aria-label="صفحه بعد"
								onClick={() => setPage((p) => p + 1)}
								disabled={!hasNext}>
								<ChevronLeft className="size-4" />
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
