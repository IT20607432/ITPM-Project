import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const Index = () => {
  const session: any = useSessionContext();
  const router = useRouter();

  const getUserInfo = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user_info/${session.userId}`
    );
    if (res.status === 200) return res.json();
  };

  const handleRoleRouting = (role) => {
    switch (role) {
      // admin
      case 1:
        router.push("/inquires");
        break;
      // doc
      case 2:
        router.push("/on_boarding/doc");
        break;
      //  mid_wife
      case 3:
        router.push("/on_boarding/mid_wife");
        break;
      // pg_woman
      case 4:
        router.push("/on_boarding/pg_woman");
        break;
      // donor
      case 5:
        router.push("/on_boarding/donor");
        break;
      case 6:
        router.push("/inquires");
        break;
      default:
        router.push("/inquires");
        break;
    }
  };

  useEffect(() => {
    (async () => {
      const userInfo = await getUserInfo();
      handleRoleRouting(userInfo.role);
    })();
  }, []);

  return <div>Authenticating...</div>;
};

export default function Home(props) {
  return (
    <SessionReact.SessionAuth>
      <Index />
    </SessionReact.SessionAuth>
  );
}
