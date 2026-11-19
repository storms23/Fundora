import { redirect } from "next/navigation";

/** Kept so older /sponsors links resolve to the public Fundora landing. */
export default function SponsorsRedirect() {
  redirect("/");
}
