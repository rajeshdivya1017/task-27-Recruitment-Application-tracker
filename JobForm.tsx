import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateJob } from "../hooks/useJobs";

import {
  JobSchema,
  type JobFormValues,
} from "../schemas";

import type {
  Department,
  JobType,
} from "../types";

interface JobFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const JobForm = ({
  onSuccess,
  onCancel,
}: JobFormProps) => {
  const createJobMutation = useCreateJob();

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<JobFormValues>({
    resolver: zodResolver(JobSchema),

    defaultValues: {
      title: "",
      department: "Engineering",
      location: "",
      type: "Full-time",
      description: "",
      posted_on: new Date()
        .toISOString()
        .split("T")[0],
    },
  });

  const onSubmit = async (
    data: JobFormValues,
  ) => {
    try {
      await createJobMutation.mutateAsync({
        ...data,
        title: data.title.trim(),
        location: data.location.trim(),
        description:
          data.description?.trim() || "",
      });

      onSuccess();
    } catch (error) {
      console.error(
        "Failed to create job:",
        error,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="job-title">
          Job Title
        </label>

        <input
          id="job-title"
          type="text"
          placeholder="e.g. Senior React Developer"
          disabled={
            createJobMutation.isPending
          }
          {...register("title")}
        />

        {errors.title && (
          <small className="field-error">
            {errors.title.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job-department">
          Department
        </label>

        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <select
              id="job-department"
              value={field.value}
              onChange={(event) =>
                field.onChange(
                  event.target.value as Department,
                )
              }
              disabled={
                createJobMutation.isPending
              }
            >
              <option value="Engineering">
                Engineering
              </option>

              <option value="Sales">
                Sales
              </option>

              <option value="HR">
                HR
              </option>

              <option value="Marketing">
                Marketing
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Operations">
                Operations
              </option>
            </select>
          )}
        />

        {errors.department && (
          <small className="field-error">
            {errors.department.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job-location">
          Location
        </label>

        <input
          id="job-location"
          type="text"
          placeholder="e.g. Chennai, India"
          disabled={
            createJobMutation.isPending
          }
          {...register("location")}
        />

        {errors.location && (
          <small className="field-error">
            {errors.location.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job-type">
          Job Type
        </label>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <select
              id="job-type"
              value={field.value}
              onChange={(event) =>
                field.onChange(
                  event.target.value as JobType,
                )
              }
              disabled={
                createJobMutation.isPending
              }
            >
              <option value="Full-time">
                Full-time
              </option>

              <option value="Part-time">
                Part-time
              </option>

              <option value="Contract">
                Contract
              </option>

              <option value="Internship">
                Internship
              </option>
            </select>
          )}
        />

        {errors.type && (
          <small className="field-error">
            {errors.type.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job-description">
          Description
        </label>

        <textarea
          id="job-description"
          placeholder="Enter job description..."
          rows={4}
          disabled={
            createJobMutation.isPending
          }
          {...register("description")}
        />

        {errors.description && (
          <small className="field-error">
            {errors.description.message}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="job-posted-on">
          Posted Date
        </label>

        <input
          id="job-posted-on"
          type="date"
          disabled={
            createJobMutation.isPending
          }
          {...register("posted_on")}
        />

        {errors.posted_on && (
          <small className="field-error">
            {errors.posted_on.message}
          </small>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={
            createJobMutation.isPending
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            createJobMutation.isPending
          }
        >
          {createJobMutation.isPending
            ? "Creating..."
            : "Create Job"}
        </button>
      </div>
    </form>
  );
};

export default JobForm;