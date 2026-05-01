import './App.css'
import type {ChangeEvent, ChangeEventHandler} from "react";
import {useState} from "react";

type TimeSlotProps = {
    name: string
    timeDifference: number
    sliderVal: number
    timeString: string
    handleChange: ChangeEventHandler<HTMLInputElement>
}

type TimeSlotBoardProps = {
    slots: {name: string, offset: number}[]
    currentTime: number
    changeTime: (timeDiff:number) => ChangeEventHandler<HTMLInputElement>
}

type InputFormProps = {
    onInsert: (name: string, offset: number) => void
    onClearAll: () => void
}

function TimeSlot({name, timeDifference, sliderVal, timeString, handleChange}: TimeSlotProps) {
    return (
        <div className="px-12 py-4 bg-[rgb(255,83,83)] rounded-lg">
            <div className="p-3 text-center font-karla text-lg">{name} +{timeDifference} hr(s)</div>
            <div className="p-3 text-center">
                <input
                    className="accent-emerald-600"
                    type="range"
                    min="0"
                    max="1439"
                    step="5"
                    value={sliderVal}
                    onChange={handleChange}
                />
            </div>
            <div className="p-3 text-center font-orbitron font-semibold">{timeString}</div>
        </div>
    )
}

function TimeSlotBoard({slots, currentTime, changeTime}: TimeSlotBoardProps) {
    function toLocalTime(base: number, offset: number): number {
        return (base + offset * 60 + 1440) % 1440
    }

    function getTime(time : number) {
        const hour: number = Math.trunc(time / 60)

        return ((hour == 0 || hour == 12) ? String(12) : String(hour % 12))
            + ":" + String(time % 60).padStart(2, "0") + " " + (time >= 720 ? "p.m." : "a.m.")
    }

    return (
        <>
            <div className="grid place-items-center">
                <div className="grid grid-cols-2 gap-8 place-items-center">
                    {slots.map(
                        (timeSlot) => (
                            <div>
                                <TimeSlot
                                    name={timeSlot.name}
                                    timeDifference={timeSlot.offset}
                                    sliderVal={toLocalTime(currentTime, timeSlot.offset)}
                                    timeString={getTime(toLocalTime(currentTime, timeSlot.offset))}
                                    handleChange={changeTime(timeSlot.offset)}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    )
}

function InputForm({onInsert, onClearAll}: InputFormProps) {
    const [currentOffsetInput, setCurrentOffsetInput] = useState<number | string>("");

    const handleOffsetInput = (e: ChangeEvent<HTMLInputElement>) => {
        const numVal = Number(e.target.value)

        if (!isNaN(numVal) && numVal > Number(e.target.max)) {
            setCurrentOffsetInput(Number(23));
        } else if (!isNaN(numVal) && numVal < Number(e.target.min)) {
            setCurrentOffsetInput(Number(0));
        }
    };

    const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!(e.target.value === "")) {
          setCurrentOffsetInput(Number(e.target.value))  
        } else {
            setCurrentOffsetInput("");
        }
    }

    return (
        <>
            <div className="w-fit flex flex-col gap-20 items-center">
                <div className="w-fit h-fit p-4 flex flex-col items-center bg-[rgb(255,130,28)] rounded-lg">
                    <span className="font-karla p-2 font-bold text-xl">Add a Friend</span>
                    <div className="py-2">
                        <label className="font-karla px-2" htmlFor="fname">Name: </label>
                        <input
                            className="bg-gray-400 rounded-lg px-2"
                            type="text"
                            id="fname"
                            placeholder="Enter Name..."
                        />
                    </div>
                    <div className="py-2">
                        <label className="font-karla px-2" htmlFor="fnum">Time Offset (+ hr[s]): </label>
                        <input
                            className="bg-gray-400 px-2 rounded-lg"
                            type="number"
                            value = {currentOffsetInput}
                            min="0"
                            max="23"
                            onChange={handleOffsetChange}
                            onBlur={handleOffsetInput}
                            placeholder="Offset.."
                            id="fnum"
                        />
                    </div>
                    <div className='p-2'>
                        <button
                        className='px-2 py-1 font-karla bg-[rgb(255,83,83)] rounded-lg cursor-pointer transition-transform duration-300 ease-in-out shadow-s hover:bg-cyan-600 hover:shadow-xl active:bg-cyan-800 active:shadow-xl active:translate-y-px'
                        type="button"
                        onClick={() => {
                            if (typeof currentOffsetInput === "number" && currentOffsetInput >= 0 && currentOffsetInput <= 23 && (document.getElementById("fname") as HTMLInputElement).value.trim() !== "") {
                                onInsert((document.getElementById("fname") as HTMLInputElement).value.trim(), currentOffsetInput);
                                setCurrentOffsetInput("");
                                (document.getElementById("fname") as HTMLInputElement).value = "";
                            } else {
                                if (document.getElementById("fname") as HTMLInputElement && (document.getElementById("fname") as HTMLInputElement).value.trim() === "") {
                                    alert("Please enter a name.");
                                } else if (typeof currentOffsetInput !== "number" || currentOffsetInput < 0 || currentOffsetInput > 23) {
                                    alert("Enter a valid number.")
                                } else {
                                    alert("Unknown error. Please try again.");
                                }
                            }
                        }}
                        >
                        Insert
                        </button>
                </div>
                </div>
                <div>
                <button
                    className="px-2 py-1 font-karla bg-[rgb(255,83,83)] rounded-lg cursor-pointer transition-transform duration-300 ease-in-out shadow-s hover:bg-cyan-600 hover:shadow-xl active:bg-cyan-800 active:shadow-xl active:translate-y-px"
                    type="button"
                    onClick={onClearAll}
                >
                Clear All
                </button>
                </div>
            </div>
        </>
    )
}

function App() {
    const [timeSlots, setTimeSlots] = useState<{name: string, offset: number}[]>([]);
    const [currentTime, setCurrentTime] = useState(0);

    function fromLocalTime(local: number, offset: number): number {
        return (local - offset * 60 + 1440) % 1440
    }

    // TODO: Limit Names to 12 chars

    const changeTime = (timeDiff: number): ChangeEventHandler<HTMLInputElement> =>
        (e) => {

        const val = Number(e.target.value);
        const max = Number(e.target.max);
        const step = 5;
        let adjustedValue: number;

        if (val > max - step) {
            adjustedValue = max;
        } else {
            adjustedValue = Math.round(val / step) * step;
        }

        setCurrentTime(fromLocalTime(adjustedValue, timeDiff))
    }

    const onClearAll = (): void => {
        setTimeSlots([]);
    }


    return (
    <>
        <div className={"w-screen text-center text-5xl font-bold tracking-widest font-zen-dots p-8 text-[rgb(255,83,83)]"}>- - - - PHONE CALL TIMING - - - -</div>
        <div className="grid grid-cols-2 justify-items-center">
            <InputForm 
            onInsert={(name: string, offset: number) => {
                setTimeSlots([...timeSlots, { name, offset }]);
            }}
            onClearAll={onClearAll}
            />
            <TimeSlotBoard 
            slots={timeSlots}
            currentTime={currentTime}
            changeTime={changeTime}
            />
        </div>
    </>
    )
}

export default App