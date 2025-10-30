"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axios/axiosInstance";

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    dni: user?.profile?.dni || "",
    address: user?.profile?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.put("/users/profile", formData);
      setUser({ ...user, profile: response.data.profile });
      localStorage.setItem(
        "forestblockUser",
        JSON.stringify({ ...user, profile: response.data.profile })
      );

      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("No se pudo actualizar el perfil. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-7xl mx-auto">
      <h2 className="font-aeonik font-medium text-[23px] text-forestGreen mb-8">
        Información de perfil
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <form className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
        {[
          {
            label: "Nombre",
            type: "text",
            name: "firstName",
            placeholder: "Ingresa tu nombre",
            value: formData.firstName,
          },
          {
            label: "Apellido",
            type: "text",
            name: "lastName",
            placeholder: "Ingresa tu apellido",
            value: formData.lastName,
          },
          {
            label: "Email",
            type: "email",
            name: "email",
            value: formData.email,
            disabled: true,
          },
          {
            label: "Teléfono",
            type: "tel",
            name: "phone",
            placeholder: "Ingresa tu número de teléfono",
            value: formData.phone,
          },
          {
            label: "DNI",
            type: "text",
            name: "dni",
            placeholder: "Ingresa tu número de documento",
            value: formData.dni,
          },
          {
            label: "Domicilio",
            type: "text",
            name: "address",
            placeholder: "Ingresa domicilio",
            value: formData.address,
          },
        ].map(({ label, ...inputProps }, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              className="w-full border p-2 rounded-lg"
              onChange={handleChange}
              {...inputProps}
            />
          </div>
        ))}

        <div className="sm:col-span-3 flex justify-center sm:justify-end mt-4">
          <button
            type="button"
            className="bg-forestGreen hover:bg-forestGreen/90 text-white px-6 py-2 rounded-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar información"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
