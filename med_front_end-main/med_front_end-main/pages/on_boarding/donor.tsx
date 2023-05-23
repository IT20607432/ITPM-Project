import { useEffect } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const ProtectedPage = () => {
  const session = useSessionContext();
  const postData = {
    session,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  const get_user_info = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/update_info`,
      options
    );
  };

  useEffect(() => {
    get_user_info();
  }, []);

  return <div>Donor</div>;
};

export default function Donor(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
