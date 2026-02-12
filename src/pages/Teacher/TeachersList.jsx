import { useState, useEffect } from "react"

// ------------- Components ------------------
// import Table from "../../components/Common/Table";
import { Modal } from "../../components/Common/Modal";
import ManageTeacher from "./ManageTeacher";
import TableNew from "../../components/Common/TableNew";
import API from "../../../Utils/API";
import ViewTeacher from "./ViewTeacher";

const TeachersList = () => {

    const [open, setOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [popupManage, setPopupManage] = useState({ show: false, id: 0 })
    const [popupView, setPopupView] = useState({ show: false, id: 0 })

    const handleSuccess = () => {
        setOpen(false);                 // close modal
        setRefreshKey(prev => prev + 1);     // refresh table
    };

    return (
        <>
            {/* Add / Edit - Modal */}
            <Modal
                show={popupManage.show}
                closePopup={() => setPopupManage({ show: false })}
            >
                <ManageTeacher onSuccess={handleSuccess} id={popupManage.id} />
            </Modal>

            {/* View - Modal */}
            <Modal
                show={popupView.show}
                closePopup={() => setPopupView({ show: false })}
            >
                <ViewTeacher id={popupView.id} />
            </Modal>

            <div className="fixed top-14 left-55 right-0 bottom-0 bg-amber-300">

                <TableNew
                    title="Teachers"
                    apiURL={API.HOST + API.TEACHERS_LIST}
                    limit={10}
                    refreshKey={refreshKey}
                    columns={[
                        { label: "S.no", key: "sno" },
                        { label: "Name", key: "name" },
                        { label: "Email", key: "email" },
                        { label: "Role", key: "role" },
                        { label: "Class", key: "class" },
                        { label: "Section", key: "section" },
                    ]}
                    assignData={(rows) =>
                        rows.map((r) => ({
                            id: r.id,
                            name: r.firstName + " " + r.lastName,
                            email: r.email,
                            role: r.role,
                            class: r.class,
                            section: r.section,
                        }))
                    }
                    addClick={() => setPopupManage({ show: true })}
                    viewClick={(row) => setPopupView({ show: true, id: row.id })}
                    editClick={(row) => setPopupManage({ show: true, id: row.id })}
                    deleteClick={(row) => console.log("Delete", row)}
                />
            </div>

        </>
    )
}

export default TeachersList;