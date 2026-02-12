import { useEffect, useState } from "react";
import axios from "axios";

// Components
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/CheckBox";

// Utils
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ViewAttendance = ({
    date
}) => {
    const { header, admin, formatDate } = useAdmin();

    const [students, setStudents] = useState([]);

    const getAttendanceByDate = async () => {
        if (!date) return;

        const res = await axios.post(
            API.HOST + API.ATTENDANCE_DATA_BY_DATE,
            { date: date, id: admin.userId },
            header
        );

        if (res.data.code === 200) {
            setStudents(res.data.data);
        }
    };

    useEffect(() => {
        getAttendanceByDate();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Attendance - <span className="font-bold text-gray-600-">{formatDate(date)}</span>
            </h2>

            <div className="border border-gray-200 shadow rounded-lg overflow-auto max-h-[400px]">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border- p-2 text-start">Register No</th>
                            <th className="border- p-2 text-start">Name</th>
                            <th className="border- py-2 text-center">Attendance</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b border-gray-300">
                                <td className="p-2">
                                    {student.registerNumber}
                                </td>
                                <td className=" p-2">
                                    {student.name}
                                </td>
                                <td className={`p-2 flex justify-center 
                                    ${student.status === 1 ? "text-green-600" : "text-red-600"}`}>
                                    {student.status === 1 ? "Present" : "Absent"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ViewAttendance;
