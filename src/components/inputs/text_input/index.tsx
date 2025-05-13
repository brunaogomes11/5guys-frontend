import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    className,
    labelClassName = "block mb-1",
    containerClassName,
    ...rest
}) => (
    <div className={`text-white ${containerClassName}`}>
        <label className={labelClassName}>
            {label}
            <br />
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full text-black bg-[#EAEAEA] rounded-[0.4rem] px-2 py-1 ${className}`}
                {...rest}
            />
        </label>
    </div>
);

export default TextInput;