import { useState } from "react";
import { useSnackbarContext } from "./SnackBarContextProvider.tsx";
import {
	breed,
	generateLifeforms,
	getBackgroundColor,
	Lifeform,
} from "./system/Lifeform.ts";
import CssSetup from "./components/CssSetup.tsx";
import Button from "./components/Button.tsx";
import {
	baseLineDiscoveries,
	Genome,
	isGenomeEqual,
} from "./system/Genes/Genome.ts";
import DiscoverySection from "./components/DiscoverySection.tsx";
import ChildrenSection from "./components/ChildrenSection.tsx";

function App() {
	const [totalLifeforms, setTotalLifeforms] = useState(8);

	const [generations, setGenerations] = useState<Lifeform[][]>([
		generateLifeforms(8),
		[],
	]);
	const [currentGeneration, setCurrentGeneration] = useState(0);

	const [firstParent, setFirstParent] = useState<Lifeform | null>(null);
	const [secondParent, setSecondParent] = useState<Lifeform | null>(null);

	const [discoveredCombinations, setDiscoveredCombinations] = useState<
		(Genome | null)[]
	>([...baseLineDiscoveries]);

	const snackBarCtx = useSnackbarContext();

	function handleParentOnClick(id: number) {
		if (firstParent !== null && firstParent.id === id) {
			setFirstParent(null);
			return;
		}

		if (secondParent !== null && secondParent.id === id) {
			setSecondParent(null);
			return;
		}

		if (firstParent === null) {
			const result = generations[currentGeneration].find(
				(lifeform) => lifeform.id === id,
			);
			if (result === undefined) {
				return;
			} else {
				setFirstParent(result);
				return;
			}
		}

		if (secondParent === null) {
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
		if (generations[currentGeneration + 1].length >= 8) {
			return;
		}

		if (!firstParent || !secondParent) {
			snackBarCtx.displayMsg("Must have two parents selected to breed!");
			return;
		}

		const newChild = breed(firstParent, secondParent, totalLifeforms);
		handleDiscoveredNewColor(newChild, discoveredCombinations);

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
		if (generations[currentGeneration + 1].length < 8) {
			snackBarCtx.displayMsg("You need 8 children for the next generation!");
			return;
		}
		setCurrentGeneration((prevState) => prevState + 1);
		setFirstParent(null);
		setSecondParent(null);
		setGenerations((prevState) => {
			const nextGenCreation = prevState.map((g) => g.map((l) => l));
			if (nextGenCreation[currentGeneration + 2] === undefined) {
				nextGenCreation[currentGeneration + 2] = [];
			}

			return nextGenCreation;
		});
	}

	function handlePreviousGeneration() {
		if (currentGeneration === 0) {
			snackBarCtx.displayMsg("Cannot go back anymore generations!");
			return;
		}

		setCurrentGeneration((prevState) => prevState - 1);
		setFirstParent(null);
		setSecondParent(null);
	}

	function handleDiscoveredNewColor(
		newLifeform: Lifeform,
		currentDiscoveries: (Genome | null)[],
	) {
		const result = currentDiscoveries.findIndex((genome) => {
			if (genome == null) {
				return false;
			}
			return isGenomeEqual(newLifeform.genome, genome);
		});

		if (result !== -1) {
			return;
		}
		//find an empty slot
		const emptySlot = currentDiscoveries.findIndex(
			(element) => element === null,
		);
		if (emptySlot === -1) {
			snackBarCtx.displayMsg("No empty Discovery Slots");
		}

		const newDiscoveries = [...currentDiscoveries];
		newDiscoveries[emptySlot] = newLifeform.genome;

		setDiscoveredCombinations(newDiscoveries);

		return;
	}

	return (
		<div>
			<div className={"h-screen w-screen bg-black"}>
				<div
					className={
						"flex w-full flex-col justify-center px-2 pt-2 text-center text-white"
					}
				>
					<CssSetup />
					<h1>Welcome to Breeding Colors!</h1>
					<p>
						Select two objects and click "breed" the child will then be shown at
						the bottom. Try to get all the colors!
					</p>
					<span>Current Generation: {currentGeneration + 1}</span>
				</div>
				<div className={"flex flex-col justify-center px-4"}>
					<div className={"flex flex-col items-center gap-2 px-2 pb-2"}>
						<h1 className={"text-white"}>Parents</h1>
						<div
							className={
								"flex max-w-[16rem] flex-wrap justify-center gap-4 pb-2"
							}
						>
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
										className={` min-h-[2.5rem] min-w-[2.5rem] rounded-full ${bgColor}-700 hover:${bgColor}-400 ${selectedBorder}`}
										onClick={() => {
											return handleParentOnClick(parent.id);
										}}
									/>
								);
							})}
						</div>
						<Button onClick={handleBreedOnClick} text={"Breed"} />
					</div>
					<ChildrenSection
						generations={generations}
						currentGeneration={currentGeneration}
					/>
					<div
						className={
							"flex flex-col-reverse items-center gap-4 pt-2 sm:flex-row sm:justify-center"
						}
					>
						<Button
							onClick={handlePreviousGeneration}
							text={"Previous Generation"}
						/>
						<Button
							onClick={handleNextGenerationOnClick}
							text={"Next Generation"}
						/>
					</div>
				</div>
				<div>
					<span
						className={
							"flex flex-wrap justify-center p-2 text-center text-white"
						}
					>
						Scroll down to see what combinations you have discovered!
					</span>
				</div>
				{snackBarCtx.isDisplayed && (
					<div className="fixed inset-x-0 bottom-0 flex justify-center pb-4">
						<div className="rounded bg-yellow-600 p-4 text-white">
							{snackBarCtx.msg}
						</div>
					</div>
				)}
			</div>
			<DiscoverySection discoveredCombinations={discoveredCombinations} />
		</div>
	);
}

export default App;
