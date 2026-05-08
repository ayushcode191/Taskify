import { Link } from "react-router-dom";

import {
  Calendar,
  CheckSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "../ui/Card.jsx";

import {
  StatusPill,
  PriorityPill,
} from "../ui/StatusBadge.jsx";

import { AvatarGroup } from "../ui/Avatar.jsx";

import { fmtDate } from "../../utils/format.js";

export default function ProjectCard({
  project,
}) {
  const dueSoon =
    project.dueDate &&
    new Date(project.dueDate) -
      new Date() <
      1000 * 60 * 60 * 24 * 7 &&
    project.status !== "completed";

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block"
    >
      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md">
        {/* Top Color Bar */}
        <div
          className="h-1.5 rounded-t-2xl"
          style={{
            background:
              project.color || "#3b82f6",
          }}
        />

        <CardContent>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-slate-900">
                {project.name}
              </h3>

              {project.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {project.description}
                </p>
              )}
            </div>

            <PriorityPill
              priority={project.priority}
            />
          </div>

          {/* Status & Info */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusPill
              status={project.status}
            />

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckSquare className="h-3.5 w-3.5" />

              <span>
                {project.taskCount || 0} Tasks
              </span>
            </div>

            {project.dueDate && (
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  dueSoon
                    ? "font-medium text-rose-600"
                    : "text-slate-500"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />

                <span>
                  {fmtDate(
                    project.dueDate,
                    "MMM d"
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <AvatarGroup
              users={project.members || []}
              max={4}
            />

            <p className="text-xs text-slate-400">
              Owner:{" "}
              <span className="font-medium text-slate-500">
                {project.owner?.name?.split(
                  " "
                )[0]}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}