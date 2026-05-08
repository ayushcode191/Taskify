



import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { getApiError } from "../api/client.js";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export default function Register() {
  const { isAuthenticated, register: registerUser } = useAuth();

  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created successfully!");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = getApiError(err, "Registration failed");

      setError("email", {
        message: msg,
      });

      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex relative flex-col justify-between p-14 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Taskify
          </h1>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Smart Team Collaboration Platform
          </div>

          <h2 className="text-5xl font-black leading-tight">
            Build Better
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Teams & Projects
            </span>
            With Taskify
          </h2>

          <p className="mt-6 text-lg text-slate-300 leading-relaxed">
            Create projects, assign tasks, collaborate with your team,
            and track productivity in one powerful workspace.
          </p>

          <div className="mt-10 space-y-4 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              Secure Authentication System
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Project & Team Management
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Real-Time Productivity Tracking
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} Taskify. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100 blur-3xl rounded-full opacity-40"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Taskify
            </h1>
          </div>

          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 sm:p-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Create Account 🚀
            </h2>

            <p className="mt-2 text-slate-500">
              Start managing your projects and tasks with Taskify.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
              noValidate
            >
              <Input
                label="Full Name"
                placeholder="John Doe"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                autoComplete="name"
                {...register("name")}
              />

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="pointer-events-auto p-1 rounded hover:bg-slate-100"
                    tabIndex={-1}
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirm?.message}
                {...register("confirm")}
              />

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full !rounded-2xl !py-3 text-base font-semibold"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-cyan-600 hover:text-cyan-700"
              >
                Sign In
              </Link>
            </p>

            <div className="mt-6 rounded-2xl bg-cyan-50 border border-cyan-100 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">
                First registered user becomes Admin.
              </p>
              <p className="mt-1 text-slate-500">
                All other users will automatically join as Members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


