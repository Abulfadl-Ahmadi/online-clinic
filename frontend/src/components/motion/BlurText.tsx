"use client";

/** RTL word-by-word reveal; words stay intact (unlike letter splitting in Persian). */
export function BlurText({ text }: { text: string }) {
	const words = text.split(" ");
	return (
		<span aria-label={text} className="hero-blur-text">
			{words.map((word, index) => (
				<span key={`${index}-${word}`} aria-hidden="true" className="hero-blur-word" style={{ animationDelay: `${index * 65}ms` }}>
					{word}{index < words.length - 1 ? "\u00a0" : ""}
				</span>
			))}
		</span>
	);
}
