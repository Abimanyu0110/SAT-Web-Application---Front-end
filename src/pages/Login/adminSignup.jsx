import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

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

const Signup = () => {

    const navigate = useNavigate();
    const { header } = useAdmin();
    const role = "ADMIN";

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
            role: role,
            organizationCode: "",
            shortName: ""
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
            password: yup
                .string()
                .min(2, "Minimum " + " 2")
                .max(50, "Maximum " + " 50")
                .required("Required"),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Required"),
            organizationName: yup
                .string()
                .min(2, "Minimum " + " 2")
                .max(25, "Maximum" + " 25")
                .required("Required"),
            secretCode: yup
                .string()
                .required("Required"),
            shortName: yup
                .string()
                .matches(/^[A-Za-z\s]+$/, "Letters Only")
                .min(2, "Minimum " + " 2")
                .max(10, "Maximum " + " 10")
                .required("Required"),
            organizationCode: yup
                .number()
                .typeError("Must be a number")
                .required("Required"),
        }),
        onSubmit: async (e, { resetForm }) => {
            // setBtnLoading(true);
            // alert(JSON.stringify(e))
            // return
            const formData = new FormData();

            formData.append("firstName", e.firstName);
            formData.append("lastName", e.lastName);
            formData.append("dob", new Date(e.dob).toISOString().split("T")[0]);
            formData.append("gender", e.gender);
            formData.append("email", e.email);
            formData.append("password", e.password);
            formData.append("organizationName", e.organizationName);
            formData.append("secretCode", e.secretCode);
            formData.append("role", role);
            formData.append("organizationCode", e.organizationCode);
            formData.append("shortName", e.shortName);

            try {
                // alert(JSON.stringify(formData))
                // return;
                const { data } = await axios.post(API.HOST + API.ADMIN_SIGNUP, formData, header)
                if (data.code === 200) {
                    // setBtnLoading(false);
                    // manuallyClickButtonUsingId();
                    // setPop({ title: data.message, type: "success" }); // Success popup
                    alert(data.message)
                    resetForm();
                    navigate(navLinks.LOGIN)
                } else {
                    alert(JSON.stringify(data.message))
                    console.log(JSON.stringify(data.message))
                    // setBtnLoading(false);
                    // setPop({ title: data.message, type: "error" });
                }
            } catch (error) {
                // setBtnLoading(false);
                // console.error("Error submitting form:", error);
                alert(error)
                alert("There was an error submitting the form.");
                // setPop({ title: error.message, type: "error" });
            }
        },
    });

    const cancel = () => {
        navigate(navLinks.LOGIN)
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center justify-center p-10">
                <h1 className="mb-6 text-center text-3xl font-bold text-sky-700">
                    Admin Signup
                </h1>

                <form className="mx-auto w-full max-w-lg space-y-4 rounded-xl border border-gray-200 p-10 shadow-xl"
                    onSubmit={formik.handleSubmit}>
                    {/* border-gray-200 shadow-xl p-10"> */}
                    <TextField
                        label="First Name"
                        name="firstName"
                        type="text"
                        placeholder="Enter your First Name"
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
                        value={formik.values.lastName}
                        error={formik.errors.lastName}
                        onChange={(e) => formik.setFieldValue("lastName", e)}
                    />

                    <DateField
                        label="Date of Birth"
                        name="dob"
                        value={formik.values.dob}
                        error={formik.errors.dob}
                        onChange={(e) => formik.setFieldValue("dob", e)}
                    />

                    <Dropdown
                        label="Gender"
                        name="gender"
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
                        value={formik.values.email}
                        error={formik.errors.email}
                        onChange={(e) => formik.setFieldValue("email", e)}
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={formik.values.password}
                        error={formik.errors.password}
                        onChange={(e) => formik.setFieldValue("password", e)}
                        required
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Enter Cofirm password"
                        value={formik.values.confirmPassword}
                        error={formik.errors.confirmPassword}
                        onChange={(e) => formik.setFieldValue("confirmPassword", e)}
                        required
                    />

                    <TextField
                        label="Organization Name"
                        name="organizationName"
                        type="text"
                        placeholder="Enter Organization Name"
                        value={formik.values.organizationName}
                        error={formik.errors.organizationName}
                        onChange={(e) => formik.setFieldValue("organizationName", e)}
                        required
                    />

                    <TextField
                        label="Organization Code"
                        name="organizationCode"
                        type="number"
                        placeholder="Enter Organization Code"
                        value={formik.values.organizationCode}
                        error={formik.errors.organizationCode}
                        onChange={(e) => formik.setFieldValue("organizationCode", e)}
                        required
                    />

                    <TextField
                        label="Secret Code"
                        name="secretCode"
                        type="text"
                        placeholder="Enter Secret Code"
                        value={formik.values.secretCode}
                        error={formik.errors.secretCode}
                        onChange={(e) => formik.setFieldValue("secretCode", e)}
                        required
                    />

                    <TextField
                        label="Short Name"
                        name="shortName"
                        type="text"
                        placeholder="Enter Short Name"
                        value={formik.values.shortName}
                        error={formik.errors.shortName}
                        onChange={(e) => formik.setFieldValue("shortName", e)}
                        required
                    />

                    <div className="flex space-x-5 mt-5">
                        <Button
                            label="Cancel & Go Back"
                            bgAndTextColor="bg-gray-200 text-gray-900"
                            onClick={cancel}
                        />

                        <Button
                            label="Submit"
                            type="submit"
                        />
                    </div>

                </form>
            </div>
        </>
    )
}

export default Signup;