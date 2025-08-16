// app/index.tsx
import { useAuth } from "@/context/authContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not logged in, send to auth flow
    if (!user) {
      // this runs after root layout mounts (because index is a route inside the Slot)
      router.replace("/Auth/login");
    }
    // if user exists, do nothing — <Slot /> will render the (tabs) group (i.e. the app)
  }, [user]);

  if (!user) {
    // avoid flashing anything while redirecting
    return null;
  }

  return <Slot />; // renders the (tabs) group (e.g. (tabs)/index.tsx becomes '/')
}
