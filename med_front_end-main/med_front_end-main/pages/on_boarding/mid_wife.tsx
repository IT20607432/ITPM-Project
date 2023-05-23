import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const ProtectedPage = () => {
  return <div>MidWife</div>;
};

export default function MidWife(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
