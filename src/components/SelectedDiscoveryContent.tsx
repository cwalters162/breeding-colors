import { Genome } from "../system/Genes/Genome.ts";

interface SelectedDiscoverySectionProps {
	selectedDiscovery: Genome;
}

export default function SelectedDiscoverySection({
	selectedDiscovery,
}: SelectedDiscoverySectionProps) {
	return (
		<div className={"flex flex-col items-center gap-4 pt-2 text-white"}>
			<span>Color</span>
			<div className={"flex gap-4"}>
				<span>Left: {`${selectedDiscovery.color.left}`}</span>
				<span>Right: {`${selectedDiscovery.color.right}`}</span>
			</div>
			<span>Mix Color </span>
			<div className={"flex gap-4"}>
				<span>Left: {`${selectedDiscovery.mixColor.left}`}</span>
				<span>Right: {`${selectedDiscovery.mixColor.right}`}</span>
			</div>
		</div>
	);
}
