import { Allele } from "./Genome.ts";

export enum Color {
	RED = "R", // Red is Dominant over Blue
	BLUE = "B", // Blue is Dominant over Green
	GREEN = "G", // Green is Hardest to Get
}

export function selectRandomPureColorPair(): Allele<Color> {
	const value = Math.floor(Math.random() * 3);
	switch (value) {
		case 0:
			return {
				left: Color.BLUE,
				right: Color.BLUE,
			};
		case 1:
			return {
				left: Color.GREEN,
				right: Color.GREEN,
			};
		default:
			return {
				left: Color.RED,
				right: Color.RED,
			};
	}
}
