const SkeletonLoader = () => {
  return (
    <>
      <style jsx>{`
        @keyframes pulse-custom {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse-custom {
          animation: pulse-custom 2s ease-in-out infinite;
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl overflow-hidden border animate-pulse-custom h-[300px]"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0" />

            {/* Contenido superpuesto similar a OverlayContent */}
            <div className="relative z-10 h-full flex flex-col justify-between p-4">
              {/* Fila superior: vintages y bandera */}
              <div className="flex justify-end gap-2 items-center">
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-6 bg-gray-200 rounded-full"></div>
              </div>

              <div className="mt-20">
                {/* categoría y nombre, desplazada hacia abajo */}
                <div className="flex flex-col gap-2">
                  <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Fila inferior: precio y SDGs */}
              <div className="flex justify-between items-center">
                <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
