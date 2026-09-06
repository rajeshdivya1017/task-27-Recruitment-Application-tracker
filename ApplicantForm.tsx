import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ApplicantSchema,
  type ApplicantFormValues,
} from "../schemas";

import type { ApplicantFormData } from "../types";

interface ApplicantFormProps {
  initialData?: Partial<ApplicantFormData>;

  onSubmit: (data: ApplicantFormData) => void;

  onCancel?: () => void;

  isLoading?: boolean;
}

const ApplicantForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ApplicantFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(ApplicantSchema),

    defaultValues: {
      job_id: initialData?.job_id ?? 0,
      full_name: initialData?.full_name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      experience_yrs:
        initialData?.experience_yrs ?? 0,
      resume_url:
        initialData?.resume_url ?? "",
      applied_on:
        initialData?.applied_on ??
        new Date()
          .toISOString()
          .split("T")[0],
      notes: initialData?.notes ?? "",
    },
  });

  const handleFormSubmit = (
    data: ApplicantFormValues,
  ) => {
    const applicantData: ApplicantFormData = {
      job_id: data.job_id,
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      experience_yrs: data.experience_yrs,
      resume_url:
        data.resume_url?.trim() || "",
      applied_on: data.applied_on,
      notes: data.notes?.trim() || "",
    };

    onSubmit(applicantData);
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit,
      )}
    >
      <div className="form-group">
        <label htmlFor="applicant-job-id">
          Job ID
        </label>

        <input
          id="applicant-job-id"
          type="number"
          min="1"
          placeholder="Enter job ID"
          disabled={isLoading}
          {...register(
            "job_id",
            {
              valueAsNumber: true,
            },
          )}
        />

        {errors.job_id && (
          <small className="field-error">
            {errors.job_id.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-full-name">
          Full Name
        </label>

        <input
          id="applicant-full-name"
          type="text"
          placeholder="Enter applicant name"
          disabled={isLoading}
          {...register("full_name")}
        />

        {errors.full_name && (
          <small className="field-error">
            {errors.full_name.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-email">
          Email
        </label>

        <input
          id="applicant-email"
          type="email"
          placeholder="Enter email address"
          disabled={isLoading}
          {...register("email")}
        />

        {errors.email && (
          <small className="field-error">
            {errors.email.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-phone">
          Phone
        </label>

        <input
          id="applicant-phone"
          type="tel"
          placeholder="Enter 10-digit phone number"
          disabled={isLoading}
          {...register("phone")}
        />

        {errors.phone && (
          <small className="field-error">
            {errors.phone.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-experience">
          Experience (Years)
        </label>

        <input
          id="applicant-experience"
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g. 2.5"
          disabled={isLoading}
          {...register(
            "experience_yrs",
            {
              valueAsNumber: true,
            },
          )}
        />

        {errors.experience_yrs && (
          <small className="field-error">
            {
              errors.experience_yrs
                .message
            }
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-resume">
          Resume URL
        </label>

        <input
          id="applicant-resume"
          type="url"
          placeholder="https://example.com/resume.pdf"
          disabled={isLoading}
          {...register("resume_url")}
        />

        {errors.resume_url && (
          <small className="field-error">
            {errors.resume_url.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-applied-on">
          Applied On
        </label>

        <input
          id="applicant-applied-on"
          type="date"
          disabled={isLoading}
          {...register("applied_on")}
        />

        {errors.applied_on && (
          <small className="field-error">
            {errors.applied_on.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="applicant-notes">
          Notes
        </label>

        <textarea
          id="applicant-notes"
          rows={4}
          placeholder="Additional notes..."
          disabled={isLoading}
          {...register("notes")}
        />

        {errors.notes && (
          <small className="field-error">
            {errors.notes.message}
          </small>
        )}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : "Save Applicant"}
        </button>
      </div>
    </form>
  );
};

export default ApplicantForm;