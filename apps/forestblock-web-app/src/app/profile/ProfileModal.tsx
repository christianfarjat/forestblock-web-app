import { Modal } from "../../components/Modal/Modal";
import { useModal } from "@/context/ModalContext";

interface ProfileFormProps {
  name?: string;
  bio?: string;
  onSave: () => void;
}

const ProfileModal: React.FC<ProfileFormProps> = ({ name, bio, onSave }) => {
  const { isOpen, closeModal } = useModal();
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Información de perfil
      </h2>
      <form className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Nombre visible
          </span>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            defaultValue={name}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Acerca de</span>
          <textarea
            className="w-full border p-2 rounded-lg"
            defaultValue={bio}
          />
        </label>
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
          onClick={onSave}
        >
          Guardar cambios
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
