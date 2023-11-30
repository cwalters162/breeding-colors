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
import QuestionMark from "./assets/QuestionMark.svg";

function App() {
	const [totalLifeforms, setTotalLifeforms] = useState(10);

	const [generations, setGenerations] = useState<Lifeform[][]>([
		generateLifeforms(10),
		[],
	]);
	const [currentGeneration, setCurrentGeneration] = useState(0);

	const [firstParent, setFirstParent] = useState<Lifeform | null>(null);
	const [secondParent, setSecondParent] = useState<Lifeform | null>(null);

	const [discoveredColors, setDiscoveredColors] = useState(
		Array.from(Array(10).fill(false)),
	);

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
		if (generations[currentGeneration + 1].length >= 10) {
			return;
		}

		if (!firstParent || !secondParent) {
			snackBarCtx.displayMsg("Must have two parents selected to breed!");
			return;
		}

		const newChild = breed(firstParent, secondParent, totalLifeforms);

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

	function handlePreviousGeneration() {
		if (currentGeneration === 0) {
			snackBarCtx.displayMsg("Cannot go back anymore generations!");
			return;
		}

		setCurrentGeneration((prevState) => prevState - 1);
		setFirstParent(null);
		setSecondParent(null);
	}

	return (
		<div className={"h-screen w-screen bg-black"}>
			<div
				className={
					"flex w-full flex-col justify-center px-2 text-center text-white"
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
									className={` min-h-[2rem] min-w-[2rem] rounded-full ${bgColor}-700 hover:${bgColor}-400 ${selectedBorder}`}
									onClick={() => {
										return handleParentOnClick(parent.id);
									}}
								/>
							);
						})}
					</div>
					<Button onClick={handleBreedOnClick} text={"Breed"} />
				</div>
				<div className={"flex flex-col items-center gap-2 px-2 pb-2"}>
					<h1 className={"text-white"}>Children</h1>
					<div className={"flex min-h-[5rem] flex-wrap justify-center gap-4"}>
						{generations[currentGeneration + 1].map((child) => {
							return (
								<div
									key={child.id}
									className={`max-h-[2rem] min-h-[2rem] min-w-[2rem] rounded-full ${getBackgroundColor(
										child.genome.color,
									)}-700`}
								/>
							);
						})}
					</div>
					<div className={"flex flex-col gap-4 pt-2 sm:flex-row"}>
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
			</div>
			<div className={"flex flex-col items-center gap-4 text-white"}>
				<h1 className={"text-white"}>Discovered Colors</h1>
				<div className={"flex flex-wrap justify-center gap-4 px-2"}>
					{discoveredColors.map((isDiscovered, index) => {
						if (!isDiscovered) {
							return (
								<img
									key={`${index}-${isDiscovered}`}
									src={QuestionMark}
									alt={"Question Mark"}
									width={32}
									height={32}
									className={`max-h-[2rem] min-h-[2rem] min-w-[2rem] rounded-full border-2 border-gray-400`}
								/>
							);
						}

						return (
							<div
								className={`max-h-[2rem] min-h-[2rem] min-w-[2rem] rounded-full bg-red-700`}
							/>
						);
					})}
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

export default App;
