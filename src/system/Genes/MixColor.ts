import { Allele } from "./Genome.ts";

export function selectRandomMixColorGene(): Allele<boolean> {
	const choice = Math.floor(Math.random() * 4);

	switch (choice) {
		case 0:
			return {
				left: true,
				right: true,
			};
		case 1:
			return {
				left: true,
				right: false,
			};
		case 2:
			return {
				left: false,
				right: true,
			};
		default:
			return {
				left: false,
				right: false,
			};
	}
}
