import React from "react";
import { Input } from "@headlessui/react";

interface PassengerInputProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function PassengerInput({ label, className, name, value, onChange, onBlur }: PassengerInputProps) {
    return (
        <div className={className}>
            <Input
                className={
                    "w-full rounded-xl bg-transparent px-5 py-1.5 text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light"
                }
                type={"text"}
                name={name}
                inputMode={"numeric"}
                pattern={"[0-9]*"}
                value={value.toString()}
                onBlur={onBlur}
                onChange={onChange}
            />
            <label htmlFor={name}>
                <h5 className={"absolute -top-3 left-5 w-fit bg-flyNow-component px-2"}>{label}</h5>
            </label>
        </div>
    );
}
