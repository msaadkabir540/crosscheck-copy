const Permissions = ({ children, allowedRoles, currentRole, accessParticular = false, locked = false }) => {
  return <>{!locked ? allowedRoles?.includes(currentRole) ? children : accessParticular ? children : <></> : <></>}</>;
};

export default Permissions;
