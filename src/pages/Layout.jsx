import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./sideBar";
import Navbar from "./navBar";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import Notification from "../components/Common/Notification";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notification
  const [notify, setNotify] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const closeNotification = () => {
    setNotify(prev => ({ ...prev, isOpen: false }));
  };

  // Confirm dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const openConfirm = ({ action, title, message }) => {
    setConfirmAction(() => action);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setShowConfirm(true);
  };

  const handleYes = () => {
    confirmAction?.();
    setShowConfirm(false);
  };

  return (
    <>
      <Notification
        isOpen={notify.isOpen}
        type={notify.type}
        message={notify.message}
        onClose={closeNotification}
      />

      <div className="flex min-h-screen bg-white">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main */}
        <div className="flex flex-1 flex-col bg-white">
          <Navbar setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 bg-white p-4 mt-14 lg:ml-55">
            <Outlet context={{ openConfirm }} />
          </main>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          title={confirmTitle}
          message={confirmMessage}
          onYes={handleYes}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default Layout;
