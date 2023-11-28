import { useState } from "react";
enum Color {
	RED = "R", // Red is Dominant over Blue
	BLUE = "B", // Blue is Dominant over Green
	GREEN = "G", // Green is Hardest to Get
}

type Allele = {
	left: Color;
	right: Color;
};

type Lifeform = {
	id: number;
	colorGene: Allele;
};

function selectRandomPureColorPair(): Allele {
	const value = Math.floor(Math.random() * 4);
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

	function generateLifeforms(amount: number) {
		const lifeforms: Lifeform[] = [];
		for (let i = 1; i <= amount; i++) {
			lifeforms.push({
				id: i,
				colorGene: selectRandomPureColorPair(),
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

	function handleBreedOnClick() {
		if (generations[currentGeneration + 1].length >= 10) {
			return;
		}

		let left: Color = Color.RED;
		let right: Color = Color.RED;
		const FirstParentSideToInheritFrom = Math.floor(Math.random() * 2);
		const SecondParentSideToInheritFrom = Math.floor(Math.random() * 2);

		if (!firstParent || !secondParent) {
			return;
		}

		switch (FirstParentSideToInheritFrom) {
			case 0:
				left = firstParent.colorGene.left;
				break;
			case 1:
				left = firstParent.colorGene.right;
				break;
		}
		switch (SecondParentSideToInheritFrom) {
			case 0:
				right = secondParent.colorGene.left;
				break;
			case 1:
				right = secondParent.colorGene.right;
				break;
		}
		const newChild = {
			id: totalLifeforms + 1,
			colorGene: {
				left,
				right,
			},
		};

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
					the bottom.
				</p>
				<span>Current Generation: {currentGeneration + 1}</span>
			</div>
			<div className={"flex justify-center border-y-2 border-black px-4"}>
				<div
					className={"flex flex-col gap-2 border-x-2 border-black px-2 pb-2 "}
				>
					<h1>Parents</h1>
					<div className={"flex flex-wrap justify-center gap-4 pb-2"}>
						{generations[currentGeneration].map((parent) => {
							const bgColor = getBackgroundColor(parent.colorGene);
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
						className={"rounded-2xl bg-gray-700 p-1 text-white"}
						onClick={() => handleBreedOnClick()}
					>
						BREED
					</button>
				</div>
				<div className={"flex flex-col gap-2 border-r-2 border-black px-2"}>
					<h1>Child Result</h1>
					<div className={"flex flex-wrap gap-4 pb-2"}>
						{generations[currentGeneration + 1].length == 0 ? (
							<div className={"min-h-[2rem] min-w-[2rem]"} />
						) : (
							generations[currentGeneration + 1].map((child) => {
								return (
									<div
										key={child.id}
										className={`min-h-[2rem] min-w-[2rem] ${getBackgroundColor(
											child.colorGene,
										)}-700`}
									/>
								);
							})
						)}
					</div>
					<button
						className={"rounded-2xl bg-gray-700 p-1 text-white"}
						onClick={handleNextGenerationOnClick}
					>
						Start next Generation
					</button>
				</div>
			</div>
		</div>
	);
}

function getBackgroundColor(allele: Allele) {
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
