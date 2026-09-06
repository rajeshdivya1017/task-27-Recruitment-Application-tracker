import { z } from "zod";

export const JobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  department: z.enum([
    "Engineering",
    "Sales",
    "HR",
    "Marketing",
    "Finance",
    "Operations",
  ]),

  location: z
    .string()
    .min(2, "Location is required"),

  type: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
  ]),

  description: z
    .string()
    .optional(),

  posted_on: z
    .string()
    .min(1, "Date is required"),
});

export const ApplicantSchema = z.object({
  job_id: z
    .number()
    .int()
    .positive("Please select a job"),

  full_name: z
    .string()
    .min(2, "Name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "10-digit number required",
    ),

  experience_yrs: z
    .number()
    .min(0, "Cannot be negative"),

  resume_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  applied_on: z
    .string()
    .min(1, "Date is required"),

  notes: z
    .string()
    .optional(),
});

export type JobFormValues = z.infer<
  typeof JobSchema
>;

export type ApplicantFormValues = z.infer<
  typeof ApplicantSchema
>;