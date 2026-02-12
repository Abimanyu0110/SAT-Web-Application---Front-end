import { useEffect, useState } from "react";

// ------------- Components -----------------
import Button from "./Button";

const Table = ({
    title,
    columns = [],
    data = [],
    totalCount = 0,
    addClick,
    viewClick,
    editClick,
    deleteClick,
    currentPage,
    totalPages,
    onPageChange,

    apiURL,
    assignData = () => { },
    onSearch
}) => {

    const [apiURLName, setApiURLName] = useState();

    const fetchTable = async () => {
        if (apiURLName) {
            setLoading(true);
            setIsAPICalling(true);

            try {

                const { data } = await axios.post(
                    apiURLName,
                    {
                        requestFrom,
                        loginUserType: admin.userType,
                        loginUserId: admin.id,
                        clientId: admin.clientId,
                        skip: pagination.skip,
                        ...getQuery(showField),
                    },
                    header,
                );

                if (data.code === 200) {
                    setTotal(data.data.count);
                    setFields(assignData(data.data.response || []));
                    setLoading(false);
                    setIsAPICalling(false);
                    setRefreshLoading(false)
                } else if (data.code === 401) {
                    Cookies.remove("AD");
                    Cookies.remove("clientId");
                    Cookies.remove("firstName");
                    Cookies.remove("lastName");
                    Cookies.remove("accessToken");
                    navigate(NavLinks.HOME);
                } else {
                    setFields(assignData([]));
                    setLoading(false);
                    setIsAPICalling(false);
                    setRefreshLoading(false)
                }
            } catch (err) {
                authFailure(err);
                setFields([]);
                setLoading(false);
                setRefreshLoading(false)
                setIsAPICalling(false);
                console.log(JSON.stringify(err))
            }
        }
    };

    const loadMore = async (skipLimit) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                apiURL,
                {
                    loginUserType: admin.userType,
                    loginUserId: admin.id,
                    clientId: admin.clientId,
                    skip: skipLimit,
                    ...getQuery(showField),
                    requestFrom,

                },
                header
            );
            if (data.code === 200) {
                //setFields([...fields, ...assignData(data.response)]);
                setFields(assignData(data.data.response));
                setPagination({
                    ...pagination,
                    skip: skipLimit,//parseInt(pagination.skip) + parseInt(pagination.limit),
                });
                setLoading(false);
            } else {
                setPopup({ title: data.message, type: "error" });
                setLoading(false);
            }
        } catch (err) {
            authFailure(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // setSelected([]);
        fetchTable();
    }, [
        apiURLName,
    ]);

    useEffect(() => {
        if (apiURL && apiURL.length > 0) {
            setApiURLName(apiURL);
        }
    }, [apiURL]);

    // return (
    //     <div className="bg-white flex flex-col justify-between h-full border border-gray-200">

    //         <div className="flex justify-start">

    //             {/* Header */}
    //             <div className="flex bg-amber-700- items-center justify-between px-5 pt-4 border-b-">
    //                 <div className="w-full flex items-center space-x-2">
    //                     <h2 className="text-lg text-sky-800 font-semibold">{title}</h2>
    //                     <p className="text-sm text-gray-500">
    //                         {totalCount}
    //                     </p>
    //                 </div>

    //                 <Button
    //                     label="Add"
    //                     className={` hover:text-white hover:bg-sky-700 text-sm`}
    //                     width="20"
    //                     rounded="md"
    //                     padding="px-4 py-1"
    //                     onClick={addClick}
    //                 />
    //             </div>

    //             {/* Table */}

    //             <div className="overflow-x-auto px-4 py-2">

    //                 <div className="h-full overflow-y-auto shadow-lg rounded-lg">
    //                     <table className="w-full border-collapse border border-gray-200 shadow-xl rounded-xl">
    //                         <thead className="bg-sky-700 text-white sticky top-0 z-10">
    //                             <tr>
    //                                 {columns.map((col) => (
    //                                     <th
    //                                         key={col.key}
    //                                         className="px-4 py-3 text-left text-sm font-medium border-b"
    //                                     >
    //                                         {col.label}
    //                                     </th>
    //                                 ))}
    //                                 <th className="px-4 py-3 text-sm font-medium border-b">
    //                                     Actions
    //                                 </th>
    //                             </tr>
    //                         </thead>

    //                         <tbody>
    //                             {data.length === 0 ? (
    //                                 <tr>
    //                                     <td
    //                                         colSpan={columns.length + 1}
    //                                         className="text-center py-6 text-gray-500"
    //                                     >
    //                                         No data found
    //                                     </td>
    //                                 </tr>
    //                             ) : (
    //                                 data.map((row, index) => (
    //                                     <tr
    //                                         key={index}
    //                                         className="hover:bg-gray-50 border-b"
    //                                     >
    //                                         {columns.map((col) => (
    //                                             <td
    //                                                 key={col.key}
    //                                                 className="px-4 py-3 text-sm"
    //                                             >
    //                                                 {row[col.key]}
    //                                             </td>
    //                                         ))}

    //                                         <td className="px-4 py-3 space-x-2">

    //                                             <Button
    //                                                 label="View"
    //                                                 bgAndTextColor={"bg-green-600 text-white "}
    //                                                 className={` hover:bg-green-700 text-xs`}
    //                                                 rounded="md"
    //                                                 width="20"
    //                                                 padding="px-2 py-1"
    //                                                 onClick={() => viewClick(row)}
    //                                             />

    //                                             <Button
    //                                                 label="Edit"
    //                                                 bgAndTextColor={"bg-amber-600 text-white "}
    //                                                 className={` hover:bg-amber-700 text-xs`}
    //                                                 rounded="md"
    //                                                 width="20"
    //                                                 padding="px-2 py-1"
    //                                                 onClick={() => editClick(row)}
    //                                             />

    //                                             <Button
    //                                                 label="Delete"
    //                                                 bgAndTextColor={"bg-red-600 text-white "}
    //                                                 className={` hover:bg-red-700 text-xs`}
    //                                                 rounded="md"
    //                                                 width="20"
    //                                                 padding="px-2 py-1"
    //                                                 onClick={() => deleteClick(row)}
    //                                             />

    //                                         </td>
    //                                     </tr>
    //                                 ))
    //                             )}
    //                         </tbody>
    //                     </table>
    //                 </div>
    //             </div>

    //         </div>


    //         {/* Pagination */}
    //         <div className="bg-cyan-400- flex justify-center items-center p-4 space-x-5 text-sm">
    //             <Button
    //                 label="Prev"
    //                 disabled={currentPage === 1}
    //                 bgAndTextColor={"bg-sky-700 text-white "}
    //                 className={` hover:bg-sky-600 text-sm`}
    //                 rounded="md"
    //                 width="20"
    //                 padding="px-2 py-1"
    //                 onClick={() => onPageChange(currentPage - 1)}
    //             />

    //             <span className="text-md font-semibold text-cyan-800">
    //                 Page {currentPage} of {totalPages}
    //             </span>

    //             <Button
    //                 label="Next"
    //                 disabled={currentPage === totalPages}
    //                 bgAndTextColor={"bg-sky-700 text-white "}
    //                 className={` hover:bg-sky-600 text-sm`}
    //                 rounded="md"
    //                 width="20"
    //                 padding="px-2 py-1"
    //                 onClick={() => onPageChange(currentPage + 1)}
    //             />
    //         </div>

    //     </div>
    // );

    return (
        <div className="bg-white flex flex-col justify-between h-full border border-gray-200">

            {/* Header + Table */}
            <div className="flex flex-col">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 pt-4 border-b">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg text-sky-800 font-semibold">{title}</h2>
                        <p className="text-sm text-gray-500">{totalCount}</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full sm:max-w-sm">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                 focus:outline-none focus:ring-1 focus:ring-sky-600"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>

                    <Button
                        label="Add"
                        className="hover:text-white hover:bg-sky-700 text-sm"
                        width="20"
                        rounded="md"
                        padding="px-4 py-1"
                        onClick={addClick}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-4 py-2">
                    <div className="max-h-[60vh] overflow-y-auto shadow-lg rounded-lg">
                        <table className="min-w-full border-collapse border border-gray-200 shadow-xl rounded-xl">
                            <thead className="bg-sky-700 text-white sticky top-0 z-10">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-4 py-3 text-left text-sm font-medium border-b whitespace-nowrap"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-sm font-medium border-b whitespace-nowrap">
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
                                                    className="px-4 py-3 text-sm whitespace-nowrap"
                                                >
                                                    {row[col.key]}
                                                </td>
                                            ))}

                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        label="View"
                                                        bgAndTextColor="bg-green-600 text-white"
                                                        className="hover:bg-green-700 text-xs"
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => viewClick(row)}
                                                    />

                                                    <Button
                                                        label="Edit"
                                                        bgAndTextColor="bg-amber-600 text-white"
                                                        className="hover:bg-amber-700 text-xs"
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => editClick(row)}
                                                    />

                                                    <Button
                                                        label="Delete"
                                                        bgAndTextColor="bg-red-600 text-white"
                                                        className="hover:bg-red-700 text-xs"
                                                        rounded="md"
                                                        width="20"
                                                        padding="px-2 py-1"
                                                        onClick={() => deleteClick(row)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4 text-sm">
                <Button
                    label="Prev"
                    disabled={currentPage === 1}
                    bgAndTextColor="bg-sky-700 text-white"
                    className="hover:bg-sky-600 text-sm"
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
                    bgAndTextColor="bg-sky-700 text-white"
                    className="hover:bg-sky-600 text-sm"
                    rounded="md"
                    width="20"
                    padding="px-2 py-1"
                    onClick={() => onPageChange(currentPage + 1)}
                />
            </div>

        </div>
    );

};

export default Table;
