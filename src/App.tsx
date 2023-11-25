import {useEffect, useState} from 'react';

enum Gene {
    // Maybe make this an integer value
    // for a real RGB to make a dynamic color system for cooler breading
    RED = "R",
    GREEN = "G",
    BLUE = "B",
}

type Shape = {
    id: number
    geneActive: Gene
    geneRecessive: Gene
}

function selectRandomGene(): Gene {
    const value = Math.floor(Math.random() * 4)
    switch (value) {
        case 0: return Gene.RED;
        case 1: return Gene.GREEN;
        default: return Gene.BLUE;
    }
}

function generateShapes(amount: number) {
    const shapes: Shape[] = [];
    for (let i = 0; i < amount; i++) {
        shapes.push({
            id: i,
            geneActive: selectRandomGene(),
            geneRecessive: selectRandomGene(),
        })
    }
    return shapes
}

function App() {
    const [parents, setParents] = useState<Shape[]>(generateShapes(10));
    const [firstParent, setFirstParent] = useState<Shape | null>(null)
    const [secondParent, setSecondParent] = useState<Shape | null>(null)
    const [child, setChild] = useState<Shape | null>(null)

    useEffect(() => {
        console.log(firstParent)
        console.log(secondParent)
        console.log(child)
    }, [child]);

    function handleParentOnClick(id: number) {
        if (firstParent === null) {
            setFirstParent(parents[id]);
        } else if (secondParent === null) {
            setSecondParent(parents[id]);
        } else if (firstParent?.id === id) {
            setFirstParent(null);
        } else if (secondParent?.id === id) {
            setSecondParent(null);
        }
    }

    function handleBreedOnClick() {
        let childActiveGene = Gene.RED;

        if (!firstParent || !secondParent) {
            return
        }

        if (firstParent.geneActive === secondParent.geneActive) {
            //recessive gene might take over active gene

            setChild({
                id: firstParent.id + secondParent.id,
                geneActive: firstParent.geneActive,
                geneRecessive: firstParent.geneRecessive,
            })
        } else {
            const parentToInheritFrom = Math.floor(Math.random() * 2);
            console.log(parentToInheritFrom)
            switch (parentToInheritFrom) {
                case 0: childActiveGene = firstParent.geneActive; break;
                case 1: childActiveGene = secondParent.geneActive; break;
            }

            //which recessive gene take over?

            setChild({
                id: firstParent.id + secondParent.id + 100,
                geneActive: childActiveGene,
                geneRecessive: firstParent.geneRecessive,
            })
        }
    }

    return (
        <div className={"w-screen h-screen"}>
            <div>
                <h1>Welcome to Breeding Colors!</h1>
                <p>Select two objects and click "breed" the child will then be shown at the bottom.</p>
                   <div>
                       <div>Colors</div>
                       <div className={"bg-red-700 hover:bg-red-400"}>RED</div>
                       <div className={"bg-green-700 hover:bg-green-400"}>GREEN</div>
                       <div className={"bg-blue-700 hover:bg-blue-400"}>BLUE</div>
                       <div className={"border-2 border-yellow-400"}>border gold</div>
                   </div>
            </div>
            <div>
               <h1>Parents</h1>
               <div className={"flex justify-center gap-4"}>
               {parents.map((parent)=> {
                   const bgColor = getBackgroundColor(parent.geneActive);
                   let selectedBorder = "";

                   if (parent.id === firstParent?.id || parent.id === secondParent?.id) {
                       selectedBorder = "border-2 border-yellow-400"
                   }

                   return (<div key={parent.id} className={`min-w-[2rem] min-h-[2rem] ${bgColor}-700 hover:${bgColor}-400 ${selectedBorder}`} onClick={() => handleParentOnClick(parent.id)}/>)
               })}
               </div>
                <button className={"bg-gray-700 text-white rounded-2xl p-1"} onClick={() => handleBreedOnClick()}>BREED</button>
           </div>
            <div>
                <h1>Child Result</h1>
                {child && <div
                    key={child.id}
                    className={`min-w-[2rem] min-h-[2rem] ${getBackgroundColor(child.geneActive)}-700`}/>}
            </div>
   </div>
  )
}

function getBackgroundColor(gene: Gene) {
    switch (gene) {
        case Gene.RED: return "bg-red";
        case Gene.GREEN: return "bg-green";
        case Gene.BLUE: return "bg-blue";
    }
}

export default App
