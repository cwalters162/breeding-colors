interface ButtonProps {
	onClick: () => void;
	text: string;
}

export default function Button({ onClick, text }: ButtonProps) {
	return (
		<button
			className={"w-48 rounded-2xl bg-gray-700 p-1 text-white"}
			onClick={onClick}
		>
			{text}
		</button>
	);
}
