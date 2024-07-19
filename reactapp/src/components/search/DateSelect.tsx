import React from "react";
import { Input } from "@headlessui/react";
import calendarIcon from "../../static/assets/calendar-color-icon.svg";

interface DatePickerProps {
    label: string;
    type: "departure" | "return";
    name: string;
    value: string;
    min: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function DateSelect({ label, name, value, min, onChange, type, className }: DatePickerProps) {
    return (
        <div className={className}>
            <label htmlFor={name}>
                <h5 className={"absolute -top-4 left-4 flex items-center gap-2 bg-flyNow-component px-2 sm:left-6"}>
                    {label}
                    <img className={"size-4"} src={calendarIcon} alt={""} />
                </h5>
            </label>
            <Input
                name={name}
                className={
                    "w-full rounded-sm bg-transparent px-5 py-3 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:rounded-xl sm:py-2"
                }
                type={"date"}
                min={min}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
