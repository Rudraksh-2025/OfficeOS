import * as Yup from "yup";

export const registerSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name too long")
        .required("Name is required"),

    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .matches(/[a-z]/, "Must contain at least 1 lowercase letter")
        .matches(/[0-9]/, "Must contain at least 1 number")
        .required("Password is required"),

    workspaceName: Yup.string()
        .min(3, "Workspace name must be at least 3 characters")
        .max(50, "Workspace name too long")
        .required("Workspace name is required"),
});