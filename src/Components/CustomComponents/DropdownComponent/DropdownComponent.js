import { useEffect, useRef, useState } from "react";

function DropdownComponent({
    label,
    options = [],
    value,
    onChange,
    dropdownClassName = "",
    error,
    disabled = false,
    isArray = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        if (!disabled) setIsOpen(!isOpen);
    };
    const selected = Array.isArray(value) ? value : value ? value.split(", ").map(v => v.trim()) : [];

    const handleOptionChange = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(v => v !== option)
            : [...selected, option];

        if (isArray) {
            onChange(newSelected);
        } else {
            onChange(newSelected.join(", "));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${dropdownClassName}`} ref={dropdownRef}>
            <label className="font-semibold mb-1 block">{label}</label>
            <div
                className={`mt-2 p-2 border rounded bg-white cursor-pointer ${disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                onClick={toggleDropdown}
            >
                {selected.length > 0 ? selected.join(", ") : `Select ${label}`}
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow">
                    {options.map((option, idx) => (
                        <label
                            key={idx}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleOptionChange(option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
    );
}

export default DropdownComponent;