import './App.css'
import type {ChangeEvent, ChangeEventHandler, FormEventHandler} from "react";
import {useState} from "react";

type TimeSlotProps = {
    name: string
    timeDifference: number
    sliderVal: number
    timeString: string
    handleChange: ChangeEventHandler<HTMLInputElement>
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

function TimeSlotBoard() {
    const [currentTime, setCurrentTime] = useState(0)
    const [currentOffsetInput, setCurrentOffsetInput] = useState<number | string>("");

    function toLocalTime(base: number, offset: number): number {
        return (base + offset * 60 + 1440) % 1440
    }

    function fromLocalTime(local: number, offset: number): number {
        return (local - offset * 60 + 1440) % 1440
    }

    function getTime(time : number) {
        const hour: number = Math.trunc(time / 60)

        return ((hour == 0 || hour == 12) ? String(12) : String(hour % 12))
            + ":" + String(time % 60).padStart(2, "0") + " " + (time >= 720 ? "p.m." : "a.m.")
    }

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

    const handleOffsetInput = (e: ChangeEvent<HTMLInputElement>) => {
        const numVal = Number(e.target.value)

        if (!isNaN(numVal) && numVal > Number(e.target.max)) {
            setCurrentOffsetInput(23);
        } else if (!isNaN(numVal) && numVal < Number(e.target.min)) {
            setCurrentOffsetInput(0);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <div>
                    <label className="font-karla px-2" htmlFor="fname">Name: </label>
                    <input
                        className="bg-gray-500 rounded-lg px-2"
                        type="text"
                        id="fname"
                        placeholder="Enter Name..."
                    />
                    <label className="font-karla px-2" htmlFor="fnum">Time Offset: </label>
                    <input
                        className="bg-gray-500 px-2 rounded-lg"
                        type="number"
                        value = {currentOffsetInput}
                        min="0"
                        max="23"
                        onChange={(e) => setCurrentOffsetInput(e.target.value)}
                        onBlur={handleOffsetInput}
                        id="fnum"
                    />
                </div>
                <div className="grid place-items-center">
                    <div className="grid grid-cols-2 gap-8 place-items-center">
                
                    </div>
                </div>
            </div>
        </>
    )
}

function App() {
    return (
    <>
        <div className={"w-screen text-center text-5xl font-bold tracking-widest font-zen-dots p-8 text-[rgb(255,83,83)]"}>- - - - PHONE CALL TIMING - - - -</div>
        <div>
            <TimeSlotBoard/>
        </div>
    </>
    )
}

export default App