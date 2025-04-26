// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignUpPage from "./signUpPage";
// import { redirect } from "next/navigation";

export default async function SignIn() {
  // const session = await getServerSession(authOptions);

  // if (session) {
  //   // Redirect to home if already signed in
  //   return redirect("/");
  //   console
  // }

  return <SignUpPage />;
}
