import { useState } from "react";

import { Plus } from "lucide-react";

import TaskCard from "./TaskCard.jsx";

import {
  STATUS_LABEL,
  STATUS_COLORS,
} from "../../utils/format.js";

import { cn } from "../../utils/cn.js";

const COLUMNS = [
  "todo",
  "in_progress",
  "review",
  "done",
];

export default function TaskBoard({
  tasks = [],
  onTaskClick,
  onStatusChange,
  onAddTask,
  canEdit = true,
}) {
  const [dragOver, setDragOver] =
    useState(null);

  const grouped = COLUMNS.reduce(
    (acc, status) => {
      acc[status] = tasks.filter(
        (task) =>
          task.status === status
      );

      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
      {COLUMNS.map((status) => {
        const config =
          STATUS_COLORS[status];

        const list =
          grouped[status];

        return (
          <div
            key={status}
            onDragOver={(e) => {
              if (!canEdit) return;

              e.preventDefault();

              setDragOver(status);
            }}
            onDragLeave={() =>
              setDragOver(null)
            }
            onDrop={(e) => {
              if (!canEdit) return;

              e.preventDefault();

              const id =
                e.dataTransfer.getData(
                  "text/task-id"
                );

              const fromStatus =
                e.dataTransfer.getData(
                  "text/from-status"
                );

              setDragOver(null);

              if (
                id &&
                fromStatus !== status
              ) {
                onStatusChange?.(
                  id,
                  status
                );
              }
            }}
            className={cn(
              "flex min-h-[420px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all",
              dragOver === status &&
                "border-slate-400 bg-slate-100"
            )}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    config.dot
                  )}
                />

                <h3 className="text-sm font-semibold text-slate-800">
                  {
                    STATUS_LABEL[
                      status
                    ]
                  }
                </h3>

                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                  {list.length}
                </span>
              </div>

              {onAddTask &&
                canEdit && (
                  <button
                    onClick={() =>
                      onAddTask(
                        status
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3">
              {list.length === 0 ? (
                <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xs text-slate-400">
                  No tasks
                </div>
              ) : (
                list.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() =>
                      onTaskClick?.(
                        task
                      )
                    }
                    draggable={
                      canEdit
                    }
                    onDragStart={(
                      e
                    ) => {
                      e.dataTransfer.setData(
                        "text/task-id",
                        task._id
                      );

                      e.dataTransfer.setData(
                        "text/from-status",
                        task.status
                      );
                    }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}