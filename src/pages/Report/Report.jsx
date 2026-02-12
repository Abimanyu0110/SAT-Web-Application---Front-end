import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useOutletContext } from "react-router-dom";

// Components
import Dropdown from "../../components/Common/Dropdown";
import Button from "../../components/Common/Button";
import ConfirmDialog from "../../components/Common/ConfirmDialog";

// Utils
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const Report = () => {

    const { openConfirm } = useOutletContext();

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [section, setSection] = useState("");

    const { header, admin, formatDate } = useAdmin();

    const [attendanceList, setAttendanceList] = useState([]);

    const userId = admin.userId;
    const role = admin.role;

    const getAttendanceReport = async (year, month, studentClass, section) => {
        if (!userId && !role) return;

        const res = await axios.post(
            API.HOST + API.GET_REPORT,
            { userId: userId, role: role, year, month, studentClass, section },
            header
        );
        const data = res.data.data;

        if (res.data.code === 200) {
            // alert(JSON.stringify(data))
            setAttendanceList(data || []);
            if (data?.length > 0 && role === "TEACHER") {
                setStudentClass(data[0].class);
                setSection(data[0].section);
            }
        }
    }

    useEffect(() => {
        getAttendanceReport();
    }, [])

    const handleExportPDF = () => {
        if (!attendanceList.length) return;

        const doc = new jsPDF("landscape");

        // ----- Title -----
        doc.setFontSize(16);
        doc.text("Attendance Report", 14, 15);

        // ----- Meta Info -----
        doc.setFontSize(10);

        doc.text(`Role: ${role === "TEACHER" ? "Teacher" : "Admin"}`, 14, 22);

        doc.text(`Year: ${year}`, 14, 28);
        doc.text(`Month: ${month}`, 14, 34);
        doc.text(`Class: ${studentClass}`, 120, 28);
        doc.text(`Section: ${section}`, 120, 34);

        // ----- Table -----
        const columns = [
            "Student Name",
            "Class",
            "Section",
            "Total Days",
            "Present",
            "Absent",
            "Attendance %"
        ];

        const rows = attendanceList.map(item => [
            item.studentName,
            item.class,
            item.section,
            item.totalDays,
            item.presentDays,
            item.absentDays,
            `${item.attendancePercentage}%`
        ]);

        autoTable(doc, {
            startY: 42,
            head: [columns],
            body: rows,
            styles: { fontSize: 9 }
        });

        doc.save("attendance-report.pdf");
    };

    return (
        <>
            <div className="fixed top-14 left-55 right-0 bottom-0 overflow-y-auto bg-gray-50 p-6">

                {/* Page Title */}
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Attendance Report
                </h1>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <Dropdown
                            label="Year"
                            name="year"
                            flex={false}
                            value={year}
                            // error={formik.errors.gender}
                            onChange={(e) => setYear(e)}
                            placeholder="Select Year"
                            options={[
                                { label: "2026", value: 2026 },
                                { label: "2025", value: 2025 },
                            ]}
                            required
                        />

                        <Dropdown
                            label="Month"
                            name="month"
                            flex={false}
                            value={month}
                            // error={formik.errors.gender}
                            onChange={(e) => setMonth(e)}
                            placeholder="Select Month"
                            options={[
                                { label: "January", value: 1 },
                                { label: "February", value: 2 },
                                { label: "March", value: 3 },
                                { label: "April", value: 4 },
                                { label: "May", value: 5 },
                                { label: "June", value: 6 },
                                { label: "July", value: 7 },
                                { label: "August", value: 8 },
                                { label: "September", value: 9 },
                                { label: "October", value: 10 },
                                { label: "November", value: 11 },
                                { label: "December", value: 12 },
                            ]}
                            required
                        />

                        {role === "ADMIN" && <>
                            <Dropdown
                                label="Class"
                                name="class"
                                flex={false}
                                value={studentClass}
                                // error={formik.errors.class}
                                onChange={(e) => setStudentClass(e)}
                                placeholder="Select class"
                                options={[
                                    { label: "I", value: 1 },
                                    { label: "II", value: 2 },
                                    { label: "III", value: 3 },
                                    { label: "IV", value: 4 },
                                    { label: "V", value: 5 },
                                    { label: "VI", value: 6 },
                                    { label: "VII", value: 7 },
                                    { label: "VIII", value: 8 },
                                    { label: "IX", value: 9 },
                                    { label: "X", value: 10 },
                                    { label: "XI", value: 11 },
                                    { label: "XII", value: 12 },
                                ]}
                                required
                            />

                            <Dropdown
                                label="Section"
                                name="section"
                                flex={false}
                                value={section}
                                // error={formik.errors.section}
                                onChange={(e) => setSection(e)}
                                placeholder="Select Section"
                                options={[
                                    { label: "A", value: "A" },
                                    { label: "B", value: "B" },
                                    { label: "C", value: "C" },
                                    { label: "D", value: "D" }
                                ]}
                                required
                            />
                        </>}

                        <div className="flex flex-col justify-end">
                            <Button
                                label="View Report"
                                className={`h-10`}
                                onClick={() => { getAttendanceReport(year, month, studentClass, section) }}
                            // bgAndTextColor="bg-gray-200 text-gray-900"
                            // onClick={closePopup}
                            />
                        </div>

                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Student Name</th>
                                <th className="p-3 border">Class</th>
                                <th className="p-3 border">Section</th>
                                <th className="p-3 border">Total Days</th>
                                <th className="p-3 border">Present</th>
                                <th className="p-3 border">Absent</th>
                                <th className="p-3 border">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.length > 0 ? (
                                attendanceList.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-3 border">{item.studentName}</td>
                                        <td className="p-3 border">{item.class}</td>
                                        <td className="p-3 border text-green-600">{item.section}</td>
                                        <td className="p-3 border text-red-600">{item.totalDays}</td>
                                        <td className="p-3 border">{item.presentDays}</td>
                                        <td className="p-3 border">{item.absentDays}</td>
                                        <td className="p-3 border text-green-600">{item.attendancePercentage}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-3 border text-center" colSpan="8">
                                        No Data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Export Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                    width="50"
                        label="Export PDF"
                        className={`h-10`}
                        onClick={() =>
                            openConfirm({
                                title: "Export Report",
                                message: "Are you sure you want to Export?.",
                                action: handleExportPDF
                            })
                        }
                    />
                </div>

            </div>
        </>
    )
}

export default Report;
