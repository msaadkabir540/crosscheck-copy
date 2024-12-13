export const hasSingleWorkspaceWithNoPlan = (userDetails) => {
  if (!userDetails || !userDetails.workspaces || userDetails.workspaces.length !== 1) {
    return false;
  }

  const workspace = userDetails.workspaces[0];

  return workspace.plan === 'No Plan';
};
