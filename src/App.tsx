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
        <>
            <div className="p-3">{name} +{timeDifference} hr(s)</div>
            <div className="p-3">
                <input
                    type="range"
                    min="0"
                    max="1439"
                    value={sliderVal}
                    onChange={handleChange}
                />
            </div>
            <div className="p-3">{timeString}</div>
        </>
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
        const newTime = Number(e.target.value)
        setCurrentTime(fromLocalTime(newTime, timeDiff))
    }

    return (
        <>
            <div className="grid place-items-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-8 place-items-center">
                    <div className="p-4">
                        <TimeSlot
                            name={"Matthew"}
                            timeDifference={0}
                            sliderVal={toLocalTime(currentTime, 0)}
                            timeString={getTime(toLocalTime(currentTime, 0))}
                            handleChange={changeTime(0)}
                        />
                    </div>

                    <div className="p-4">
                        <TimeSlot
                            name={"Elise"}
                            timeDifference={6}
                            sliderVal={toLocalTime(currentTime, 6)}
                            timeString={getTime(toLocalTime(currentTime, 6))}
                            handleChange={changeTime(6)}
                        />
                    </div>

                    <div className="p-4">
                        <TimeSlot
                            name={"Amanda"}
                            timeDifference={13}
                            sliderVal={toLocalTime(currentTime, 13)}
                            timeString={getTime(toLocalTime(currentTime, 13))}
                            handleChange={changeTime(13)}
                        />
                    </div>

                    <div className="p-4">
                        <TimeSlot
                            name={"Susan"}
                            timeDifference={18}
                            sliderVal={toLocalTime(currentTime, 18)}
                            timeString={getTime(toLocalTime(currentTime, 18))}
                            handleChange={changeTime(18)}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

function App() {
    return (
    <>
        <div className={"text-center text-5xl font-bold font-[roboto] p-10"}>Phone Call Timing</div>
        <div>
            <TimeSlotBoard/>
        </div>
    </>
    )
}

export default App