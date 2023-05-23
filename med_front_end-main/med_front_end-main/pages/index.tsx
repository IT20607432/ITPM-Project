import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const ProtectedPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Do you want to take a survey ?</h1>
      <button onClick={() => router.push("/on_boarding")}>Yes</button>
      <button onClick={() => router.push("/inquires")}>No</button>
    </div>
  );
};

export default function Index(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
