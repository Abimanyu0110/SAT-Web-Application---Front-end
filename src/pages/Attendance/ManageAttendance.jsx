import { useEffect, useState } from "react";
import axios from "axios";

// Components
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/CheckBox";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";
import { useNavigate } from "react-router-dom";

const ManageAttendance = ({
    closePopup,
    onSuccess,
    selectedDate, // 👈 optional (edit mode)
}) => {
    const { header, admin } = useAdmin();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    const isEdit = false;
    /* =========================
       FETCH STUDENTS
    ========================== */
    const getStudentsList = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                API.HOST + API.STUDENTS_LIST,
                {
                    id: admin.userId,
                    role: admin.role
                },
                header
            );

            if (res.data.code === 200) {
                const list = res.data.data.data;
                setStudents(list);

                setAttendance(prev => {
                    const updated = { ...prev };
                    list.forEach(s => {
                        if (updated[s.id] === undefined) {
                            updated[s.id] = false;
                        }
                    });
                    return updated;
                });
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate(navLinks.LOGIN); // <-- redirect to login page
            } else {
                alert(JSON.stringify(err));
            }
        } finally {
            // setLoading(false);
        }
    };

    /* =========================
       FETCH ATTENDANCE (EDIT)
    ========================== */
    const getAttendanceByDate = async () => {
        if (!selectedDate) return;

        try {
            const res = await axios.post(
                API.HOST + API.ATTENDANCE_DATA_BY_DATE,
                { date: selectedDate, id: admin.userId },
                header
            );

            if (res.data.code === 200) {
                // alert(JSON.stringify(res.data.data))
                const map = {};
                res.data.data.forEach(a => {
                    map[a.studentId] = a.status === 1;
                });
                // alert(JSON.stringify(map))
                setAttendance(prev => ({ ...prev, ...map }));
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate(navLinks.LOGIN); // <-- redirect to login page
            } else {
                alert(JSON.stringify(err));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await getStudentsList();
            if (selectedDate) {
                await getAttendanceByDate();
            }
        };
        init();
    }, [selectedDate]);


    /* =========================
       CHECKBOX HANDLER
    ========================== */
    const handleAttendanceChange = (id, value) => {
        setAttendance(prev => ({ ...prev, [id]: value }));
    };

    /* =========================
       SUBMIT
    ========================== */
    const handleSubmit = async () => {
        const payload = students.map(s => ({
            studentId: s.id,
            isPresent: attendance[s.id]
        }));

        // alert(JSON.stringify(payload))
        // return
        const res = await axios.post(
            API.HOST + API.MANAGE_ATTENDANCE,
            {
                isEdit: isEdit,
                date: selectedDate || new Date().toISOString().split("T")[0],
                markedBy: admin.userId,
                attendance: payload
            },
            header
        );

        if (res.data.code === 200) {
            alert(res.data.message);
            closePopup();
            onSuccess();
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                {selectedDate ? "Edit Attendance" : "Mark Attendance"}
            </h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <>
                        <div className="border border-gray-200 shadow rounded-lg overflow-auto max-h-[400px]">
                            <table className="w-full">
                                <thead className="bg-sky-700 text-white">
                                    <tr>
                                        <th className="p-2 text-start">Register No</th>
                                        <th className="p-2 text-start">Name</th>
                                        <th className="py-2 text-center">Attendance</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id} className="border-b border-gray-300 text-gray-500">
                                            <td className="p-2">
                                                {student.registerNumber}
                                            </td>
                                            <td className="p-2">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="p-2 flex justify-center">
                                                <Checkbox
                                                    value={attendance[student.id]}
                                                    onChange={val =>
                                                        handleAttendanceChange(student.id, val)
                                                    }
                                                    label={"Present"}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5">
                            <Button
                                label="Cancel"
                                bgAndTextColor="bg-gray-200 text-gray-900"
                                onClick={closePopup}
                            />
                            <Button
                                label="Save Attendance"
                                onClick={handleSubmit}
                            />
                        </div>
                    </>
                )}

        </div>
    );
};

export default ManageAttendance;
