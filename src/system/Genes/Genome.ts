import { Color } from "./Color.ts";

export type Allele<T> = {
	left: T;
	right: T;
};

export type Genome = {
	color: Allele<Color>;
	mixColor: Allele<boolean>;
};

export const baseLineDiscoveries: (Genome | null)[] = [
	{
		color: {
			left: Color.RED,
			right: Color.RED,
		},
		mixColor: {
			left: false,
			right: false,
		},
	},
	{
		color: {
			left: Color.BLUE,
			right: Color.BLUE,
		},
		mixColor: {
			left: false,
			right: false,
		},
	},
	{
		color: {
			left: Color.GREEN,
			right: Color.GREEN,
		},
		mixColor: {
			left: false,
			right: false,
		},
	},
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
	null,
];

export function isGenomeEqual(a: Genome, b: Genome) {
	const aColor = Object.values(a.color);
	const bColor = Object.values(b.color);

	const aMixColor = Object.values(a.mixColor);
	const bMixColor = Object.values(b.mixColor);

	for (let i = 0; i < aColor.length; i++) {
		if (aColor[i] != bColor[i]) {
			return false;
		}
	}
	for (let i = 0; i < aMixColor.length; i++) {
		if (aMixColor[i] != bMixColor[i]) {
			return false;
		}
	}
	return true;
}
