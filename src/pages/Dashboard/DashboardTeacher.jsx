import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const DashboardTeacher = () => {

    const navigate = useNavigate();
    const { header, admin, formatDate } = useAdmin();
    const [teacherDatas, setTeacherDatas] = useState();
    const [attendanceList, setAttendanceList] = useState([]);
    const id = admin.userId;

    const getTeacherDashboard = async () => {
        if (!id) return;

        const res = await axios.post(
            API.HOST + API.GET_TEACHER_DASHOARD,
            { id: id },
            header
        );
        const data = res.data.data;

        if (res.data.code === 200) {
            // alert(JSON.stringify(data.teacherDatas))
            setTeacherDatas(data.teacherDatas || "");
            setAttendanceList(data.attendanceList || []);
        }
    }

    useEffect(() => {
        getTeacherDashboard();
    }, [])

    return (
        <>
            <div className="fixed top-14 left-55 right-0 bottom-0 bg-gray-50 p-6 overflow-y-auto">

                {/* Page Title */}
                <h1 className="text-2xl font-semibold text-sky-700 mb-6">
                    Teacher Dashboard
                </h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">My Students</p>
                        <h2 className="text-3xl font-bold">{teacherDatas?.myStudents || 0}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Today Present</p>
                        <h2 className="text-3xl font-bold text-green-600">{teacherDatas?.todayPresent || 0}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Today Absent</p>
                        <h2 className="text-3xl font-bold text-red-600">{teacherDatas?.todayAbsent || 0}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">My Class</p>
                        <h2 className="text-3xl text-sky-700 font-bold">{(teacherDatas?.class + " " + teacherDatas?.section) || ""}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">My School</p>
                        <h2 className="text-2xl text-sky-700 font-bold">{teacherDatas?.organizationName || ""}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow">
                        <p className="text-sm text-gray-500">School Code</p>
                        <h2 className="text-2xl text-sky-700 font-bold">{teacherDatas?.organizationCode || ""}</h2>
                    </div>

                </div>

                {/* Teacher Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* Mark Attendance */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Mark Attendance
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Mark daily attendance for your assigned class.
                        </p>
                        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            onClick={() => { navigate(navLinks.ATTENDANCE_LIST) }}>
                            Take Attendance
                        </button>
                    </div>

                    {/* View Reports */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Attendance Reports
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            View student-wise and monthly attendance reports.
                        </p>
                        <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                            onClick={() => { navigate(navLinks.REPORT) }}>
                            View Reports
                        </button>
                    </div>

                </div>

                {/* Recent Attendance */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">
                            Recent Attendance
                        </h2>
                    </div>

                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">Date</th>
                                <th className="p-3 border text-left">Total Students</th>
                                <th className="p-3 border text-left">Present</th>
                                <th className="p-3 border text-left">Absent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.length > 0 ? (
                                attendanceList.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-3 border">{formatDate(item.date)}</td>
                                        <td className="p-3 border">{item.totalStudents}</td>
                                        <td className="p-3 border text-green-600">{item.totalPresent}</td>
                                        <td className="p-3 border text-red-600">{item.totalAbsent}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-3 border text-center" colSpan="4">
                                        No Data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

            </div>
        </>
    )
}

export default DashboardTeacher;
