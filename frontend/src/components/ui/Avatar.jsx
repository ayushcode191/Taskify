import { cn } from "../../utils/cn.js";

import { getInitials } from "../../utils/format.js";

const sizes = {
  xs: "h-6 w-6 text-[10px]",

  sm: "h-9 w-9 text-xs",

  md: "h-11 w-11 text-sm",

  lg: "h-14 w-14 text-base",

  xl: "h-28 w-28 text-4xl",
};

const colors = [
  "bg-slate-900",

  "bg-blue-600",

  "bg-cyan-500",

  "bg-emerald-500",

  "bg-violet-600",

  "bg-rose-500",

  "bg-amber-500",

  "bg-teal-500",
];

function pickColor(seed = "") {
  let hash = 0;

  for (
    let i = 0;
    i < seed.length;
    i++
  ) {
    hash =
      (hash * 31 +
        seed.charCodeAt(i)) >>>
      0;
  }

  return colors[
    hash % colors.length
  ];
}

export default function Avatar({
  name = "",
  src,
  size = "md",
  className,
  ring = false,
}) {
  const initials =
    getInitials(name) || "?";

  const color =
    pickColor(name);

  return (
    <span
      title={name}
      className={cn(
        "inline-flex flex-shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-sm",
        sizes[size],
        ring &&
          "ring-2 ring-white",
        !src && color,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function AvatarGroup({
  users = [],
  max = 4,
  size = "sm",
}) {
  const visibleUsers =
    users.slice(0, max);

  const remaining =
    users.length -
    visibleUsers.length;

  return (
    <div className="flex -space-x-3">
      {visibleUsers.map(
        (user) => (
          <Avatar
            key={
              user._id ||
              user.email
            }
            name={user.name}
            src={
              user.avatarUrl
            }
            size={size}
            ring
            className="border border-white"
          />
        )
      )}

      {remaining > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-white bg-slate-200 font-semibold text-slate-700 ring-2 ring-white",
            sizes[size]
          )}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}