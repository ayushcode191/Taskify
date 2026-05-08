

import { useMemo, useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  Plus,
  Search,
  FolderKanban,
  AlertTriangle,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

import RoleGate from "../components/auth/RoleGate.jsx";

import ProjectCard from "../components/projects/ProjectCard.jsx";
import ProjectForm from "../components/projects/ProjectForm.jsx";

import { projectsApi } from "../api/projects.api.js";

import { getApiError } from "../api/client.js";

export default function Projects() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] =
    useState("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects", { status, priority }],
    queryFn: () =>
      projectsApi.list({
        status: status || undefined,
        priority: priority || undefined,
      }),
  });

  const filteredProjects = useMemo(() => {
    if (!search) {
      return projects;
    }

    const query = search.toLowerCase();

    return projects.filter(
      (project) =>
        project.name
          .toLowerCase()
          .includes(query) ||
        (project.description || "")
          .toLowerCase()
          .includes(query)
    );
  }, [projects, search]);

  const createMutation = useMutation({
    mutationFn: projectsApi.create,

    onSuccess: () => {
      toast.success("Project created");

      qc.invalidateQueries({
        queryKey: ["projects"],
      });

      qc.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });

      setCreateOpen(false);
    },

    onError: (err) => {
      toast.error(
        getApiError(
          err,
          "Failed to create project"
        )
      );
    },
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage and organize all your team projects in one place."
        actions={
          <RoleGate allow={["admin", "manager"]}>
            <Button
              onClick={() =>
                setCreateOpen(true)
              }
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              New Project
            </Button>
          </RoleGate>
        }
      />

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          placeholder="Search projects..."
          leftIcon={
            <Search className="h-4 w-4" />
          }
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <Select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          options={[
            {
              value: "",
              label: "All Statuses",
            },
            {
              value: "planning",
              label: "Planning",
            },
            {
              value: "active",
              label: "Active",
            },
            {
              value: "on_hold",
              label: "On Hold",
            },
            {
              value: "completed",
              label: "Completed",
            },
            {
              value: "archived",
              label: "Archived",
            },
          ]}
        />

        <Select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          options={[
            {
              value: "",
              label: "All Priorities",
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
      </div>

      {/* Error */}
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load projects"
          description="Please try again."
          action={
            <Button
              variant="secondary"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : isLoading ? (
        /* Loading */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="space-y-3">
                <Skeleton className="h-5 w-2/3" />

                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-4/5" />

                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />

                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={FolderKanban}
          title={
            projects.length === 0
              ? "No projects yet"
              : "No matching projects"
          }
          description={
            projects.length === 0
              ? "Create your first project to start collaborating with your team."
              : "Try changing filters or search keywords."
          }
          action={
            <RoleGate allow={["admin", "manager"]}>
              <Button
                onClick={() =>
                  setCreateOpen(true)
                }
                leftIcon={
                  <Plus className="h-4 w-4" />
                }
              >
                New Project
              </Button>
            </RoleGate>
          }
        />
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        title="Create Project"
        description="Set up a new project for your team."
        size="lg"
      >
        <ProjectForm
          submitLabel="Create Project"
          onCancel={() =>
            setCreateOpen(false)
          }
          onSubmit={(values) =>
            createMutation.mutateAsync(values)
          }
        />
      </Modal>
    </div>
  );
}