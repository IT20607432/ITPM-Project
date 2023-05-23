import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import Router from "next/router";

export let frontendConfig = () => {
  return {
    appInfo,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
      EmailPasswordReact.init({
        onHandleEvent: async (context) => {
          console.log("handleEvents");
          if (context.action === "SESSION_ALREADY_EXISTS") {
            // TODO:
          } else {
            if (context.action === "SUCCESS") {
              if (context.isNewUser) {
                console.log("sign-up");
                await Router.push("/on_boarding");
              } else {
                console.log("sign-in");
                await Router.push("/");
              }
            }
          }
        },
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "role",
                label: "Role",
                placeholder: "doc | mid_wife | pg_woman | donor | general",
              },
            ],
          },
        },

        getRedirectionURL: async (context) => {
          console.log("redirect url");
          if (context.action === "SUCCESS") {
            if (context.redirectToPath !== undefined) {
              // we are navigating back to where the user was before they authenticated
              return context.redirectToPath;
            }
            if (context.isNewUser) {
              console.log("sign-up");
              return "/on_boarding";
            } else {
              console.log("sign-in");
              return "/";
            }
          }
          return undefined;
        },
      }),
      SessionReact.init(),
    ],
    // this is so that the SDK uses the next router for navigation
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};

export const recipeDetails = {
  docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI];
