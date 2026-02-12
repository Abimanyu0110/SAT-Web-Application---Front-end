import { useState, useEffect } from "react"

// ------------- Components ------------------
// import Table from "../../components/Common/Table";
import { Modal } from "../../components/Common/Modal";
import TableNew from "../../components/Common/TableNew";
import ManageAttendance from "./ManageAttendance";
import ViewAttendance from "./ViewAttendance";

// ------------- Utils -----------------------
import API from "../../../Utils/API";

// ------------- Hooks -----------------------
import useAdmin from "../../../Hooks/useAdmin";

const AttendanceList = () => {

    const toLocalDate = (isoDate) => {
        const d = new Date(isoDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const { header, admin, formatDate } = useAdmin();

    const [open, setOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [popupManage, setPopupManage] = useState({ show: false, date: "" });
    const [popupView, setPopupView] = useState({ show: false, date: "" });

    const [showAdd, setShowAdd] = useState(true);

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const today = getTodayDate();

    const handleSuccess = () => {
        setPopupManage({ show: false, date: "" });                 // close modal
        setRefreshKey(prev => prev + 1);     // refresh table
    };

    return (
        <>
            {/* Manage Attendance */}
            <Modal
                show={popupManage.show}
                closePopup={() => setPopupManage({ show: false })}
            >
                <ManageAttendance onSuccess={handleSuccess} selectedDate={popupManage.date} />
            </Modal>

            {/* View Attendance */}
            <Modal
                show={popupView.show}
                closePopup={() => setPopupView({ show: false })}
            >
                <ViewAttendance date={popupView.date} />
            </Modal>

            <div className="fixed top-14 left-55 right-0 bottom-0 bg-amber-300">

                <TableNew
                    title="Attendance"
                    refreshKey={refreshKey}
                    apiURL={API.HOST + API.ATTENDANCE_LIST_BY_DATE}
                    limit={10}
                    columns={[
                        { label: "S.no", key: "sno" },
                        { label: "Date", key: "date" },
                        { label: "Total Students", key: "totalStudents" },
                        { label: "Total Present", key: "totalPresent" },
                        { label: "Total Absent", key: "totalAbsent" }
                    ]}
                    assignData={(rows) => {
                        const todayExists = rows.some(
                            (r) => toLocalDate(r.date) === today
                        );

                        setShowAdd(!todayExists); // hide Add button if today exists

                        return rows.map((r) => ({
                            date: toLocalDate(r.date),   // ✅ convert UTC → local date
                            totalStudents: r.totalStudents,
                            totalPresent: r.totalPresent,
                            totalAbsent: r.totalAbsent
                        }));
                    }}
                    showDelete={false}
                    showAdd={showAdd}
                    addClick={() => setPopupManage({ show: true, date: "" })}
                    viewClick={(row) => setPopupView({ show: true, date: row.date })}
                    editClick={(row) => setPopupManage({ show: true, date: row.date })}
                />
            </div>

        </>
    )
}

export default AttendanceList;