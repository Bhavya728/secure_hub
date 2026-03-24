export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back 👋
          </h1>
          <p className="text-lg opacity-80">
            Secure authentication system with modern UI
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}