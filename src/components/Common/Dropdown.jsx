// const Dropdown = ({
//     label,
//     name,
//     value,
//     onChange = () => { },
//     options = [],
//     required = false,
//     disabled = false,
//     flex = true
// }) => {
//     return (
//         <div className={`${flex ? "flex items-center" : "flex flex-col"} gap-1 w-full`}>
//             {label && (
//                 <label htmlFor={name} className={`text-sm font-medium text-gray-600 ${flex ? "w-1/3" : "w-full"}`}>
//                     {label}
//                 </label>
//             )}

//             <select
//                 id={name}
//                 name={name}
//                 value={value}          // must be ""
//                 onChange={(e) => onChange(e.target.value)}
//                 disabled={disabled}
//                 required={required}
//                 className={`${flex ? "w-2/3" : "w-full"} px-3 py-2 border border-gray-300 rounded-md
//                 focus:border-sky-700 text-sm`}
//             >
//                 {/* ✅ Select option */}
//                 <option value="">Select</option>

//                 {options.map((option, index) => (
//                     <option key={index} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// export default Dropdown;


const Dropdown = ({
    label,
    name,
    value,
    onChange = () => { },
    options = [],
    required = false,
    disabled = false,
    flex = "flex flex-col", // default layout
}) => {
    const isRow = flex.includes("flex-row");

    return (
        <div className={`${flex} gap-1 w-full`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`text-sm font-medium text-gray-600 ${isRow ? "w-full md:w-1/3" : "w-full"
                        }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value} // can be ""
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                className={`${isRow ? "w-full md:w-2/3" : "w-full"
                    } px-3 py-2 border border-gray-300 rounded-md focus:border-sky-700 text-sm`}
            >
                {/* Default option */}
                <option value="">Select</option>

                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
