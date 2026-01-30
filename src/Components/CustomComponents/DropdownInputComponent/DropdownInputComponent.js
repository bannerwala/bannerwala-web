import { useEffect, useState } from "react";

export default function DropdownInputComponent({
    name,
    dropdownClassName = "",
    labelClassName = "",
    placeholder = "",
    options = [],
    value = "",
    onChange = () => { },
    maxLength,
    error,
    disabled = false,
    numericOnly = false,
}) {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        if (!numericOnly || val === "" || /^\d+$/.test(val)) {
            setInputValue(val);
            setShowDropdown(true);
            onChange(val);
        }
    };

    const handleSelect = (option) => {
        setInputValue(option);
        onChange(option);
        setShowDropdown(false);
    };

    const filteredOptions =
        inputValue.trim() === ""
            ? options
            : options.filter(
                (option) =>
                    typeof option === "string" &&
                    option.toLowerCase().includes(inputValue.toLowerCase())
            );

    return (
        <div className="relative w-full">
            {name && <label className={`font-bold ${labelClassName}`}>{name}</label>}
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                inputMode={numericOnly ? "numeric" : "text"}
                className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-600" : "border-gray-300"
                    } ${dropdownClassName} ${disabled ? "cursor-not-allowed bg-gray-200 opacity-50" : ""}`}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <div
                    className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto ${dropdownClassName}`}
                >
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer"
                            onMouseDown={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
            {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
        </div>
    );
}
