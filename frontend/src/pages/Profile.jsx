import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import toast from "react-hot-toast";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  Camera,
  Mail,
  Shield,
  Calendar,
  Upload,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";

import Input from "../components/ui/Input.jsx";

import Button from "../components/ui/Button.jsx";

import Avatar from "../components/ui/Avatar.jsx";

import { RolePill } from "../components/ui/StatusBadge.jsx";

import { authApi } from "../api/auth.api.js";

import { getApiError } from "../api/client.js";

import { useAuth } from "../context/AuthContext.jsx";

const profileSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "Name must be at least 2 characters"
    )
    .max(80),

  title: z
    .string()
    .max(80)
    .optional()
    .or(z.literal("")),

  avatarUrl: z
    .string()
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword:
      z
        .string()
        .min(
          1,
          "Current password is required"
        ),

    newPassword: z
      .string()
      .min(
        6,
        "New password must be at least 6 characters"
      ),

    confirmPassword:
      z.string(),
  })

  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: [
        "confirmPassword",
      ],

      message:
        "Passwords do not match",
    }
  );

export default function Profile() {
  const { user, setUser } =
    useAuth();

  const [
    previewImage,
    setPreviewImage,
  ] = useState("");

  const profileForm =
    useForm({
      resolver:
        zodResolver(
          profileSchema
        ),

      defaultValues: {
        name:
          user?.name || "",

        title:
          user?.title || "",

        avatarUrl:
          user?.avatarUrl ||
          "",
      },
    });

  const passwordForm =
    useForm({
      resolver:
        zodResolver(
          passwordSchema
        ),

      defaultValues: {
        currentPassword:
          "",

        newPassword: "",

        confirmPassword:
          "",
      },
    });

  const updateMut =
    useMutation({
      mutationFn:
        authApi.updateProfile,

      onSuccess: ({
        user: updatedUser,
      }) => {
        toast.success(
          "Profile updated"
        );

        setUser(updatedUser);
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const passwordMut =
    useMutation({
      mutationFn:
        authApi.changePassword,

      onSuccess: () => {
        toast.success(
          "Password updated"
        );

        passwordForm.reset();
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const watchedName =
    profileForm.watch("name");

  const watchedAvatar =
    profileForm.watch(
      "avatarUrl"
    );

  const handleImageUpload = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(
        file
      );

    setPreviewImage(
      imageUrl
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your personal information and keep your account secure."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Profile Card */}
        <Card className="overflow-hidden border border-slate-200">
          {/* Top Background */}
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600" />

          <CardContent className="relative flex flex-col items-center px-6 pb-8">
            {/* Avatar */}
            <div className="-mt-14 relative">
              <Avatar
                name={
                  watchedName ||
                  user?.name
                }
                src={
                  previewImage ||
                  watchedAvatar ||
                  user?.avatarUrl
                }
                size="xl"
                className="h-28 w-28 border-4 border-white text-4xl shadow-lg"
              />

              <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-50">
                <Camera className="h-4 w-4 text-slate-700" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleImageUpload
                  }
                />
              </label>
            </div>

            {/* User Info */}
            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              {watchedName ||
                user?.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user?.email}
            </p>

            <div className="mt-4">
              <RolePill
                role={user?.role}
              />
            </div>

            {/* Info List */}
            <div className="mt-8 w-full space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Joined
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    08 May 2026
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-slate-400" />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Role
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-400" />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-medium text-slate-700">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side */}
        <div className="space-y-6 xl:col-span-2">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                Account Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form
                onSubmit={profileForm.handleSubmit(
                  (values) =>
                    updateMut.mutateAsync(
                      values
                    )
                )}
                className="space-y-5"
                noValidate
              >
                <Input
                  label="Full Name"
                  error={
                    profileForm
                      .formState
                      .errors.name
                      ?.message
                  }
                  {...profileForm.register(
                    "name"
                  )}
                />

                <Input
                  label="Title"
                  placeholder="e.g. Frontend Developer"
                  error={
                    profileForm
                      .formState
                      .errors.title
                      ?.message
                  }
                  {...profileForm.register(
                    "title"
                  )}
                />

                {/* Avatar Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Profile Image
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      placeholder="https://..."
                      {...profileForm.register(
                        "avatarUrl"
                      )}
                    />

                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={
                          handleImageUpload
                        }
                      />

                      <div className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        <Upload className="h-4 w-4" />

                        Upload
                      </div>
                    </label>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Recommended:
                    square image,
                    PNG or JPG
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    loading={
                      profileForm
                        .formState
                        .isSubmitting ||
                      updateMut.isPending
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>
                Change Password
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form
                onSubmit={passwordForm.handleSubmit(
                  (values) =>
                    passwordMut.mutateAsync(
                      {
                        currentPassword:
                          values.currentPassword,

                        newPassword:
                          values.newPassword,
                      }
                    )
                )}
                className="space-y-5"
                noValidate
              >
                <Input
                  label="Current Password"
                  type="password"
                  error={
                    passwordForm
                      .formState
                      .errors
                      .currentPassword
                      ?.message
                  }
                  {...passwordForm.register(
                    "currentPassword"
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="New Password"
                    type="password"
                    error={
                      passwordForm
                        .formState
                        .errors
                        .newPassword
                        ?.message
                    }
                    {...passwordForm.register(
                      "newPassword"
                    )}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    error={
                      passwordForm
                        .formState
                        .errors
                        .confirmPassword
                        ?.message
                    }
                    {...passwordForm.register(
                      "confirmPassword"
                    )}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    loading={
                      passwordMut.isPending
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}