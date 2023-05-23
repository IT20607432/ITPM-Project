const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const UserRoles = require("supertokens-node/recipe/userroles");
const user_roles = require("../models/user_roles");

const initializeSupertokens = () => {
  console.log("supertokens init");
  supertokens.init({
    framework: "express",
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: "https://try.supertokens.com",
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo: {
      // learn more about this on https://supertokens.com/docs/session/appinfo
      appName: "med",
      apiDomain: "http://localhost:5500",
      websiteDomain: "http://localhost:3000",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init({
        signUpFeature: {
          formFields: [{ id: "role" }],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error("Should never come here");
                }
                // First we call the original implementation of signUpPOST.
                let response = await originalImplementation.signUpPOST(input);
                console.log(response);
                // Post sign up response, we check if it was successful
                if (response.status === "OK") {
                  let { id, email } = response.user;

                  // // These are the input form fields values that the user used while signing up
                  let formFields = input.formFields;
                  role = formFields.find((item) => item.id === "role").value;
                  // TODO: post sign up logic
                  let role_id = null;
                  switch (role) {
                    case "admin":
                      role_id = 1;
                      break;
                    case "doc":
                      role_id = 2;
                      break;
                    case "mid_wife":
                      role_id = 3;
                      break;
                    case "pg_woman":
                      role_id = 4;
                      break;
                    case "donor":
                      role_id = 5;
                      break;
                    default:
                      role_id = 6;
                      break;
                  }

                  const user_res = await user_roles.insertMany([
                    { user_id: id, role: role_id, user_email: email },
                  ]);
                  console.log(user_res);
                }
                return response;
              },
            };
          },
        },
      }),
      Session.init(), // initializes session features
    ],
  });

  UserRoles.init();
};

module.exports = initializeSupertokens;
