import { getBackgroundColor, Lifeform } from "../system/Lifeform.ts";
interface ChildrenSectionProps {
	generations: Lifeform[][];
	currentGeneration: number;
}

export default function ChildrenSection({
	generations,
	currentGeneration,
}: ChildrenSectionProps) {
	return (
		<div className={"flex flex-col items-center gap-2 px-2 pb-2"}>
			<h1 className={"text-white"}>Children</h1>
			<div
				className={
					"flex min-h-[6rem] max-w-[16rem] flex-wrap justify-center gap-4"
				}
			>
				{generations[currentGeneration + 1].map((child) => {
					return (
						<div
							key={child.id}
							className={`max-h-[2.5rem] min-h-[2.5rem] min-w-[2.5rem] rounded-full ${getBackgroundColor(
								child.genome.color,
							)}-700`}
						/>
					);
				})}
			</div>
		</div>
	);
}
