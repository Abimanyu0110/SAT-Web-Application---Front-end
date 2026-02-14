import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Utils
import API from "../../../Utils/API";
import navLinks from "../../../Utils/navLinks";

// Hooks
import useAdmin from "../../../Hooks/useAdmin";

const ViewTeacher = ({
    id
}) => {
    const { header, admin, formatDate } = useAdmin();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);

    const getTeachersById = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.post(
                API.HOST + API.GET_ADMIN_BY_ID,
                { id: id },
                header
            );

            if (res.data.code === 200) {
                setTeachers(res.data.data || []);
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
        getTeachersById();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
                View Teacher
            </h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <div className="border border-gray-200 shadow rounded-lg p-4">

                        <div className="space-y-3 w-full">
                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">First Name :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.firstName}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">Last Name :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.lastName}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">D.O.B :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{formatDate(teachers.dob)}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">Gender :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.gender}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">Class :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.class}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">Section :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.section}</p>
                            </div>

                            <div className="w-full flex text-lg">
                                <h2 className="font-semibold w-1/3 text-gray-700">Subject :</h2>
                                <p className="w-2/3 text-gray-600 flex items-center">{teachers.subject}</p>
                            </div>

                        </div>
                    </div>
                )}

        </div>
    );
};

export default ViewTeacher;
