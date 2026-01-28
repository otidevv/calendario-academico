"use client";

import { useState, useRef, useEffect } from "react";

export function MascotVideo() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriedUnmute = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasTriedUnmute.current) return;

    const handleCanPlay = () => {
      if (hasTriedUnmute.current) return;
      hasTriedUnmute.current = true;

      // Establecer tiempo inicial
      video.currentTime = 1;

      // Intentar reproducir con audio
      video.muted = false;
      video.play().then(() => {
        setIsMuted(false);
      }).catch(() => {
        // Si falla, reproducir silenciado
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    // Si el video ya está listo
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 1;
      videoRef.current.play();
      setHasEnded(false);
      setIsPlaying(true);
    }
  };

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-transform cursor-pointer"
        style={{ boxShadow: "0 10px 40px rgba(219, 4, 85, 0.3)" }}
        title="Mostrar mascota"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#db0455"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-out ${
        isMinimized
          ? "bottom-6 right-6 w-20 h-20"
          : "bottom-6 right-6 w-72 md:w-80"
      }`}
    >
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-500 ${
          isMinimized ? "rounded-full" : ""
        }`}
        style={{
          borderColor: "#db0455",
          boxShadow: "0 20px 60px rgba(219, 4, 85, 0.3)"
        }}
      >
        {/* Header con controles */}
        {!isMinimized && (
          <div
            className="flex items-center justify-between px-4 py-2 text-white"
            style={{ backgroundColor: "#db0455" }}
          >
            <span className="text-sm font-bold flex items-center gap-2">
              <img
                src="/img/log/logounamad.png"
                alt="UNAMAD"
                className="w-6 h-6 object-contain"
              />
              Mascota UNAMAD
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={playVideo}
                className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                title="Reproducir"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
              </button>
              <button
                onClick={toggleMute}
                className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                title={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                title="Minimizar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </button>
              <button
                onClick={() => setIsHidden(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                title="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Video */}
        <div
          className={`relative cursor-pointer ${isMinimized ? "w-20 h-20" : ""}`}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <video
            ref={videoRef}
            src="/video/videomascota.mp4"
            muted
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setHasEnded(true);
            }}
            className={`w-full object-cover ${
              isMinimized ? "h-20 rounded-full" : "h-64 md:h-72"
            }`}
          />

          {/* Botón de play cuando el video terminó */}
          {hasEnded && !isMinimized && (
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
              onClick={playVideo}
            >
              <div
                className="bg-white/90 rounded-full p-4 hover:scale-110 transition-transform"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#db0455"
                  viewBox="0 0 24 24"
                  className="w-10 h-10"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Overlay cuando está minimizado */}
          {isMinimized && (
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
