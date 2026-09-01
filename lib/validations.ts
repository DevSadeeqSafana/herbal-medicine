import { z } from 'zod';

export const registrationSchema = z.object({
  programmeId: z.string().min(1, 'Please select a programme'),

  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),

  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email is required'),

  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 digits')
    .regex(/^[+\d\s()-]+$/, 'Invalid phone number format'),

  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, 'You must be at least 16 years old'),

  // Address Information
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),

  city: z.string()
    .min(2, 'City is required')
    .max(50, 'City name must not exceed 50 characters'),

  state: z.string()
    .min(2, 'State is required')
    .max(50, 'State name must not exceed 50 characters'),

  country: z.string()
    .min(2, 'Country is required')
    .max(50, 'Country name must not exceed 50 characters'),

  // Educational Background
  qualification: z.string()
    .min(2, 'Qualification is required')
    .max(100, 'Qualification must not exceed 100 characters'),

  institution: z.string()
    .max(100, 'Institution name must not exceed 100 characters')
    .optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
