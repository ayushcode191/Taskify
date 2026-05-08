import {
  useForm,
  Controller,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { useQuery } from "@tanstack/react-query";

import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import Avatar from "../ui/Avatar.jsx";

import { usersApi } from "../../api/users.api.js";

import { cn } from "../../utils/cn.js";

const schema = z.object({
  name: z
    .string()
    .min(
      2,
      "Project name must be at least 2 characters"
    )
    .max(120),

  description: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("")),

  status: z.enum([
    "planning",
    "active",
    "on_hold",
    "completed",
    "archived",
  ]),

  priority: z.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]),

  color: z.string(),

  startDate: z
    .string()
    .optional()
    .or(z.literal("")),

  dueDate: z
    .string()
    .optional()
    .or(z.literal("")),

  members: z
    .array(z.string())
    .default([]),
});

const COLORS = [
  "#6366f1",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

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

export default function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const values =
    defaultValues || {};

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
    setValue,
  } = useForm({
    resolver:
      zodResolver(schema),

    defaultValues: {
      name:
        values.name || "",

      description:
        values.description ||
        "",

      status:
        values.status ||
        "active",

      priority:
        values.priority ||
        "medium",

      color:
        values.color ||
        "#6366f1",

      startDate:
        toDateInput(
          values.startDate
        ),

      dueDate:
        toDateInput(
          values.dueDate
        ),

      members: (
        values.members || []
      ).map(
        (member) =>
          member._id ||
          member
      ),
    },
  });

  const selectedColor =
    watch("color");

  const selectedMembers =
    watch("members") || [];

  const submit = (
    formValues
  ) => {
    const payload = {
      ...formValues,

      description:
        formValues.description ||
        undefined,

      startDate:
        formValues.startDate ||
        undefined,

      dueDate:
        formValues.dueDate ||
        undefined,
    };

    return onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(
        submit
      )}
      className="space-y-5"
      noValidate
    >
      {/* Name */}
      <Input
        label="Project Name"
        placeholder="Website redesign"
        error={
          errors.name?.message
        }
        {...register("name")}
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Write a short project overview..."
        rows={4}
        error={
          errors.description
            ?.message
        }
        {...register(
          "description"
        )}
      />

      {/* Status & Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          {...register("status")}
          options={[
            {
              value:
                "planning",
              label:
                "Planning",
            },
            {
              value:
                "active",
              label:
                "Active",
            },
            {
              value:
                "on_hold",
              label:
                "On Hold",
            },
            {
              value:
                "completed",
              label:
                "Completed",
            },
            {
              value:
                "archived",
              label:
                "Archived",
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
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Start Date"
          type="date"
          {...register(
            "startDate"
          )}
        />

        <Input
          label="Due Date"
          type="date"
          {...register(
            "dueDate"
          )}
        />
      </div>

      {/* Color */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Project Color
        </label>

        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                setValue(
                  "color",
                  color,
                  {
                    shouldDirty:
                      true,
                  }
                )
              }
              className={cn(
                "h-9 w-9 rounded-xl ring-2 ring-offset-2 transition-all",
                selectedColor ===
                  color
                  ? "ring-slate-900"
                  : "ring-transparent"
              )}
              style={{
                backgroundColor:
                  color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Members */}
      <Controller
        control={control}
        name="members"
        render={({ field }) => (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Team Members
            </label>

            <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-2">
              {users.length ===
              0 ? (
                <p className="px-3 py-4 text-sm text-slate-500">
                  No users
                  available.
                </p>
              ) : (
                users.map(
                  (user) => {
                    const checked =
                      selectedMembers.includes(
                        user._id
                      );

                    return (
                      <label
                        key={
                          user._id
                        }
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                          checked
                            ? "bg-white shadow-sm"
                            : "hover:bg-white"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          className="h-4 w-4 rounded border-slate-300"
                          onChange={(
                            e
                          ) => {
                            const next =
                              e
                                .target
                                .checked
                                ? [
                                    ...selectedMembers,
                                    user._id,
                                  ]
                                : selectedMembers.filter(
                                    (
                                      id
                                    ) =>
                                      id !==
                                      user._id
                                  );

                            field.onChange(
                              next
                            );
                          }}
                        />

                        <Avatar
                          name={
                            user.name
                          }
                          src={
                            user.avatarUrl
                          }
                          size="sm"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {
                              user.name
                            }
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {
                              user.email
                            }
                          </p>
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {
                            user.role
                          }
                        </span>
                      </label>
                    );
                  }
                )
              )}
            </div>
          </div>
        )}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
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