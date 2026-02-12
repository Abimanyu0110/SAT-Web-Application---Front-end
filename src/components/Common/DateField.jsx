const DateField = ({
    label,
    name,
    value,
    onChange = () => { },
    min,
    max,
    required = false,
    disabled = false,
    flex = true
}) => {
    return (
        <div className={`${flex ? "flex items-center" : "flex flex-col"} gap-1 w-full`}>
            {label && (
                <label htmlFor={name} className={`text-sm font-medium text-gray-600 ${flex ? "w-1/3" : "w-full"}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                type="date"
                id={name}
                name={name}
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`${flex ? "w-2/3" : "w-full"} px-3 py-2 border border-gray-300 rounded-md outline-none
                focus:border-sky-700 disabled:bg-gray-100 text-sm`}
            />
        </div>
    );
};

export default DateField;