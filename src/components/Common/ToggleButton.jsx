import React, { useState } from "react";

// --------------- icons --------------------
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const ToggleButton = ({
    falseTitle,
    trueTitle,
    falseIcon,
    trueIcon,
    toggleValue,
    onChange
}) => {

    return (
        <>
            <div className="border-2 dark:border-gray-200 flex p-0.5 rounded-full space-x-1 cursor-pointer"
                onClick={() => onChange(!toggleValue)}>
                <div className={`${!toggleValue && "bg-black text-white"} flex 
                justify-center rounded-full py-0.5 px-2 space-x-2 transition-colour- duration-300-`}>
                    {falseTitle && <span className="text-sm mx-auto-">
                        {falseTitle}
                    </span>
                    }
                    {falseIcon &&
                        <span className="text-xl my-auto mx-auto dark:text-gray-300">
                            {falseIcon}
                        </span>
                    }
                </div>
                <div className={`${toggleValue && "bg-black text-white dark:bg-white dark:text-gray-900"} flex justify-center 
                rounded-full py-0.5 px-2 space-x-1 transform duration-300`}>
                    {trueTitle && <span className="text-sm mx-auto-">
                        {trueTitle}
                    </span>
                    }
                    {trueIcon &&
                        <span className="text-xl my-auto mx-auto">
                            {trueIcon}
                        </span>
                    }
                </div>
            </div >
        </>
    )
}

export default ToggleButton