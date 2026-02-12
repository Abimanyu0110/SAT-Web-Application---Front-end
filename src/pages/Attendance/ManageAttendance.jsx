import { useEffect, useState } from "react";
import axios from "axios";

// Components
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/CheckBox";

// Utils
import API from "../../../Utils/API";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ManageAttendance = ({
    closePopup,
    onSuccess,
    selectedDate, // 👈 optional (edit mode)
}) => {
    const { header, admin } = useAdmin();

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    const isEdit = false;
    /* =========================
       FETCH STUDENTS
    ========================== */
    const getStudentsList = async () => {
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

            // const initial = {};
            // list.forEach(s => (initial[s.id] = false));
            // setAttendance(initial);

            setAttendance(prev => {
                const updated = { ...prev };
                list.forEach(s => {
                    if (updated[s.id] === undefined) {
                        updated[s.id] = false;
                    }
                });
                return updated;
            });
///
        }
    };

    /* =========================
       FETCH ATTENDANCE (EDIT)
    ========================== */
    const getAttendanceByDate = async () => {
        if (!selectedDate) return;

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
    };

    // useEffect(() => {
    //     getStudentsList();
    // }, []);

    // useEffect(() => {
    //     getAttendanceByDate();
    // }, [selectedDate]);

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
                            <tr key={student.id} className="border-b">
                                <td className="border- p-2">
                                    {student.registerNumber}
                                </td>
                                <td className="border- p-2">
                                    {student.firstName} {student.lastName}
                                </td>
                                <td className="border- p-2 text-center- flex justify-center">
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

            <div className="flex justify-end gap-4 mt-5">
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
        </div>
    );
};

export default ManageAttendance;
