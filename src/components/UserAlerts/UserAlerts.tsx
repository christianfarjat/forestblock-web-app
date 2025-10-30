import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const UserAlerts: React.FC = () => {
  const { user } = useAuth();
  const isProfileEmpty = Object.values(user?.profile || {}).every((v) => !v);

  return (
    <>
      {isProfileEmpty && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-md mb-4">
          <p>Completa tu perfil para comenzar.</p>
          <Link href="/profile">
            <button className="mt-2 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition">
              Completar Perfil
            </button>
          </Link>
        </div>
      )}

      {!user?.manglaiCompanyId && (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-md mb-6">
          <p>
            ¿Aún no calculaste tu huella de carbono con nuestros consultores?
          </p>
          <Link href="/calculate/consultancy">
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Contratar Consultoría
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default UserAlerts;
