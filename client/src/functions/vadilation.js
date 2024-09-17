import * as yup from 'yup';

export const changePasswordSchema = yup.object({
  oldPass: yup.string().required('Old password is required'),
  newPass: yup
    .string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters')
    .matches(/[A-Z]/, 'New password must contain at least 1 uppercase letter')
    .matches(/[0-9]/, 'New password must contain at least 1 number')
    .matches(/[\W_]/, 'New password must contain at least 1 special character')
    .notOneOf([yup.ref('oldPass')], 'New password must be different from current password'),
  confirmPass: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPass')], 'Passwords must match'),
});

export const signUpSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least 1 number')
    .matches(/[\W_]/, 'Password must contain at least 1 special character'),

  confirmPassword: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});
