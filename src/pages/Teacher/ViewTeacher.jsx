import { useEffect, useState } from "react";
import axios from "axios";

// Utils
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ViewTeacher = ({
    id
}) => {
    const { header, admin, formatDate } = useAdmin();

    const [teachers, setTeachers] = useState([]);

    const getTeachersById = async () => {
        if (!id) return;

        const res = await axios.post(
            API.HOST + API.GET_ADMIN_BY_ID,
            { id: id },
            header
        );

        if (res.data.code === 200) {
            setTeachers(res.data.data || []);
        }
    };

    useEffect(() => {
        getTeachersById();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Teacher
            </h2>

            <div className="border border-gray-200 shadow rounded-lg p-4">
                {!teachers ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-3 w-full">
                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">First Name :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.firstName}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Last Name :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.lastName}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">D.O.B :</h2>
                            <p className="w-2/3 text-gray-600">{formatDate(teachers.dob)}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Gender :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.gender}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Class :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.class}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Section :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.section}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Subject :</h2>
                            <p className="w-2/3 text-gray-600">{teachers.subject}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTeacher;
