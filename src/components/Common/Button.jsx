import { CgSpinnerTwoAlt } from "react-icons/cg";

const Button = ({
    label,
    onClick,
    type = "button",
    disabled = false,
    bgAndTextColor = "bg-sky-700 text-white",
    rounded = "md",
    width = "full",
    padding = "px-4 py-2",
    loading = false,
    className
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${bgAndTextColor} ${padding} rounded-${rounded} hover:opacity-90 
            transition disabled:opacity-50 cursor-pointer w-${width} ${className}
            flex items-center justify-center`}
        >
            {loading ? (
                <CgSpinnerTwoAlt className="animate-spin text-2xl" />
            ) : (
                label
            )}
        </button>
    );
};

export default Button;
