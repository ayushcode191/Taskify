import { useState, useMemo } from "react";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Plus,
  Calendar,
  Users as UsersIcon,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";

import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";

import {
  StatusPill,
  PriorityPill,
} from "../components/ui/StatusBadge.jsx";

import Avatar, {
  AvatarGroup,
} from "../components/ui/Avatar.jsx";

import RoleGate from "../components/auth/RoleGate.jsx";

import TaskBoard from "../components/tasks/TaskBoard.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";

import ProjectForm from "../components/projects/ProjectForm.jsx";

import { projectsApi } from "../api/projects.api.js";
import { tasksApi } from "../api/tasks.api.js";

import { getApiError } from "../api/client.js";

import { fmtDate } from "../utils/format.js";

import { useAuth } from "../context/AuthContext.jsx";

export default function ProjectDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const qc = useQueryClient();

  const { user, hasRole } = useAuth();

  const [taskModal, setTaskModal] =
    useState({
      open: false,
      task: null,
      defaultStatus: null,
    });

  const [editProjectOpen, setEditProjectOpen] =
    useState(false);

  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useQuery({
    queryKey: ["project", id],

    queryFn: () =>
      projectsApi.get(id),
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
  } = useQuery({
    queryKey: [
      "tasks",
      { project: id },
    ],

    queryFn: () =>
      tasksApi.list({
        project: id,
      }),

    enabled: !!id,
  });

  const stats = useMemo(() => {
    const total = tasks.length;

    const done = tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

    return {
      total,

      done,

      progress:
        total === 0
          ? 0
          : Math.round(
              (done / total) * 100
            ),
    };
  }, [tasks]);

  const canManage =
    hasRole("admin", "manager") ||
    project?.owner?._id === user?._id;

  const createTaskMutation =
    useMutation({
      mutationFn: tasksApi.create,

      onSuccess: () => {
        toast.success("Task created");

        qc.invalidateQueries({
          queryKey: ["tasks"],
        });

        qc.invalidateQueries({
          queryKey: [
            "project",
            id,
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "dashboard-stats",
          ],
        });

        setTaskModal({
          open: false,
          task: null,
          defaultStatus: null,
        });
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const updateTaskMutation =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }) =>
        tasksApi.update(
          id,
          payload
        ),

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

        setTaskModal({
          open: false,
          task: null,
          defaultStatus: null,
        });
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const deleteTaskMutation =
    useMutation({
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

        setTaskModal({
          open: false,
          task: null,
          defaultStatus: null,
        });
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const updateProjectMutation =
    useMutation({
      mutationFn: (payload) =>
        projectsApi.update(
          id,
          payload
        ),

      onSuccess: () => {
        toast.success(
          "Project updated"
        );

        qc.invalidateQueries({
          queryKey: [
            "project",
            id,
          ],
        });

        qc.invalidateQueries({
          queryKey: ["projects"],
        });

        setEditProjectOpen(false);
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const deleteProjectMutation =
    useMutation({
      mutationFn: () =>
        projectsApi.remove(id),

      onSuccess: () => {
        toast.success(
          "Project deleted"
        );

        qc.invalidateQueries({
          queryKey: ["projects"],
        });

        qc.invalidateQueries({
          queryKey: [
            "dashboard-stats",
          ],
        });

        navigate("/projects");
      },

      onError: (err) =>
        toast.error(
          getApiError(err)
        ),
    });

  const handleStatusDrop = (
    taskId,
    newStatus
  ) => {
    updateTaskMutation.mutate({
      id: taskId,

      payload: {
        status: newStatus,
      },
    });
  };

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />

        <Skeleton className="h-10 w-1/2" />

        <Skeleton className="h-4 w-3/4" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Project not found"
        description="It may have been deleted or you don't have access."
        action={
          <Button
            variant="secondary"
            onClick={() =>
              navigate("/projects")
            }
          >
            Back to projects
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* Back */}
      <Link
        to="/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </Link>

      {/* Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                background:
                  project.color,
              }}
            />

            <span>
              {project.name}
            </span>
          </div>
        }
        description={
          project.description
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
              onClick={() =>
                setTaskModal({
                  open: true,
                  task: null,
                  defaultStatus:
                    "todo",
                })
              }
            >
              Add Task
            </Button>

            {canManage && (
              <>
                <Button
                  variant="secondary"
                  leftIcon={
                    <Pencil className="h-4 w-4" />
                  }
                  onClick={() =>
                    setEditProjectOpen(
                      true
                    )
                  }
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50"
                  leftIcon={
                    <Trash2 className="h-4 w-4" />
                  }
                  onClick={() =>
                    setConfirmDelete(
                      true
                    )
                  }
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </p>

            <div className="mt-3">
              <StatusPill
                status={
                  project.status
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Priority
            </p>

            <div className="mt-3">
              <PriorityPill
                priority={
                  project.priority
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Due Date
            </p>

            <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />

              {fmtDate(
                project.dueDate
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Progress
              </p>

              <span className="text-sm font-semibold text-slate-900">
                {stats.progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-slate-900 transition-all"
                style={{
                  width: `${stats.progress}%`,
                }}
              />
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
              <CheckSquare className="h-3.5 w-3.5" />

              {stats.done}/
              {stats.total} tasks
              completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main */}
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
        {/* Board */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Task Board
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            {tasksLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[...Array(4)].map(
                  (_, index) => (
                    <Skeleton
                      key={index}
                      className="h-52 w-full"
                    />
                  )
                )}
              </div>
            ) : (
              <TaskBoard
                tasks={tasks}
                onTaskClick={(
                  task
                ) =>
                  setTaskModal({
                    open: true,
                    task,
                    defaultStatus:
                      null,
                  })
                }
                onAddTask={(
                  status
                ) =>
                  setTaskModal({
                    open: true,
                    task: null,
                    defaultStatus:
                      status,
                  })
                }
                onStatusChange={
                  handleStatusDrop
                }
                canEdit
              />
            )}
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-slate-400" />

              Team
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-5">
              <AvatarGroup
                users={
                  project.members ||
                  []
                }
                max={6}
                size="md"
              />
            </div>

            <ul className="space-y-4">
              {[
                project.owner,
                ...(
                  project.members ||
                  []
                ).filter(
                  (member) =>
                    member._id !==
                    project.owner
                      ?._id
                ),
              ]
                .filter(Boolean)
                .map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center gap-3"
                  >
                    <Avatar
                      name={
                        member.name
                      }
                      src={
                        member.avatarUrl
                      }
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {member.name}

                        {member._id ===
                          project
                            .owner
                            ?._id && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                            owner
                          </span>
                        )}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {
                          member.email
                        }
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Task Modal */}
      <Modal
        open={taskModal.open}
        onClose={() =>
          setTaskModal({
            open: false,
            task: null,
            defaultStatus: null,
          })
        }
        title={
          taskModal.task
            ? "Edit Task"
            : "Create Task"
        }
        size="lg"
      >
        <TaskForm
          lockProject
          submitLabel={
            taskModal.task
              ? "Save Changes"
              : "Create Task"
          }
          defaultValues={
            taskModal.task
              ? taskModal.task
              : {
                  project: id,
                  status:
                    taskModal.defaultStatus ||
                    "todo",
                }
          }
          onCancel={() =>
            setTaskModal({
              open: false,
              task: null,
              defaultStatus: null,
            })
          }
          onSubmit={(values) =>
            taskModal.task
              ? updateTaskMutation.mutateAsync(
                  {
                    id: taskModal
                      .task._id,
                    payload:
                      values,
                  }
                )
              : createTaskMutation.mutateAsync(
                  values
                )
          }
        />

        {taskModal.task && (
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
                    deleteTaskMutation.mutate(
                      taskModal.task
                        ._id
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

      {/* Edit Project */}
      <Modal
        open={editProjectOpen}
        onClose={() =>
          setEditProjectOpen(
            false
          )
        }
        title="Edit Project"
        size="lg"
      >
        <ProjectForm
          defaultValues={project}
          submitLabel="Save Changes"
          onCancel={() =>
            setEditProjectOpen(
              false
            )
          }
          onSubmit={(values) =>
            updateProjectMutation.mutateAsync(
              values
            )
          }
        />
      </Modal>

      {/* Delete Project */}
      <Modal
        open={confirmDelete}
        onClose={() =>
          setConfirmDelete(false)
        }
        title="Delete Project?"
        description="This action cannot be undone."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setConfirmDelete(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              loading={
                deleteProjectMutation.isPending
              }
              onClick={() =>
                deleteProjectMutation.mutate()
              }
            >
              Delete Project
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to
          delete{" "}
          <span className="font-semibold text-slate-900">
            {project.name}
          </span>
          ?
        </p>
      </Modal>
    </div>
  );
}