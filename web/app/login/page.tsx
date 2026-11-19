import { redirect } from "next/navigation";

/** No shared login form — role doors live on `/enter`. */
export default function LoginIndexPage() {
  redirect("/enter");
}
