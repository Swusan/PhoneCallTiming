import './App.css'
import type {ChangeEventHandler} from "react";
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
                    className=""
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

    return (
        <>
            <div className="grid place-items-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-8 place-items-center">
                    <TimeSlot
                        name={"Matthew"}
                        timeDifference={0}
                        sliderVal={toLocalTime(currentTime, 0)}
                        timeString={getTime(toLocalTime(currentTime, 0))}
                        handleChange={changeTime(0)}
                    />

                    <TimeSlot
                        name={"Elise"}
                        timeDifference={6}
                        sliderVal={toLocalTime(currentTime, 6)}
                        timeString={getTime(toLocalTime(currentTime, 6))}
                        handleChange={changeTime(6)}
                    />
                    <TimeSlot
                        name={"Amanda"}
                        timeDifference={13}
                        sliderVal={toLocalTime(currentTime, 13)}
                        timeString={getTime(toLocalTime(currentTime, 13))}
                        handleChange={changeTime(13)}
                    />
                    <TimeSlot
                        name={"Susan"}
                        timeDifference={16}
                        sliderVal={toLocalTime(currentTime, 16)}
                        timeString={getTime(toLocalTime(currentTime, 16))}
                        handleChange={changeTime(16)}
                    />
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