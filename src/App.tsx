import './App.css'
import type {ChangeEvent, ChangeEventHandler} from "react";
import {useState} from "react";
import { v4 as uuid } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

type TimeSlotProps = {
    name: string
    timeDifference: number
    sliderVal: number
    timeString: string
    id: string
    handleChange: ChangeEventHandler<HTMLInputElement>
    onRemove: (removeUUID: string) => void
}

type TimeSlotBoardProps = {
    slots: {name: string, offset: number, id: string}[]
    currentTime: number
    changeTime: (timeDiff:number) => ChangeEventHandler<HTMLInputElement>
    onRemove: (removeUUID: string) => void
}

type InputFormProps = {
    onInsert: (name: string, offset: number, id: string) => void
    onClearAll: () => void
}

type RemoveButtonProps = {
    onRemove: (removeUUID: string) => void
    slotUUID: string
}

function RemoveButton({onRemove, slotUUID}: RemoveButtonProps) {
    const [isActive, setIsActive] = useState(false);

    return (
        <button
                className={` ml-auto ${isActive ? "text-gray-600" : "text-[#949494]"}`}
                type="button"
                onClick={() => {
                    setIsActive(true)
                    onRemove(slotUUID)
                }}
            >
                <svg viewBox="0 0 456 511.82" width="21" fill="currentColor">
                    <path d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
                </svg>
            </button>
    )
}

function TimeSlot({name, timeDifference, sliderVal, timeString, id, handleChange, onRemove}: TimeSlotProps) {
    return (
        <div className="flex flex-col w-full max-w-[320px] px-6 py-4 bg-[rgb(255,83,83)] rounded-lg mx-auto">
            <RemoveButton 
                onRemove={onRemove}
                slotUUID={id}
            />
            <div className="text-center font-karla text-lg">{name} +{timeDifference} hr(s)</div>
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

function TimeSlotBoard({slots, currentTime, changeTime, onRemove}: TimeSlotBoardProps) {
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
            <div className="grid place-items-center w-full px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center w-full w-max-4xl">
                    <AnimatePresence>
                        {slots.map(
                            (timeSlot) => (
                                <motion.div key={timeSlot.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.15 }} className="flex justify-center">
                                    <TimeSlot
                                        name={timeSlot.name}
                                        timeDifference={timeSlot.offset}
                                        sliderVal={toLocalTime(currentTime, timeSlot.offset)}
                                        timeString={getTime(toLocalTime(currentTime, timeSlot.offset))}
                                        id={timeSlot.id}
                                        handleChange={changeTime(timeSlot.offset)}
                                        onRemove={onRemove}
                                    />
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
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
            <div className="w-fit flex flex-col gap-10 items-center">
                <div className="w-fit h-fit p-4 flex flex-col items-center bg-[rgb(255,130,28)] rounded-lg">
                    <span className="font-karla p-2 font-bold text-xl">Add a Friend</span>
                    <div className="py-2">
                        <label className="font-karla px-2" htmlFor="fname">Name: </label>
                        <input
                            className="bg-gray-400 rounded-lg px-2 h-10 sm:h-6"
                            type="text"
                            id="fname"
                            placeholder="Enter Name..."
                        />
                    </div>
                    <div className="py-2">
                        <label className="font-karla px-2" htmlFor="fnum">Time Offset (+ hr[s]): </label>
                        <input
                            className="bg-gray-400 px-2 rounded-lg h-10 sm:h-6"
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
                                onInsert((document.getElementById("fname") as HTMLInputElement).value.trim(), currentOffsetInput, uuid());
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
                    className="px-4 py-2 font-karla bg-[rgb(255,83,83)] rounded-lg cursor-pointer transition-transform duration-300 ease-in-out shadow-s hover:bg-cyan-600 hover:shadow-xl active:bg-cyan-800 active:shadow-xl active:translate-y-px"
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
    const [timeSlots, setTimeSlots] = useState<{name: string, offset: number, id: string}[]>([]);
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

    const onRemove = (removeUUID: string) : void => {
        setTimeSlots(timeSlots.filter(item => item.id != removeUUID))
    }

    return (
    <>
        <div className={"w-screen text-center text-5xl font-bold tracking-widest font-zen-dots p-8 text-[rgb(255,83,83)]"}>- - - - PHONE CALL TIMING - - - -</div>
        <div className="grid grid-cols-2 gap-2 justify-items-center">
            <InputForm 
            onInsert={(name: string, offset: number, id: string) => {
                setTimeSlots([...timeSlots, { name, offset, id }]);
            }}
            onClearAll={onClearAll}
            />
            <TimeSlotBoard 
            slots={timeSlots}
            currentTime={currentTime}
            changeTime={changeTime}
            onRemove={onRemove}
            />
        </div>
    </>
    )
}

export default App