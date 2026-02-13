import { useState, useEffect, use } from "react"

// ------------- Components ------------------
// import Table from "../../components/Common/Table";
import { Modal } from "../../components/Common/Modal";
import ManageStudent from "./ManageStudent";
import TableNew from "../../components/Common/TableNew";

// -------------- Utils -------------------
import API from "../../../Utils/API";

// -------------- Hooks -----------------
import useAdmin from "../../../Hooks/useAdmin";
import ViewStudent from "./ViewStudent";

const StudentsList = () => {

    const { admin } = useAdmin();
    const [refreshKey, setRefreshKey] = useState(0);

    const [popupManage, setPopupManage] = useState({ show: false, id: 0 })
    const [popupView, setPopupView] = useState({ show: false, id: 0 })

    const handleSuccess = () => {
        // setPopupManage({ show: false });                 // close modal
        setRefreshKey(prev => prev + 1);     // refresh table
    };

    return (
        <>
            {/* Add / Edit - Modal */}
            <Modal
                show={popupManage.show}
                closePopup={() => setPopupManage({ show: false })}
            >
                <ManageStudent onSuccess={handleSuccess} id={popupManage.id} />
            </Modal>

            {/* View - Modal */}
            <Modal
                show={popupView.show}
                closePopup={() => setPopupView({ show: false })}
            >
                <ViewStudent id={popupView.id} />
            </Modal>

            <div className="fixed top-14 left-0 lg:left-55 right-0 bottom-0 bg-amber-300">

                <TableNew
                    title="Students"
                    refreshKey={refreshKey}
                    apiURL={API.HOST + API.STUDENTS_LIST}
                    limit={10}
                    columns={[
                        { label: "S.no", key: "sno" },
                        { label: "Name", key: "name" },
                        { label: "Register Number", key: "registerNumber" },
                        { label: "Class", key: "class" },
                        { label: "Section", key: "section" },
                        { label: "D.O.B", key: "dob" },
                        { label: "Gender", key: "gender" },
                    ]}
                    assignData={(rows) =>
                        rows.map((r) => ({
                            id: r.id,
                            name: r.firstName + " " + r.lastName,
                            registerNumber: r.registerNumber,
                            class: r.class,
                            section: r.section,
                            dob: r.dob,
                            gender: r.gender,
                        }))
                    }
                    showAdd={admin.role === "ADMIN"}
                    showDelete={admin.role === "ADMIN"}
                    showEdit={admin.role === "ADMIN"}

                    addClick={() => setPopupManage({ show: true })}
                    viewClick={(row) => setPopupView({ show: true, id: row.id })}
                    editClick={(row) => setPopupManage({ show: true, id: row.id })}
                    deleteClick={(row) => console.log("Delete", row)}
                />
            </div>

        </>
    )
}

export default StudentsList;