export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center text-white p-10">
        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Auth System 🚀
          </h1>

          <p className="text-lg opacity-90">
            Secure authentication with modern UI & best practices.
          </p>

          <div className="space-y-2 text-sm opacity-80">
            <p>✔ Email Verification</p>
            <p>✔ JWT + Refresh Tokens</p>
            <p>✔ Role-Based Access</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}