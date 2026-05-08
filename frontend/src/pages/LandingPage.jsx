export default function TaskifyLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-7 h-7 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Taskify
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-md text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Built for Teams
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 py-20 md:py-32">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Smart Team Collaboration Platform
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Manage Your
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Projects, Tasks & Team
            </span>
            Efficiently
          </h2>

          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Organize projects, assign tasks, collaborate with your team, and track progress effectively — all in one modern productivity platform.
          </p>

          <div className="flex items-center justify-center">
            <a
              href="/login"
              className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/40 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span className="relative">Get Started</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                className="w-6 h-6 relative group-hover:translate-x-1 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-slate-300 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">✔</span>
              Smart Project Management
            </div>

            <div className="flex items-center gap-2">
              <span className="text-purple-400">✔</span>
              Team Collaboration
            </div>

            <div className="flex items-center gap-2">
              <span className="text-orange-400">✔</span>
              Productivity Tracking
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-6">
              📁
            </div>

            <h3 className="text-2xl font-bold mb-4">Project Management</h3>

            <p className="text-slate-300 leading-relaxed">
              Create and manage multiple projects with organized workflows and better team collaboration.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mb-6">
              ✅
            </div>

            <h3 className="text-2xl font-bold mb-4">Task Tracking</h3>

            <p className="text-slate-300 leading-relaxed">
              Assign tasks, update statuses, monitor deadlines, and improve overall productivity.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center mb-6">
              👥
            </div>

            <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>

            <p className="text-slate-300 leading-relaxed">
              Work seamlessly with your team members and keep everyone aligned on progress.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-400">
        © 2026 Taskify. All rights reserved.
      </footer>
    </div>
  );
}
