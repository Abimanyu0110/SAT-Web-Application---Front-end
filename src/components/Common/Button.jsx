const Button = ({
    label,
    onClick,
    type = "button",
    disabled = false,
    bgAndTextColor = "bg-sky-700 text-white",
    rounded = "md",
    width = "full",
    padding = "px-4 py-2",
    className
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${bgAndTextColor} ${padding} rounded-${rounded} hover:opacity-90 
            transition disabled:opacity-50 cursor-pointer w-${width} ${className}`}
        // className={`${className || "bg-sky-700 text-white px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 cursor-pointer w-full"} `}
        >
            {label}
        </button>
    );
};

export default Button;
