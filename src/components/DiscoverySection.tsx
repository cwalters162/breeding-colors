import QuestionMark from "../assets/QuestionMark.svg";
import { getBackgroundColor } from "../system/Lifeform.ts";
import { Genome } from "../system/Genes/Genome.ts";
import SelectedDiscoverySection from "./SelectedDiscoveryContent.tsx";

interface DiscoverySectionProps {
	discoveredCombinations: (Genome | null)[];
	onClick: (genome: Genome) => void;
	selectedDiscovery: Genome | null;
}

export default function DiscoverySection({
	discoveredCombinations,
	onClick,
	selectedDiscovery,
}: DiscoverySectionProps) {
	return (
		<div className={"h-screen w-screen bg-gray-900"}>
			<div className={"flex flex-col items-center gap-4 px-2 pt-2 text-white"}>
				<h1 className={"text-white"}>Discovered Combinations</h1>
				<div
					className={"flex max-w-[16rem] flex-wrap justify-center gap-4 px-2"}
				>
					{discoveredCombinations.map((genome, index) => {
						if (!genome) {
							return (
								<img
									key={`discovery-${index}`}
									src={QuestionMark}
									alt={"Question Mark"}
									width={32}
									height={32}
									className={`max-h-[2.5rem] min-h-[2.5rem] min-w-[2.5rem] rounded-full border-2 border-gray-400`}
								/>
							);
						}
						return (
							<div
								key={`${genome.color.left}-${genome.color.right}-${genome.mixColor.left}-${genome.mixColor.right}`}
								className={`min-h-[2.5rem] min-w-[2.5rem] rounded-full ${getBackgroundColor(
									genome.color,
								)}-700`}
								onClick={() => onClick(genome)}
							/>
						);
					})}
				</div>
			</div>
			{selectedDiscovery && (
				<SelectedDiscoverySection selectedDiscovery={selectedDiscovery} />
			)}
		</div>
	);
}
