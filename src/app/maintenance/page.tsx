"use client";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">&#128274;</div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          Assessment Tool Unavailable
        </h1>
        <p className="text-sm text-slate-500">
          The SFMA clinical assessment tool is currently offline. Please contact
          your Spark administrator for access.
        </p>
      </div>
    </div>
  );
}
