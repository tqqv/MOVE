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
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[^\s@]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),

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
    .nullable()
    .min(6, 'Username must be at least 6 characters')
    .max(32, 'Username must be at most 32 characters')
    .matches(
      /^[a-z0-9_.]*$/,
      'Username must not contain uppercase letters, spaces, or special characters',
    ),
  fullName: yup
    .string()
    .nullable()
    .matches(/.*\s+.*/, 'Full name must contain at least one space')
    .matches(/^[\p{L}\s_.]*$/u, 'Full name cannot contain special characters'),
  city: yup
    .string()
    .nullable()
    .matches(/^[\p{L}\s_.]*$/u, 'City cannot contain numbers or special characters'),
  dob: yup
    .string()
    .nullable()
    .test('is-age-valid', 'User must be between 12 and 140 years old', (value) =>
      isAgeValid(value),
    ),
});

export const updateChannelSchema = yup.object({
  username: yup
    .string()
    .nullable()
    .min(6, 'Username must be at least 6 characters')
    .max(32, 'Username must be at most 32 characters')
    .matches(
      /^[a-z0-9_.]*$/,
      'Username must not contain uppercase letters, spaces, or special characters',
    ),
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
      'Cardholder name must be contain only letters without accents, and single spaces between words',
    )
    .trim('Cardholder name must not have leading or trailing spaces')
    .min(3, 'Cardholder name must be at least 3 characters')
    .max(50, 'Cardholder name must be less than 50 characters')
    .required('Cardholder name is required'),

  country: yup.string().required('Country is required'),
});
export const cashoutSchema = yup.object({
  bankHolderName: yup
    .string()
    .matches(
      /^[A-Z]+(?:\s[A-Z]+)*$/,
      'Bank Holder Name must contain only letters without accents and single spaces between words',
    )
    .trim('Bank Holder Name must not have leading or trailing spaces')
    .min(3, 'Bank Holder Name must be at least 3 characters')
    .max(50, 'Bank Holder Name must be less than 50 characters')
    .required('Bank Holder Name is required'),

  bankNumber: yup
    .string()
    .matches(/^[0-9]{9,16}$/, 'Bank Account Number must be between 9 and 16 digits')
    .required('Bank Account Number is required'),

  routingNumber: yup
    .string()
    .matches(
      /^[A-Za-z0-9]+-[A-Za-z0-9]+$/,
      'Bank Code - Branch Code must be in the format BankCode-BranchCode',
    )
    .required('Bank Code - Branch Code is required'),
});
