import React from "react";
import { Input } from "@headlessui/react";
import calendarIcon from "../../../static/assets/calendar-color-icon.svg";

interface DatePickerProps {
    label: string;
    type: "departure" | "return";
    name: string;
    value: string;
    min: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatePicker({ label, name, value, min, onChange, type }: DatePickerProps) {
    return (
        <div className={"relative w-full"}>
            <label htmlFor={name}>
                <h5
                    className={
                        "absolute -top-4 flex items-center gap-2 bg-flyNow-component px-2 text-lg " +
                        (type === "departure" ? "left-6" : "right-6")
                    }>
                    {label}
                    <img className={"size-4 sm:hidden"} src={calendarIcon} alt={""} />
                </h5>
            </label>
            <Input
                name={name}
                className={
                    "w-full rounded-md bg-transparent px-5 py-3 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:rounded-xl sm:py-2"
                }
                type={"date"}
                min={min}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
