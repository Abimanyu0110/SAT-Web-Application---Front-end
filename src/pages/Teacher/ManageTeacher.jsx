
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";

// -------------- Components ---------------------
import TextField from "../../components/Common/TextField";
import Button from "../../components/Common/Button";
import Dropdown from "../../components/Common/Dropdown";
import DateField from "../../components/Common/DateField";

// -------------- Utils ------------------------
import navLinks from "../../../Utils/navLinks";
import API from "../../../Utils/API";

// -------------- Hooks ---------------------
import useAdmin from "../../../Hooks/useAdmin";

const ManageTeacher = ({
    closePopup,
    onSuccess,
    id
}) => {

    const navigate = useNavigate();
    const { header, admin, toLocalDate } = useAdmin();
    const role = "TEACHER";
    const adminId = Cookies.get("userId")

    const formik = useFormik({
        initialValues: {
            // id: null,
            firstName: "",
            lastName: "",
            dob: "",
            gender: "",
            email: "",
            password: "",
            confirmPassword: "",
            organizationName: "",
            secretCode: "",
            role: role
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
                .date()
                .notRequired(),
            gender: yup
                .string()
                .required("Required"),
            email: yup
                .string()
                .email("Invalid Email ID")
                .required("Required"),
            class: yup
                .number()
                .typeError("Must be a number")
                .required("Required"),
            section: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .required("Required"),
            subject: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .required("Required"),
        }),
        onSubmit: async (e, { resetForm }) => {
            // setBtnLoading(true);
            // alert(JSON.stringify(e))
            // return
            const formData = new FormData();

            if (id && id > 0) {
                formData.append("id", id);
            }
            formData.append("firstName", e.firstName);
            formData.append("lastName", e.lastName);
            formData.append("dob", new Date(e.dob).toISOString().split("T")[0]);
            formData.append("gender", e.gender);
            formData.append("email", e.email);
            formData.append("teacherClass", e.class);
            formData.append("section", e.section);
            formData.append("subject", e.subject);
            formData.append("role", role);
            formData.append("adminId", adminId);

            try {
                // alert(JSON.stringify(formData))
                // return;
                const { data } = await axios.post(API.HOST + API.TEACHER_SIGNUP, formData, header)
                if (data.code === 200) {
                    // setBtnLoading(false);
                    // manuallyClickButtonUsingId();
                    // setPop({ title: data.message, type: "success" }); // Success popup
                    alert(data.message)
                    resetForm();
                    closePopup();
                    onSuccess();
                    // navigate(navLinks.LOGIN)
                } else {
                    alert(data.message)
                    // setBtnLoading(false);
                    // setPop({ title: data.message, type: "error" });
                }
            } catch (error) {
                // setBtnLoading(false);
                // console.error("Error submitting form:", error);
                alert("There was an error submitting the form.");
                // setPop({ title: error.message, type: "error" });
            }
        },
    });

    const getTeachersById = async () => {
        if (!id) return;

        const res = await axios.post(
            API.HOST + API.GET_ADMIN_BY_ID,
            { id: id },
            header
        );

        if (res.data.code === 200) {
            formik.setFieldValue("firstName", res.data.data.firstName);
            formik.setFieldValue("lastName", res.data.data.lastName);
            formik.setFieldValue("dob", toLocalDate(res.data.data.dob));
            formik.setFieldValue("gender", res.data.data.gender);
            formik.setFieldValue("email", res.data.data.email);
            formik.setFieldValue("class", res.data.data.class);
            formik.setFieldValue("section", res.data.data.section);
            formik.setFieldValue("subject", res.data.data.subject);
        }
    };

    useEffect(() => {
        getTeachersById();
    }, []);

    return (
        <div className="">
            <h2 className="text-xl font-semibold mb-4 text-sky-700 ">{id > 0 ? "Edit" : "Add"} Teacher</h2>

            {/* Your existing form / UI */}
            <form className="space-y-4 p-4 px-5 border border-gray-200 shadow-md rounded-lg overflow-auto" onSubmit={formik.handleSubmit}>

                {/* border-gray-200 shadow-xl p-10"> */}
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

                <DateField
                    label="Date of Birth"
                    name="dob"
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
                    required
                />

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    flex="flex flex-col md:flex-row md:items-center"
                    value={formik.values.email}
                    error={formik.errors.email}
                    onChange={(e) => formik.setFieldValue("email", e)}
                    required
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
                    required
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
                    required
                />

                <Dropdown
                    label="Subject"
                    name="subject"
                    flex="flex flex-col md:flex-row md:items-center"
                    value={formik.values.subject}
                    error={formik.errors.subject}
                    onChange={(e) => formik.setFieldValue("subject", e)}
                    placeholder="Select Subject"
                    options={[
                        { label: "English", value: "ENGLISH" },
                        { label: "Tamil", value: "TAMIL" },
                        { label: "Maths", value: "MATHS" },
                        { label: "Science", value: "SCIENCE" },
                        { label: "Social Science", value: "SOCIAL_SCIENCE" }
                    ]}
                    required
                />

                <div className="space-y-3 md:flex space-x-5 mt-5">
                    <Button
                        label="Cancel"
                        bgAndTextColor="bg-gray-200 text-gray-900"
                        onClick={closePopup}
                    />

                    <Button
                        label="Submit"
                        type="submit"
                    />
                </div>

            </form>
        </div>
    );
};

export default ManageTeacher;