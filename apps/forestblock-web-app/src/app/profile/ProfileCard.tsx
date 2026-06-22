"use client";

import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axiosInstance from "@/utils/axios/axiosInstance";
import { Modal } from "@/components/Modal/Modal";

const ProfileCard: React.FC = () => {
  const { user, setUser } = useAuth();
  const { openModal, isOpen, closeModal, currentModal } = useModal();

  // Si existe publicName, lo usamos; si no, tomamos firstName
  const [formData, setFormData] = useState({
    publicName: user?.profile?.publicName || user?.profile?.firstName || "",
    bio: user?.profile?.bio || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Filtramos solo los campos modificados
    const updatedFields: Partial<typeof formData> = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (formData[key] !== user?.profile?.[key]) {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setLoading(false);
      setSuccess("No se realizaron cambios.");
      return;
    }

    try {
      const response = await axiosInstance.put("/users/profile", updatedFields);
      setUser({ ...user, profile: response.data.profile });
      localStorage.setItem(
        "forestblockUser",
        JSON.stringify({ ...user, profile: response.data.profile })
      );

      setSuccess("Perfil actualizado correctamente.");
      closeModal();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("No se pudo actualizar el perfil. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative -mt-24 bg-white rounded-full px-10 py-10 md:px-10 md:py-5 mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <div className="rounded-full border-4 border-customGreen overflow-hidden w-[100px] h-[100px] md:w-[150px] md:h-[150px]">
              <Image
                src={user.profile?.profilePicture || "/images/profile.png"}
                alt="Profile picture"
                width={112}
                height={112}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-forestGreen font-aeonik">
                {user.profile?.publicName || ""}
              </h1>
              <span className="inline-block px-3 py-1 mt-1 mb-3 font-aeonik text-[16px] md:text-[18px] font-medium text-forestGreen bg-customGreen rounded-full">
                {user.email}
              </span>
              <p className="text-[12px] md:text-[14px] text-forestGreen max-w-full md:max-w-2xl font-aeonik">
                {user.profile?.bio || "Información de usuario no disponible."}
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal("profile")}
            className="bg-forestGreen border-none cursor-pointer p-2 md:p-3 rounded-full mt-4 md:mt-0"
          >
            <Image
              src="/images/pencil.svg"
              alt="Edit icon"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {isOpen && currentModal === "profile" && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <h2 className="font-aeonik font-medium text-[22px] md:text-[25px] mb-6 text-center">
            Información de perfil
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <form className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="font-neueMontreal font-medium text-[16px] md:text-[18px] text-customGray/70">
                Nombre visible
              </span>
              <input
                type="text"
                name="publicName"
                value={formData.publicName}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg text-[16px] md:text-[18px] font-neueMontreal"
              />
            </label>
            <label className="block">
              <span className="font-neueMontreal font-medium text-[16px] md:text-[18px] text-customGray/70">
                Acerca de
              </span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg text-[16px] md:text-[18px] font-neueMontreal"
              />
            </label>
            <button
              type="button"
              className="bg-[#99EE9F] text-forestGreen font-aeonik font-medium px-4 py-4 rounded-full mt-4 w-full"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ProfileCard;
