import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(1, "Password must be at least 1 characters")
    .required("Password is required"),
});

export const googleValidationSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email").required("Email is required"),
  fullname: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
});
