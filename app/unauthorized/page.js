import Link from "next/link";
export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-600">
        Your account is not authorized to access this app. Please{" "}
        <Link href="/auth/user/signup">Sign up</Link>
      </p>
    </div>
  );
}
