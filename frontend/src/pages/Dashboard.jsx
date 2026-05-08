import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Users as UsersIcon,
  TrendingUp,
  ArrowRight,
  Inbox,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader.jsx";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";

import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Avatar from "../components/ui/Avatar.jsx";

import {
  StatusPill,
  PriorityPill,
} from "../components/ui/StatusBadge.jsx";

import { dashboardApi } from "../api/dashboard.api.js";

import { useAuth } from "../context/AuthContext.jsx";

import {
  fmtRelative,
  STATUS_LABEL,
} from "../utils/format.js";

const STATUS_COLORS_HEX = {
  todo: "#94a3b8",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  done: "#10b981",
};

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {label}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </h3>

            {hint && (
              <p className="mt-1 text-xs text-slate-500">
                {hint}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton className="h-3 w-24" />

        <Skeleton className="mt-3 h-8 w-16" />

        <Skeleton className="mt-3 h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, hasRole } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.stats,
  });

  const pieData = data
    ? Object.entries(data.tasks.byStatus).map(
        ([key, value]) => ({
          name: STATUS_LABEL[key] || key,
          value,
          key,
        })
      )
    : [];

  const totalForPie = pieData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div>
      <PageHeader
        title={`Hi, ${
          user?.name?.split(" ")[0] || "there"
        }`}
        description="Here's an overview of your projects, tasks, and team activity."
      />

      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load dashboard"
          description="Please try again in a few moments."
          action={
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Retry
            </button>
          }
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Active Projects"
                  value={data.projects.active}
                  hint={`${data.projects.total} total`}
                  icon={FolderKanban}
                />

                <StatCard
                  label="Open Tasks"
                  value={
                    data.tasks.byStatus.todo +
                    data.tasks.byStatus.in_progress +
                    data.tasks.byStatus.review
                  }
                  hint={`${data.tasks.total} total tasks`}
                  icon={CheckSquare}
                />

                <StatCard
                  label="Overdue Tasks"
                  value={data.tasks.overdue}
                  hint="Past due date"
                  icon={AlertTriangle}
                />

                {hasRole("admin", "manager") ? (
                  <StatCard
                    label="Team Members"
                    value={data.users ?? 0}
                    icon={UsersIcon}
                  />
                ) : (
                  <StatCard
                    label="My Tasks"
                    value={data.tasks.mine}
                    hint="Assigned to you"
                    icon={UsersIcon}
                  />
                )}
              </>
            )}
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Completion Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>
                    Completion Trend
                  </CardTitle>

                  <p className="mt-1 text-sm text-slate-500">
                    Tasks completed over the last 7 days
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : data.completionTrend.every(
                    (item) => item.completed === 0
                  ) ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="No completed tasks yet"
                    description="Completed tasks will appear here."
                    className="border-0 bg-transparent py-8"
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={data.completionTrend}
                      >
                        <defs>
                          <linearGradient
                            id="fillCompleted"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity={0.25}
                            />

                            <stop
                              offset="100%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#e2e8f0"
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="date"
                          tickFormatter={(v) => v.slice(5)}
                          tick={{
                            fill: "#64748b",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          tick={{
                            fill: "#64748b",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={false}
                          width={28}
                        />

                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border:
                              "1px solid #e2e8f0",
                            fontSize: 12,
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fill="url(#fillCompleted)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Status */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>
                    Tasks by Status
                  </CardTitle>

                  <p className="mt-1 text-sm text-slate-500">
                    Current distribution
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : totalForPie === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No tasks available"
                    description="Create tasks to see analytics."
                    className="border-0 bg-transparent py-8"
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.key}
                              fill={
                                STATUS_COLORS_HEX[
                                  entry.key
                                ] || "#94a3b8"
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border:
                              "1px solid #e2e8f0",
                            fontSize: 12,
                          }}
                        />

                        <Legend
                          iconType="circle"
                          formatter={(value) => (
                            <span className="text-xs text-slate-600">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <div>
                <CardTitle>
                  Recent Activity
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Latest task updates across projects
                </p>
              </div>

              <Link
                to="/tasks"
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                View all

                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-5">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-12 w-full"
                    />
                  ))}
                </div>
              ) : data.recentTasks.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No recent activity"
                  description="Task updates will appear here."
                  className="border-0 bg-transparent"
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {data.recentTasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{
                          background:
                            task.project?.color ||
                            "#3b82f6",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {task.title}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {task.project?.name} · updated{" "}
                          {fmtRelative(
                            task.updatedAt
                          )}
                        </p>
                      </div>

                      <PriorityPill
                        priority={task.priority}
                      />

                      <StatusPill
                        status={task.status}
                      />

                      {task.assignee ? (
                        <Avatar
                          name={task.assignee.name}
                          src={
                            task.assignee.avatarUrl
                          }
                          size="sm"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full border border-dashed border-slate-300" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}