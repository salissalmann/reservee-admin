import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(5, 'Password must be at least 5 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    phone_no: Yup.string()
        .test(
            'phone-validation', 
            'Phone number is required', 
            function(value) {
                const { country_code } = this.parent;
                if (country_code) {
                    return !!value && value.trim().length > 0;
                }
                return true;
            }
        )
        .when('country_code', {
            is: (country_code: string) => !!country_code,
            then: (schema) => schema
                .min(3, 'Phone number is required')
        }),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
});

export const onboardingValidationSchema = Yup.object().shape({
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    dob: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
});


export const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
});
