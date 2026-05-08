import { useState, useMemo } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  Plus,
  Search,
  AlertTriangle,
  CheckSquare,
  Trash2,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";

import {
  Card,
  CardContent,
} from "../components/ui/Card.jsx";

import {
  StatusPill,
  PriorityPill,
} from "../components/ui/StatusBadge.jsx";

import RoleGate from "../components/auth/RoleGate.jsx";

import TaskForm from "../components/tasks/TaskForm.jsx";

import { tasksApi } from "../api/tasks.api.js";
import { projectsApi } from "../api/projects.api.js";

import { getApiError } from "../api/client.js";

import { fmtDate } from "../utils/format.js";

export default function Tasks() {
  const qc = useQueryClient();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [project, setProject] =
    useState("");

  const [assignee, setAssignee] =
    useState("");

  const [modal, setModal] = useState({
    open: false,
    task: null,
  });

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "tasks",
      {
        status,
        priority,
        project,
        assignee,
      },
    ],

    queryFn: () =>
      tasksApi.list({
        status: status || undefined,
        priority:
          priority || undefined,
        project:
          project || undefined,
        assignee:
          assignee || undefined,
      }),
  });

  const {
    data: projects = [],
  } = useQuery({
    queryKey: ["projects-light"],

    queryFn: () => projectsApi.list(),
  });

  const filteredTasks = useMemo(() => {
    if (!search) {
      return tasks;
    }

    const query = search.toLowerCase();

    return tasks.filter(
      (task) =>
        task.title
          .toLowerCase()
          .includes(query) ||
        (
          task.description || ""
        )
          .toLowerCase()
          .includes(query)
    );
  }, [tasks, search]);

  const createMutation = useMutation({
    mutationFn: tasksApi.create,

    onSuccess: () => {
      toast.success("Task created");

      qc.invalidateQueries({
        queryKey: ["tasks"],
      });

      qc.invalidateQueries({
        queryKey: [
          "dashboard-stats",
        ],
      });

      setModal({
        open: false,
        task: null,
      });
    },

    onError: (err) =>
      toast.error(getApiError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      tasksApi.update(id, payload),

    onSuccess: () => {
      toast.success("Task updated");

      qc.invalidateQueries({
        queryKey: ["tasks"],
      });

      qc.invalidateQueries({
        queryKey: [
          "dashboard-stats",
        ],
      });

      setModal({
        open: false,
        task: null,
      });
    },

    onError: (err) =>
      toast.error(getApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.remove,

    onSuccess: () => {
      toast.success("Task deleted");

      qc.invalidateQueries({
        queryKey: ["tasks"],
      });

      qc.invalidateQueries({
        queryKey: [
          "dashboard-stats",
        ],
      });

      setModal({
        open: false,
        task: null,
      });
    },

    onError: (err) =>
      toast.error(getApiError(err)),
  });

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Manage and track tasks across all projects."
        actions={
          <Button
            onClick={() =>
              setModal({
                open: true,
                task: null,
              })
            }
            leftIcon={
              <Plus className="h-4 w-4" />
            }
          >
            New Task
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              leftIcon={
                <Search className="h-4 w-4" />
              }
            />

            <Select
              value={project}
              onChange={(e) =>
                setProject(
                  e.target.value
                )
              }
            >
              <option value="">
                All Projects
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>
              ))}
            </Select>

            <Select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              options={[
                {
                  value: "",
                  label:
                    "All Statuses",
                },
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
                  value: "review",
                  label: "Review",
                },
                {
                  value: "done",
                  label: "Done",
                },
              ]}
            />

            <Select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
              options={[
                {
                  value: "",
                  label:
                    "All Priorities",
                },
                {
                  value: "low",
                  label: "Low",
                },
                {
                  value: "medium",
                  label: "Medium",
                },
                {
                  value: "high",
                  label: "High",
                },
                {
                  value: "urgent",
                  label: "Urgent",
                },
              ]}
            />

            <Select
              value={assignee}
              onChange={(e) =>
                setAssignee(
                  e.target.value
                )
              }
              options={[
                {
                  value: "",
                  label: "Anyone",
                },
                {
                  value: "me",
                  label: "Assigned to Me",
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load tasks"
          description="Please try again."
          action={
            <Button
              variant="secondary"
              onClick={() =>
                refetch()
              }
            >
              Retry
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map(
            (_, index) => (
              <Card key={index}>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            )
          )}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={
            tasks.length === 0
              ? "No tasks yet"
              : "No matching tasks"
          }
          description={
            tasks.length === 0
              ? "Create your first task to start managing work."
              : "Try changing your filters."
          }
          action={
            <Button
              onClick={() =>
                setModal({
                  open: true,
                  task: null,
                })
              }
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              New Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task._id}
              className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={() =>
                setModal({
                  open: true,
                  task,
                })
              }
            >
              <CardContent>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            task.project
                              ?.color ||
                            "#64748b",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {
                              task.description
                            }
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {task.project && (
                            <span className="text-xs font-medium text-slate-500">
                              {
                                task.project
                                  .name
                              }
                            </span>
                          )}

                          {task.dueDate && (
                            <span className="text-xs text-slate-400">
                              Due{" "}
                              {fmtDate(
                                task.dueDate
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-wrap items-center gap-3">
                    <PriorityPill
                      priority={
                        task.priority
                      }
                    />

                    <StatusPill
                      status={task.status}
                    />

                    {task.assignee ? (
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                        <Avatar
                          name={
                            task.assignee
                              .name
                          }
                          src={
                            task.assignee
                              .avatarUrl
                          }
                          size="xs"
                        />

                        <span className="text-xs font-medium text-slate-600">
                          {
                            task.assignee
                              .name
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() =>
          setModal({
            open: false,
            task: null,
          })
        }
        title={
          modal.task
            ? "Edit Task"
            : "Create Task"
        }
        description="Manage task details and assignments."
        size="lg"
      >
        <TaskForm
          defaultValues={modal.task}
          submitLabel={
            modal.task
              ? "Save Changes"
              : "Create Task"
          }
          onCancel={() =>
            setModal({
              open: false,
              task: null,
            })
          }
          onSubmit={(values) =>
            modal.task
              ? updateMutation.mutateAsync(
                  {
                    id: modal.task._id,
                    payload: values,
                  }
                )
              : createMutation.mutateAsync(
                  values
                )
          }
        />

        {modal.task && (
          <RoleGate
            allow={[
              "admin",
              "manager",
            ]}
          >
            <div className="mt-6 border-t border-slate-100 pt-5">
              <Button
                variant="ghost"
                className="text-rose-600 hover:bg-rose-50"
                leftIcon={
                  <Trash2 className="h-4 w-4" />
                }
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this task?"
                    )
                  ) {
                    deleteMutation.mutate(
                      modal.task._id
                    );
                  }
                }}
              >
                Delete Task
              </Button>
            </div>
          </RoleGate>
        )}
      </Modal>
    </div>
  );
}