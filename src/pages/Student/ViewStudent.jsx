import { useEffect, useState } from "react";
import axios from "axios";

// Components
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/CheckBox";

// Utils
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ViewStudent = ({
    id
}) => {
    const { header, admin, formatDate } = useAdmin();

    const [students, setStudents] = useState([]);

    const getStudentsById = async () => {
        if (!id) return;

        const res = await axios.post(
            API.HOST + API.GET_STUDENT_BY_ID,
            { id: id },
            header
        );

        if (res.data.code === 200) {
            setStudents(res.data.data || []);
        }
    };

    useEffect(() => {
        getStudentsById();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Student
            </h2>

            <div className="border border-gray-200 shadow rounded-lg p-4">
                {!students ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-3 w-full">
                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Name :</h2>
                            <p className="w-2/3 text-gray-600">{students.firstName} {students.lastName}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Register Number :</h2>
                            <p className="w-2/3 text-gray-600">{students.registerNumber}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">D.O.B :</h2>
                            <p className="w-2/3 text-gray-600">{formatDate(students.dob)}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Gender :</h2>
                            <p className="w-2/3 text-gray-600">{students.gender}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Class :</h2>
                            <p className="w-2/3 text-gray-600">{students.class}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Section :</h2>
                            <p className="w-2/3 text-gray-600">{students.section}</p>
                        </div>

                        <div className="w-full flex text-lg">
                            <h2 className="font-semibold w-1/3 text-gray-700">Assigned Teacher :</h2>
                            <p className="w-2/3 text-gray-600">{students.teacher}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewStudent;
