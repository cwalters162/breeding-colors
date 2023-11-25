import {useState} from 'react';
enum Color {
    RED = "R", // Red is Dominant over Blue
    BLUE = "B", // Blue is Dominant over Green
    GREEN = "G", // Green is Hardest to Get
}

type Allele = {
    left: Color,
    right: Color,
}

type Lifeform = {
    id: number
    colorGene: Allele
}

function selectRandomPureColorPair(): Allele {
    const value = Math.floor(Math.random() * 4)
    switch (value) {
        case 0: return {
            left: Color.BLUE,
            right: Color.BLUE,
        };
        case 1: return {
            left: Color.GREEN,
            right: Color.GREEN,
        };
        default: return {
            left: Color.RED,
            right: Color.RED,
        };
    }
}

function App() {
    const [totalLifeforms, setTotalLifeforms] = useState(0)
    const [generations, setGenerations] = useState<Lifeform[][]>([generateLifeforms(10)])
    const [currentGeneration, setCurrentGeneration] = useState<Lifeform[]>(generations[0]);
    const [firstParent, setFirstParent] = useState<Lifeform | null>(null)
    const [secondParent, setSecondParent] = useState<Lifeform | null>(null)
    const [child, setChild] = useState<Lifeform | null>(null)

    function generateLifeforms(amount: number) {
        const lifeforms: Lifeform[] = [];
        for (let i = 1; i <= amount; i++) {
            lifeforms.push({
                id: i,
                colorGene: selectRandomPureColorPair(),
            })
        }

        return lifeforms
    }

    function handleParentOnClick(id: number) {
        if (firstParent !== null && firstParent.id === id) {
            setFirstParent(null);
            return
        } else if (secondParent !== null && secondParent.id === id) {
            setSecondParent(null);
            return
        } else if (firstParent === null && secondParent === null) {
            const result = currentGeneration.find(lifeform => lifeform.id === id)
            if (result === undefined) {
                return
            } else {
                setFirstParent(result);
                return
            }
        } else if ( firstParent !== null && secondParent === null) {
            const result = currentGeneration.find(lifeform => lifeform.id === id)
            if (result === undefined) {
                return
            } else {
                setSecondParent(result);
                return
            }
        }

    }

    function handleBreedOnClick() {
        let left: Color = Color.RED;
        let right: Color = Color.RED;
        const FirstParentSideToInheritFrom = Math.floor(Math.random() * 2);
        const SecondParentSideToInheritFrom = Math.floor(Math.random() * 2);

        if (!firstParent || !secondParent) {
            return
        }

        switch (FirstParentSideToInheritFrom) {
            case 0: left = firstParent.colorGene.left; break;
            case 1: left = firstParent.colorGene.right; break;
        }
        switch (SecondParentSideToInheritFrom) {
            case 0: right = secondParent.colorGene.right; break;
            case 1: right = secondParent.colorGene.right; break;
        }
        const newChild = {id: totalLifeforms + 1, colorGene: {left, right},};
        console.log(newChild.colorGene)
        setChild(newChild);
    }

    return (
        <div className={"w-screen h-screen"}>
            <div>
                <h1>Welcome to Breeding Colors!</h1>
                <p>Select two objects and click "breed" the child will then be shown at the bottom.</p>
            </div>
            <div className={"flex justify-between px-4 border-2 border-black"}>
                <div className={"flex flex-col border-r-2 border-black pr-2 pb-2"}>
                   <h1>Parents</h1>
                   <div className={"flex justify-center gap-4 pb-2"}>
                   {currentGeneration.map((parent)=> {
                       const bgColor = getBackgroundColor(parent.colorGene);
                       let selectedBorder = "";

                       if (parent.id === firstParent?.id || parent.id === secondParent?.id) {
                           selectedBorder = "border-2 border-yellow-400"
                       }
                        console.log(parent.id)
                       return (<div key={parent.id} className={`min-w-[2rem] min-h-[2rem] ${bgColor}-700 hover:${bgColor}-400 ${selectedBorder}`} onClick={() => handleParentOnClick(parent.id)}/>)
                   })}
                   </div>
                    <button className={"bg-gray-700 text-white rounded-2xl p-1"} onClick={() => handleBreedOnClick()}>BREED</button>
               </div>
                <div className={"flex flex-col border-l-2 border-black pl-2"}>
                    <h1>Child Result</h1>
                    {child && <div
                        key={child.id}
                        className={`min-w-[2rem] min-h-[2rem] ${getBackgroundColor(child.colorGene)}-700`}/>}
                </div>
            </div>
   </div>
  )
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

export default App
