import { Color, selectRandomPureColorPair } from "./Genes/Color.ts";
import { Allele, Genome } from "./Genes/Genome.ts";
import { selectRandomMixColorGene } from "./Genes/MixColor.ts";

export type Lifeform = {
	id: number;
	parents: number[];
	genome: Genome;
};

export function breed(
	parentA: Lifeform,
	parentB: Lifeform,
	currentId: number,
): Lifeform {
	let leftColor: Color = Color.RED;
	let rightColor: Color = Color.RED;
	let leftMixColor: boolean = false;
	let rightMixColor: boolean = false;

	const parentASideToInheritFrom = Math.floor(Math.random() * 2);
	const parentBSideToInheritFrom = Math.floor(Math.random() * 2);

	switch (parentASideToInheritFrom) {
		case 0:
			leftColor = parentA.genome.color.left;
			leftMixColor = parentA.genome.mixColor.left;
			break;
		case 1:
			leftColor = parentA.genome.color.right;
			leftMixColor = parentA.genome.mixColor.right;
			break;
	}

	switch (parentBSideToInheritFrom) {
		case 0:
			rightColor = parentB.genome.color.left;
			rightMixColor = parentB.genome.mixColor.left;
			break;
		case 1:
			rightColor = parentB.genome.color.right;
			rightMixColor = parentB.genome.mixColor.right;
			break;
	}

	return {
		id: currentId + 1,
		parents: [parentA.id, parentB.id],
		genome: {
			color: {
				left: leftColor,
				right: rightColor,
			},
			mixColor: {
				left: leftMixColor,
				right: rightMixColor,
			},
		},
	};
}

export function getBackgroundColor(allele: Allele<Color>) {
	const left = allele.left;
	const right = allele.right;
	if (left === Color.RED && right === Color.RED) {
		return "bg-red";
	}
	if (left === Color.BLUE && right === Color.BLUE) {
		return "bg-blue";
	}
	if (left === Color.GREEN && right === Color.GREEN) {
		return "bg-green";
	}
	if (
		(left === Color.RED && right === Color.BLUE) ||
		(left === Color.BLUE && right === Color.RED)
	) {
		return "bg-purple";
	}
	if (
		(left === Color.RED && right === Color.GREEN) ||
		(left === Color.GREEN && right === Color.RED)
	) {
		return "bg-yellow";
	}
	if (
		(left === Color.BLUE && right === Color.GREEN) ||
		(left === Color.GREEN && right === Color.BLUE)
	) {
		return "bg-teal";
	}
}

export function generateLifeforms(amount: number) {
	const lifeforms: Lifeform[] = [];
	for (let i = 1; i <= amount; i++) {
		lifeforms.push({
			id: i,
			parents: [],
			genome: {
				color: selectRandomPureColorPair(),
				mixColor: selectRandomMixColorGene(),
			},
		});
	}

	return lifeforms;
}

export function mutateLifeform(lifeform: Lifeform) {
	const geneToMutate = Math.floor(Math.random() * 2);

	switch (geneToMutate) {
		case 0:
			mutateColor(lifeform);
			break;
		case 1:
			mutateMixColor(lifeform);
			break;
	}
}

export function mutateColor(lifeform: Lifeform) {
	let changedColor = false;
	while (!changedColor) {
		const colorToUse = Math.floor(Math.random() * 3);
		const sideToUse = Math.floor(Math.random() * 3);
		let color = Color.RED;

		switch (colorToUse) {
			case 0:
				color = Color.BLUE;
				break;
			case 1:
				color = Color.GREEN;
				break;
			default:
				color = Color.RED;
				break;
		}

		switch (sideToUse) {
			case 0:
				if (color !== lifeform.genome.color.left) {
					lifeform.genome.color.left = color;
					changedColor = true;
					break;
				} else {
					break;
				}
			default:
				if (color !== lifeform.genome.color.right) {
					lifeform.genome.color.right = color;
					changedColor = true;
					break;
				} else {
					break;
				}
		}
	}
	console.log(lifeform);
	return;
}

export function mutateMixColor(lifeform: Lifeform) {
	const sideToUse = Math.floor(Math.random() * 3);

	switch (sideToUse) {
		case 0:
			lifeform.genome.mixColor.left = !lifeform.genome.mixColor.left;
			break;
		default:
			lifeform.genome.mixColor.right = !lifeform.genome.mixColor.right;
			break;
	}
	return;
}
