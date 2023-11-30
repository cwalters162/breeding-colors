import { useState } from "react";
import { useSnackbarContext } from "./SnackBarContextProvider.tsx";

enum Color {
	RED = "R", // Red is Dominant over Blue
	BLUE = "B", // Blue is Dominant over Green
	GREEN = "G", // Green is Hardest to Get
}

type Allele<T> = {
	left: T;
	right: T;
};

type Lifeform = {
	id: number;
	parents: number[];
	genome: {
		color: Allele<Color>;
		mixColor: Allele<boolean>;
	};
};

function selectRandomPureColorPair(): Allele<Color> {
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

function selectRandomMixColorGene(): Allele<boolean> {
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

function CssSetup() {
	return (
		<>
			<div className={"bg-green-700 hover:bg-green-400"}></div>
			<div className={"bg-red-700 hover:bg-red-400"}></div>
			<div className={"bg-blue-700 hover:bg-blue-400"}></div>
		</>
	);
}

function App() {
	const [totalLifeforms, setTotalLifeforms] = useState(10);

	const [generations, setGenerations] = useState<Lifeform[][]>([
		generateLifeforms(10),
		[],
	]);
	const [currentGeneration, setCurrentGeneration] = useState(0);

	const [firstParent, setFirstParent] = useState<Lifeform | null>(null);
	const [secondParent, setSecondParent] = useState<Lifeform | null>(null);

	const snackBarCtx = useSnackbarContext();

	function generateLifeforms(amount: number) {
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

	function handleParentOnClick(id: number) {
		if (firstParent !== null && firstParent.id === id) {
			setFirstParent(null);
			return;
		} else if (secondParent !== null && secondParent.id === id) {
			setSecondParent(null);
			return;
		} else if (firstParent === null && secondParent === null) {
			const result = generations[currentGeneration].find(
				(lifeform) => lifeform.id === id,
			);
			if (result === undefined) {
				return;
			} else {
				setFirstParent(result);
				return;
			}
		} else if (firstParent !== null && secondParent === null) {
			const result = generations[currentGeneration].find(
				(lifeform) => lifeform.id === id,
			);
			if (result === undefined) {
				return;
			} else {
				setSecondParent(result);
				return;
			}
		}
	}

	function crossover(
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

	function handleBreedOnClick() {
		if (generations[currentGeneration + 1].length >= 10) {
			return;
		}

		if (!firstParent || !secondParent) {
			return;
		}

		const newChild = crossover(firstParent, secondParent, totalLifeforms);

		setTotalLifeforms((prevState) => {
			return prevState + 1;
		});
		setGenerations((prevState) => {
			const newGenerations = prevState.map((g) => g.map((l) => l));

			if (!newGenerations[currentGeneration + 1]) {
				newGenerations[currentGeneration + 1] = [];
			}

			newGenerations[currentGeneration + 1].push(newChild);

			return newGenerations;
		});
	}

	function handleNextGenerationOnClick() {
		if (generations[currentGeneration + 1].length < 10) {
			snackBarCtx.displayMsg("You need 10 children for the next generation!");
			return;
		}
		setCurrentGeneration((prevState) => prevState + 1);
		setFirstParent(null);
		setSecondParent(null);
		setGenerations((prevState) => {
			const nextGenCreation = prevState.map((g) => g.map((l) => l));
			nextGenCreation[currentGeneration + 2] = [];

			return nextGenCreation;
		});
	}

	return (
		<div className={"h-screen w-screen"}>
			<div className={"flex w-full flex-col justify-center text-center"}>
				<CssSetup />
				<h1>Welcome to Breeding Colors!</h1>
				<p>
					Select two objects and click "breed" the child will then be shown at
					the bottom. Try to get all the colors!
				</p>
				<span>Current Generation: {currentGeneration + 1}</span>
			</div>
			<div
				className={"flex flex-col justify-center border-y-2 border-black px-4"}
			>
				<div
					className={
						"flex flex-col items-center gap-2 border-x-2 border-b-2 border-black px-2 pb-2"
					}
				>
					<h1>Parents</h1>
					<div className={"flex flex-wrap justify-center gap-4 pb-2"}>
						{generations[currentGeneration].map((parent) => {
							const bgColor = getBackgroundColor(parent.genome.color);
							let selectedBorder = "";

							if (
								parent.id === firstParent?.id ||
								parent.id === secondParent?.id
							) {
								selectedBorder = "border-2 border-yellow-400";
							}
							return (
								<div
									key={parent.id}
									className={`min-h-[2rem] min-w-[2rem] ${bgColor}-700 hover:${bgColor}-400 ${selectedBorder}`}
									onClick={() => {
										return handleParentOnClick(parent.id);
									}}
								/>
							);
						})}
					</div>
					<button
						className={"w-1/2 rounded-2xl bg-gray-700 p-1 text-white"}
						onClick={() => handleBreedOnClick()}
					>
						BREED
					</button>
				</div>
				<div
					className={
						"flex flex-col items-center gap-2 border-x-2 border-black px-2 pb-2"
					}
				>
					<h1>Child Result</h1>
					<div className={"flex flex-wrap justify-center gap-4 pb-2"}>
						{generations[currentGeneration + 1].length == 0 ? (
							<div className={"min-h-[2rem] min-w-[2rem]"} />
						) : (
							generations[currentGeneration + 1].map((child) => {
								return (
									<div
										key={child.id}
										className={`min-h-[2rem] min-w-[2rem] ${getBackgroundColor(
											child.genome.color,
										)}-700`}
									/>
								);
							})
						)}
					</div>
					<button
						className={"w-1/2 rounded-2xl bg-gray-700 p-1 text-white"}
						onClick={handleNextGenerationOnClick}
					>
						Start next Generation
					</button>
				</div>
			</div>
			{snackBarCtx.isDisplayed && (
				<div className="fixed inset-x-0 bottom-0 flex justify-center pb-4">
					<div className="rounded bg-yellow-600 p-4 text-white">
						{snackBarCtx.msg}
					</div>
				</div>
			)}
		</div>
	);
}

function getBackgroundColor(allele: Allele<Color>) {
	const left = allele.left;
	const right = allele.right;
	if (left === Color.RED || right === Color.RED) {
		return "bg-red";
	}
	if (left === Color.BLUE || right === Color.BLUE) {
		return "bg-blue";
	}
	if (left === Color.GREEN && right === Color.GREEN) {
		return "bg-green";
	}
}

export default App;
