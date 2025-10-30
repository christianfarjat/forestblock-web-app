import { FaSignOutAlt } from "react-icons/fa";
import { LogoutButtonProps } from "./types";

const LogoutButton: React.FC<LogoutButtonProps> = ({
  isAuthenticated,
  logout,
}) => {
  if (!isAuthenticated) return null;

  return (
    <button
      className="bg-none text-[#ecf0f1]/80 border-none cursor-pointer text-lg flex items-center gap-2 px-2 py-2 rounded transition-transform ease-in-out duration-200 hover:text-[#e74c3c] hover:bg-white/10 hover:translate-x-1"
      onClick={logout}
    >
      <FaSignOutAlt size={20} />
      <span>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;
