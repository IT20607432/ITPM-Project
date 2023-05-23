const UserRoles = require("supertokens-node/recipe/userroles");

const initUserRoles = async () => {
  await UserRoles.createNewRoleOrAddPermissions("admin", [
    "read:all",
    "delete:all",
    "edit:all",
  ]);

  await UserRoles.createNewRoleOrAddPermissions("general", [
    "read:all",
    "delete:self",
    "edit:self",
  ]);

  await UserRoles.createNewRoleOrAddPermissions("pg_woman", [
    "read:all",
    "delete:self",
    "edit:self",
  ]);

  await UserRoles.createNewRoleOrAddPermissions("mid_wife", [
    "read:all",
    "delete:self",
    "edit:self",
  ]);

  await UserRoles.createNewRoleOrAddPermissions("donors", [
    "read:all",
    "delete:self",
    "edit:self",
  ]);

  await UserRoles.createNewRoleOrAddPermissions("doc", [
    "read:all",
    "delete:self",
    "edit:self",
  ]);
};

module.exports = initUserRoles;
