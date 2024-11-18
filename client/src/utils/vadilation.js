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

const isAgeValid = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let userAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    userAge--;
  }
  return userAge >= 12 && userAge <= 140;
};

export const updateProfileSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .matches(/^[a-zA-Z0-9_.]*$/, 'Username cannot contain spaces or special characters'),
  fullName: yup
    .string()
    .required('Username is required')
    .matches(/.*\s+.*/, 'Full name must contain at least one space')
    .matches(/^[\p{L}\s_.]*$/u, 'Full name cannot contain special characters'),
  city: yup
    .string()
    .matches(/^[\p{L}\s_.]*$/u, 'City cannot contain numbers or special characters'),
  dob: yup
    .string()
    .required('Date of birth is required')
    .test('is-age-valid', 'User must be between 12 and 140 years old', (value) =>
      isAgeValid(value),
    ),
});

export const updateChannelSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .matches(/^[a-zA-Z0-9_.]*$/, 'Username cannot contain spaces or special characters'),
  channelName: yup
    .string()
    .required('Channel name is required')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Channel name cannot contain special characters'),
});
export const paymentSchema = yup.object({
  cardName: yup
    .string()
    .matches(
      /^[A-Z]+(?:\s[A-Z]+)*$/,
      'Cardholder name must be uppercase, contain only letters without accents, and single spaces between words',
    )
    .trim('Cardholder name must not have leading or trailing spaces')
    .min(3, 'Cardholder name must be at least 3 characters')
    .max(50, 'Cardholder name must be less than 50 characters')
    .required('Cardholder name is required'),

  country: yup.string().required('Country is required'),
});
