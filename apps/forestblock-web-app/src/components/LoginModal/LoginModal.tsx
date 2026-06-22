import React, { useEffect, useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export const LoginModal: React.FC = () => {
  const {
    formState,
    handleInputChange,
    handleSendOTP,
    handleVerifyOTP,
    otpSent,
    error,
    setError,
    isLoading,
  } = useLogin();

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const { isAuthenticated, redirectUrl, setRedirectUrl } = useAuth();
  const { closeModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("unhandledrejection", e => {
      console.log("🔴 unhandledrejection:", e.reason);
    });
    return () => {
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        router.push(redirectUrl);
        setRedirectUrl('');
      }
      closeModal();
    }
  }, [isAuthenticated, redirectUrl, closeModal, router, setRedirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent && !captchaToken) {
      setError("Por favor, confirmá que no sos un robot");
      return;
    }

    try {
      if (!otpSent) {
        await handleSendOTP(captchaToken);
      } else {
        await handleVerifyOTP(e);
      }
    } catch (err) {
      console.error("❌ Error en handleSend/VerifyOTP:", err);
      setError(err instanceof Error ? err.message : "Error enviando/verificando OTP");
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <h2 className="mb-4 text-lg font-aeonik">
          Ingresa a <span className="font-bold text-forestGreen">Forestblock</span>
        </h2>
        <Image
          src="/images/logo_oscuro.svg"
          width={50}
          height={50}
          alt="Forestblock Logo"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="w-full">
        {!otpSent ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="self-start font-neueMontreal text-[#767676] px-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleInputChange}
              placeholder="you@email.com"
              required
              className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-mintGreen font-neueMontreal"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <label htmlFor="email" className="font-neueMontreal text-[#767676] px-2 text-center">
              Te enviamos un código a el email que ingresaste para verificar tu identidad
            </label>
            <input
              type="text"
              name="otp"
              value={formState.otp}
              onChange={handleInputChange}
              placeholder="Ingresar código"
              required
              className="w-full rounded-full border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-mintGreen"
            />
          </div>
        )}

        {!otpSent && (
          <div className="flex justify-center my-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={token => {
                setCaptchaToken(token || "");
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full rounded-full bg-mintGreen py-4 text-forestGreen font-medium font-aeonik ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading
            ? otpSent
              ? 'Verificando...'
              : 'Enviando...'
            : otpSent
            ? 'Verificar'
            : 'Continuar con email'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-500">
        <a href="#" className="hover:underline">
          Privacidad
        </a>{' '}
        ·{' '}
        <a href="#" className="hover:underline">
          Términos
        </a>
      </div>
    </div>
  );
};
