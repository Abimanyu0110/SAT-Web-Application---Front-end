
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

// -------------- Components ---------------------
import TextField from "../../components/Common/TextField";
import Button from "../../components/Common/Button";
import Dropdown from "../../components/Common/Dropdown";
import { Popup } from "../../components/Common/Popup";

// -------------- Utils ------------------------
import navLinks from "../../../Utils/navLinks";
import API from "../../../Utils/API";

// -------------- Hooks ---------------------
import useAdmin from "../../../Hooks/useAdmin";

const ManageStudent = ({
    closePopup,
    onSuccess,
    id
}) => {

    const navigate = useNavigate(); // useNavigate()
    const { header, admin, toLocalDate } = useAdmin(); // useAdmin Hooks

    const [loading, setLoading] = useState(false); // For loading
    const [btnLoading, setBtnLoading] = useState(false); // For Button Loading
    const [popup, setPop] = useState(null); // For Popup message

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            registerNumber: "",
            class: "",
            section: ""
        },
        validateOnMount: false,
        validateOnBlur: false,
        validateOnChange: false,
        isInitialValid: false,
        // enableReinitialize: true,
        validationSchema: yup.object().shape({
            firstName: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .min(2, "Minimum " + " 2")
                .max(20, "Maximum " + " 50")
                .required("Required"),
            lastName: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .notRequired(),
            dob: yup
                .string()
                .test(
                    "year-range",
                    "Year must be between 1900 and 2099",
                    (value) => {
                        if (!value) return true;

                        const year = parseInt(value.split("-")[0]);
                        return year >= 1900 && year <= 2099;
                    }
                )
                .notRequired(),
            gender: yup
                .string()
                .required("Required"),
            registerNumber: yup
                .number()
                .typeError("Must be a number")
                .required("Required"),
            class: yup
                .number()
                .typeError("Must be a number")
                .required("Required"),
            section: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .required("Required"),
        }),
        onSubmit: async (e, { resetForm }) => {
            setBtnLoading(true);
            const formData = new FormData();

            if (id && id > 0) {
                formData.append("id", id)
            }
            formData.append("firstName", e.firstName);
            formData.append("lastName", e.lastName);
            formData.append("dob", new Date(e.dob).toISOString().split("T")[0]);
            formData.append("gender", e.gender);
            formData.append("registerNumber", e.registerNumber);
            formData.append("teacherClass", e.class);
            formData.append("section", e.section);
            formData.append("adminId", admin.userId);

            try {
                const { data } = await axios.post(API.HOST + API.MANAGE_STUDENT, formData, header)
                if (data.code === 200) {
                    setPop({ title: data.message, type: "success" }); // Success popup
                    resetForm(); // Form Reset
                    onSuccess(); // For Table Refresh
                } else {
                    setPop({ title: data.message, type: "error" }); // error popup
                }
            } catch (error) {
                setPop({ title: "There was an error in submiting form", type: "error" }); // error popup
            } finally {
                setBtnLoading(false);
            }
        },
    });

    // Get datas From DB
    const getStudentsById = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axios.get(
                API.HOST + API.GET_STUDENT_BY_ID,
                {
                    params: {
                        id: id
                    },
                    ...header
                }
            );

            if (res.data.code === 200) {
                formik.setFieldValue("firstName", res.data.data.firstName);
                formik.setFieldValue("lastName", res.data.data.lastName);
                formik.setFieldValue("dob", toLocalDate(res.data.data.dob));
                formik.setFieldValue("gender", res.data.data.gender);
                formik.setFieldValue("registerNumber", res.data.data.registerNumber);
                formik.setFieldValue("class", res.data.data.class);
                formik.setFieldValue("section", res.data.data.section);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) { // Auth error
                navigate(navLinks.LOGIN); // redirect to login page
            } else {
                setPop({ title: "Couldn't able to get data", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentsById();
    }, []);

    return (
        <div className="">
            <h2 className="text-xl font-semibold mb-4 text-sky-700 ">{id && id > 0 ? "Edit" : "Add"} Student</h2>

            {loading ?
                (
                    <div className="px-4 py-15 text-center text-gray-600">
                        Loading...
                    </div>
                ) : (
                    <form className="space-y-4 p-4 px-5 border border-gray-200 shadow-md rounded-lg overflow-auto"
                        onSubmit={formik.handleSubmit} noValidate>
                        {popup != null && <Popup unmount={() => setPop(null)} title={popup.title} type={popup.type} />}

                        <TextField
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Enter your First Name"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.firstName}
                            error={formik.errors.firstName}
                            onChange={(e) => formik.setFieldValue("firstName", e, true)}
                            required
                        />

                        <TextField
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Enter your Last Name"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.lastName}
                            error={formik.errors.lastName}
                            onChange={(e) => formik.setFieldValue("lastName", e)}
                        />

                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            placeholder="Enter your D.O.B"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.dob}
                            error={formik.errors.dob}
                            onChange={(e) => formik.setFieldValue("dob", e)}
                        />

                        <Dropdown
                            label="Gender"
                            name="gender"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.gender}
                            error={formik.errors.gender}
                            onChange={(e) => formik.setFieldValue("gender", e)}
                            placeholder="Select gender"
                            options={[
                                { label: "Male", value: "MALE" },
                                { label: "Female", value: "FEMALE" },
                                { label: "Other", value: "OTHER" },
                            ]}
                        />

                        <TextField
                            label="Register Number"
                            name="registerNumber"
                            type="text"
                            placeholder="Enter Register Number"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.registerNumber}
                            error={formik.errors.registerNumber}
                            onChange={(e) => formik.setFieldValue("registerNumber", e)}
                        />

                        <Dropdown
                            label="Class"
                            name="class"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.class}
                            error={formik.errors.class}
                            onChange={(e) => formik.setFieldValue("class", e)}
                            placeholder="Select class"
                            options={[
                                { label: "1", value: 1 },
                                { label: "2", value: 2 },
                                { label: "3", value: 3 },
                                { label: "4", value: 4 },
                                { label: "5", value: 5 },
                                { label: "6", value: 6 },
                                { label: "7", value: 7 },
                                { label: "8", value: 8 },
                                { label: "9", value: 9 },
                                { label: "10", value: 10 },
                                { label: "11", value: 11 },
                                { label: "12", value: 12 },
                            ]}
                        />

                        <Dropdown
                            label="Section"
                            name="section"
                            flex="flex flex-col md:flex-row md:items-center"
                            value={formik.values.section}
                            error={formik.errors.section}
                            onChange={(e) => formik.setFieldValue("section", e)}
                            placeholder="Select Section"
                            options={[
                                { label: "A", value: "A" },
                                { label: "B", value: "B" },
                                { label: "C", value: "C" },
                                { label: "D", value: "D" }
                            ]}
                        />

                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 mt-5">
                            <Button
                                label="Cancel"
                                bgAndTextColor="bg-gray-200 text-gray-900"
                                onClick={closePopup}
                            />

                            <Button
                                loading={btnLoading}
                                label="Submit"
                                type="submit"
                            />
                        </div>

                    </form>
                )}

        </div>
    );
};

export default ManageStudent;