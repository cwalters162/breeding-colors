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
];
