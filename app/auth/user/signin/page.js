import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInPage from "./signInPage";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect to home if already signed in
    return redirect("/");
  }

  return <SignInPage />;
}
