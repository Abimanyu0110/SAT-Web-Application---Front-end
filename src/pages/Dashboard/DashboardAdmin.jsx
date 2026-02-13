import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const DashboardAdmin = () => {

  const navigate = useNavigate();
  const { header, admin, formatDate } = useAdmin();
  const [adminDatas, setAdminDatas] = useState();
  const [attendanceList, setAttendanceList] = useState([]);
  const id = admin.userId;

  const getAdminDashboard = async () => {
    if (!id) return;

    const res = await axios.post(
      API.HOST + API.GET_ADMIN_DASHOARD,
      { id: id },
      header
    );
    const data = res.data.data;

    if (res.data.code === 200) {
      // alert(JSON.stringify(data.adminDatas))
      setAdminDatas(data.adminDatas || "");
      setAttendanceList(data.attendanceList || []);
    }
  }

  useEffect(() => {
    getAdminDashboard();
  }, [])

  return (
    <>
      <div className="fixed top-14 left-0 lg:left-55 right-0 bottom-0 bg-gray-50 p-6 overflow-y-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Teachers</p>
            <h2 className="text-3xl font-bold">{adminDatas?.totalTeachers}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="text-3xl font-bold">{adminDatas?.totalStudents}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Today Present</p>
            <h2 className="text-3xl font-bold text-green-600">{adminDatas?.todayPresent}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Today Absent</p>
            <h2 className="text-3xl font-bold text-red-600">{adminDatas?.todayAbsent}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">My School</p>
            <h2 className="text-3xl font-bold">{adminDatas?.organizationName}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">School Code</p>
            <h2 className="text-3xl font-bold text-green-600">{adminDatas?.organizationCode}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Short Name</p>
            <h2 className="text-3xl font-bold text-red-600">{adminDatas?.shortName}</h2>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-sm text-gray-500">Secret Code</p>
            <h2 className="text-3xl font-bold text-red-600">{adminDatas?.secretCode}</h2>
          </div>

        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Teacher Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">
              Teacher Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add, edit, assign classes and manage teachers.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => { navigate(navLinks.TEACHERS_LIST) }}>
              Manage Teachers
            </button>
          </div>

          {/* Student Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">
              Student Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add, edit students and assign to classes.
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={() => { navigate(navLinks.STUDENTS_LIST) }}>
              Manage Students
            </button>
          </div>

          {/* Attendance Reports */}
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

        {/* Attendance Overview Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">

          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Recent Attendance Overview
            </h2>
          </div>

          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Class</th>
                <th className="p-3 border text-left">Section</th>
                <th className="p-3 border text-left">Marked By</th>
                <th className="p-3 border text-left">Total Students</th>
                <th className="p-3 border text-left">Total Present</th>
                <th className="p-3 border text-left">Total Absent</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length > 0 ? (
                attendanceList.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border">{formatDate(item.date)}</td>
                    <td className="p-3 border">{item.class}</td>
                    <td className="p-3 border">{item.section}</td>
                    <td className="p-3 border">{item.teacher}</td>
                    <td className="p-3 border">{item.totalStudents}</td>
                    <td className="p-3 border text-green-600">{item.totalPresent}</td>
                    <td className="p-3 border text-red-600">{item.totalAbsent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 border text-center" colSpan="7">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div >
    </>
  )
}

export default DashboardAdmin;
