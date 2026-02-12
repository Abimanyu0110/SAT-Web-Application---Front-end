import { useEffect, useState } from "react";
import axios from "axios";

// ----------- Components -------------------
import Button from "./Button";

import useAdmin from "../../../Hooks/useAdmin";

const TableNew = ({
    title,
    columns = [],
    apiURL,
    assignData = () => [],
    addClick,
    viewClick,
    editClick,
    deleteClick,
    limit = 10,
    refreshKey = 0,
    showRefresh = true,

    showAdd = true,
    showView = true,
    showEdit = true,
    showDelete = true
}) => {

    const { header, admin, formatDate } = useAdmin();

    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const totalPages = Math.ceil(totalCount / limit);
    const skip = (currentPage - 1) * limit;

    const fetchTableData = async () => {
        if (!apiURL) return;

        setLoading(true);

        try {
            const { data: res } = await axios.post(
                apiURL,
                {
                    id: admin.id,
                    role: admin.role,
                    skip,
                    limit,
                },
                header
            );

            if (res.code === 200) {
                setTotalCount(res.data.count);
                setData(assignData(res.data.data || []));
            } else {
                setData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Table API Error:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const onManualRefresh = () => {
        setCurrentPage(1);
        fetchTableData();
    };

    useEffect(() => {
        fetchTableData();
    }, [apiURL, currentPage, refreshKey]);

    const onPageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (

        <div className="bg-white flex flex-col justify-between h-full border border-gray-200">

            {/* ===== Header + Table Wrapper ===== */}
            <div>

                {/* Header */}
                {/* <div className="flex bg-amber-700- items-center justify-between px-5 pt-4 border-b-">
                    <div className="w-full flex items-center space-x-2">
                        <h2 className="text-lg text-sky-800 font-semibold">{title}</h2>
                        <p className="text-sm text-gray-500">
                            {totalCount}
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        {showRefresh && (
                            <Button
                                label="Refresh"
                                className="hover:text-white hover:bg-sky-700 text-sm ml-2"
                                width="20"
                                rounded="md"
                                padding="px-4 py-1"
                                onClick={() => onManualRefresh()}
                            />
                        )}

                        {showAdd &&
                            <Button
                                label="Add"
                                className={` hover:text-white hover:bg-sky-700 text-sm`}
                                width="20"
                                rounded="md"
                                padding="px-4 py-1"
                                onClick={addClick}
                            />
                        }
                    </div>

                </div> */}

                {/* ===== Header ===== */}
                <div className="px-5 py-5 pt-4 border-b-">

                    {/* Row 1: Title + Search (lg) + Buttons */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                        {/* Left Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                            {/* Title */}
                            <div className="flex items-center space-x-2 shrink-0">
                                <h2 className="text-lg text-sky-800 font-semibold">{title}</h2>
                                <p className="text-sm text-gray-500">{totalCount}</p>
                            </div>

                        </div>

                        {/* Search (VISIBLE ONLY ON LARGE SCREENS) */}
                        <div className="hidden lg:block flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                     focus:outline-none focus:ring-1 focus:ring-sky-600"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-2 shrink-0">
                            {showRefresh && (
                                <Button
                                    label="Refresh"
                                    className="hover:text-white hover:bg-sky-700 text-sm"
                                    width="20"
                                    rounded="md"
                                    padding="px-4 py-1"
                                    onClick={onManualRefresh}
                                />
                            )}

                            {showAdd && (
                                <Button
                                    label="Add"
                                    className="hover:text-white hover:bg-sky-700 text-sm"
                                    width="20"
                                    rounded="md"
                                    padding="px-4 py-1"
                                    onClick={addClick}
                                />
                            )}
                        </div>
                    </div>

                    {/* Search (SMALL DEVICES ONLY – BELOW TITLE & BUTTONS) */}
                    <div className="block lg:hidden mt-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                 focus:outline-none focus:ring-1 focus:ring-sky-600"
                        />
                    </div>

                </div>
                {/* ----- Above is new code ------------- */}

                {/* Table */}
                <div className="overflow-x-auto px-4 py-2">
                    <div className="h-full overflow-y-auto shadow-lg rounded-lg">
                        <table className="w-full border-collapse border border-gray-200 shadow-xl rounded-xl">
                            <thead className="bg-sky-700 text-white sticky top-0 z-10">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-4 py-3 text-left text-sm font-medium border-b"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-sm font-medium border-b">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="text-center py-6 text-gray-500"
                                        >
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 border-b"
                                        >
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className="px-4 py-3 text-sm"
                                                >
                                                    {col.key === "sno"
                                                        ? skip + index + 1
                                                        : col.key === "dob" || col.key === "date"
                                                            ? formatDate(row[col.key])
                                                            : row[col.key]
                                                    }
                                                    {/* {col.key === "sno"
                                                        ? skip + index + 1
                                                        : row[col.key]
                                                    } */}
                                                </td>
                                            ))}

                                            <td className="px-4 py-3 space-x-2 flex justify-center">
                                                {showView &&
                                                    <Button
                                                        label="View"
                                                        bgAndTextColor={"bg-green-600 text-white "}
                                                        className={` hover:bg-green-700 text-xs`}
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => viewClick(row)}
                                                    />
                                                }
                                                {showEdit &&
                                                    <Button
                                                        label="Edit"
                                                        bgAndTextColor={"bg-amber-600 text-white "}
                                                        className={` hover:bg-amber-700 text-xs`}
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => editClick(row)}
                                                    />
                                                }
                                                {showDelete &&
                                                    <Button
                                                        label="Delete"
                                                        bgAndTextColor={"bg-red-600 text-white "}
                                                        className={` hover:bg-red-700 text-xs`}
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => deleteClick(row)}
                                                    />
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ===== Pagination (ALWAYS BOTTOM) ===== */}
            <div className="bg-cyan-400- flex justify-center items-center p-4 space-x-5 text-sm">
                <Button
                    label="Prev"
                    disabled={currentPage === 1}
                    bgAndTextColor={"bg-sky-700 text-white "}
                    className={` hover:bg-sky-600 text-sm`}
                    rounded="md"
                    width="20"
                    padding="px-2 py-1"
                    onClick={() => onPageChange(currentPage - 1)}
                />

                <span className="text-md font-semibold text-cyan-800">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    label="Next"
                    disabled={currentPage === totalPages}
                    bgAndTextColor={"bg-sky-700 text-white "}
                    className={` hover:bg-sky-600 text-sm`}
                    rounded="md"
                    width="20"
                    padding="px-2 py-1"
                    onClick={() => onPageChange(currentPage + 1)}
                />
            </div>

        </div>

    );
};

export default TableNew;
