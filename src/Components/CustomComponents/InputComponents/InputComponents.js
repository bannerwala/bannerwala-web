function InputComponents({ type, label, placeholder = "Select an option", value, onChange, inputClassName, name, error, maxLength }) {
    return (
        <div>
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                maxLength={maxLength}
                className={`border px-3 py-2 rounded ${inputClassName}`}
            />
            {error && (
                <div className="text-red-600 text-sm mt-1">{error}</div>
            )}
        </div>

    );
}

export default InputComponents;
