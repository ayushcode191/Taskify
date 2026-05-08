import {
  useForm,
  Controller,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useQuery } from "@tanstack/react-query";

import {
  Calendar,
  Flag,
  FolderKanban,
  User,
} from "lucide-react";

import Input from "../ui/Input.jsx";

import Textarea from "../ui/Textarea.jsx";

import Select from "../ui/Select.jsx";

import Button from "../ui/Button.jsx";

import Avatar from "../ui/Avatar.jsx";

import { usersApi } from "../../api/users.api.js";

import { projectsApi } from "../../api/projects.api.js";

import { cn } from "../../utils/cn.js";

const schema = z.object({
  title: z
    .string()
    .min(
      2,
      "Title must be at least 2 characters"
    )
    .max(200),

  description: z
    .string()
    .max(5000)
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "todo",
    "in_progress",
    "review",
    "done",
  ]),

  priority: z.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]),

  project: z
    .string()
    .min(
      1,
      "Project is required"
    ),

  assignee: z
    .string()
    .optional()
    .or(z.literal("")),

  dueDate: z
    .string()
    .optional()
    .or(z.literal("")),
});

function toDateInput(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (
    isNaN(parsed.getTime())
  ) {
    return "";
  }

  return parsed
    .toISOString()
    .slice(0, 10);
}

export default function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  lockProject = false,
}) {
  const values =
    defaultValues || {};

  const {
    data: projects = [],
  } = useQuery({
    queryKey: ["projects-light"],

    queryFn: () =>
      projectsApi.list(),
  });

  const {
    data: users = [],
  } = useQuery({
    queryKey: ["users-light"],

    queryFn: () =>
      usersApi.list(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
    watch,
  } = useForm({
    resolver:
      zodResolver(schema),

    defaultValues: {
      title:
        values.title || "",

      description:
        values.description ||
        "",

      status:
        values.status ||
        "todo",

      priority:
        values.priority ||
        "medium",

      project:
        values.project?._id ||
        values.project ||
        "",

      assignee:
        values.assignee
          ?._id ||
        values.assignee ||
        "",

      dueDate:
        toDateInput(
          values.dueDate
        ),
    },
  });

  const selectedProject =
    watch("project");

  const selected =
    projects.find(
      (project) =>
        project._id ===
        selectedProject
    );

  const candidateAssignees =
    (() => {
      if (!selected) {
        return users;
      }

      const ids = new Set(
        [
          selected.owner
            ?._id,

          ...(
            selected.members ||
            []
          ).map(
            (member) =>
              member._id
          ),
        ].filter(Boolean)
      );

      return users.filter(
        (user) =>
          ids.has(user._id)
      );
    })();

  const submit = (
    formValues
  ) =>
    onSubmit({
      ...formValues,

      description:
        formValues.description ||
        undefined,

      assignee:
        formValues.assignee ||
        null,

      dueDate:
        formValues.dueDate ||
        undefined,
    });

  return (
    <form
      onSubmit={handleSubmit(
        submit
      )}
      className="space-y-6"
      noValidate
    >
      {/* Title */}
      <Input
        label="Task Title"
        placeholder="Design dashboard UI..."
        leftIcon={
          <Flag className="h-4 w-4" />
        }
        error={
          errors.title?.message
        }
        {...register("title")}
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Add task details, links, notes..."
        rows={4}
        error={
          errors.description
            ?.message
        }
        {...register(
          "description"
        )}
      />

      {/* Project + Assignee */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="project"
          render={({ field }) => (
            <Select
              label="Project"
              disabled={
                lockProject
              }
              error={
                errors.project
                  ?.message
              }
              {...field}
            >
              <option value="">
                Select Project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={
                      project._id
                    }
                    value={
                      project._id
                    }
                  >
                    {
                      project.name
                    }
                  </option>
                )
              )}
            </Select>
          )}
        />

        <Controller
          control={control}
          name="assignee"
          render={({ field }) => (
            <Select
              label="Assignee"
              {...field}
            >
              <option value="">
                Unassigned
              </option>

              {candidateAssignees.map(
                (user) => (
                  <option
                    key={
                      user._id
                    }
                    value={
                      user._id
                    }
                  >
                    {user.name}
                  </option>
                )
              )}
            </Select>
          )}
        />
      </div>

      {/* Status + Priority + Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Status"
          {...register("status")}
          options={[
            {
              value: "todo",
              label: "To Do",
            },
            {
              value:
                "in_progress",
              label:
                "In Progress",
            },
            {
              value:
                "review",
              label:
                "In Review",
            },
            {
              value: "done",
              label: "Done",
            },
          ]}
        />

        <Select
          label="Priority"
          {...register(
            "priority"
          )}
          options={[
            {
              value: "low",
              label: "Low",
            },
            {
              value:
                "medium",
              label:
                "Medium",
            },
            {
              value: "high",
              label: "High",
            },
            {
              value:
                "urgent",
              label:
                "Urgent",
            },
          ]}
        />

        <Input
          label="Due Date"
          type="date"
          leftIcon={
            <Calendar className="h-4 w-4" />
          }
          {...register(
            "dueDate"
          )}
        />
      </div>

      {/* Selected Project Info */}
      {selected && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div
              className="mt-1 h-3 w-3 rounded-full"
              style={{
                background:
                  selected.color,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {
                  selected.name
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {
                  selected.description
                }
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Avatar
                  name={
                    selected.owner
                      ?.name
                  }
                  src={
                    selected.owner
                      ?.avatarUrl
                  }
                  size="xs"
                />

                <span className="text-xs text-slate-500">
                  Owner:{" "}
                  {
                    selected
                      .owner
                      ?.name
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          loading={
            isSubmitting
          }
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}