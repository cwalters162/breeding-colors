import { Color } from "./Color.ts";

export type Allele<T> = {
	left: T;
	right: T;
};

export type Genome = {
	color: Allele<Color>;
	mixColor: Allele<boolean>;
};
