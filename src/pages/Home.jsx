import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const [facts, setFacts] = useState([]);
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progressOn, setProgressOn] = useState(false);

  const cycleRef = useRef(null);
  const fadeRef = useRef(null);

  // Cargar facts (una sola vez) con cancelación segura
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/data/universe-facts.json", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Error to load JSON data");
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setFacts(data);
        }
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    })();
    return () => ac.abort();
  }, []);

  // Parámetros de animación/tiempos
  const DELAY = 6000; // tiempo visible de cada fact
  const FADE = 300; // duración del fade out/in

  // Programar rotación con pausa en pestaña oculta
  useEffect(() => {
    if (!facts.length) return;

    const schedule = () => {
      clearTimeout(cycleRef.current);
      clearTimeout(fadeRef.current);

      if (paused || document.hidden) return; // si está pausado, no agendamos

      // reinicia la barra de progreso
      setProgressOn(false);
      // activa en el próximo frame para que la transición corra completa
      requestAnimationFrame(() => setProgressOn(true));

      cycleRef.current = setTimeout(() => {
        // fade out
        setShow(false);
        fadeRef.current = setTimeout(() => {
          // cambiar índice y hacer fade in
          setIdx((i) => (i + 1) % facts.length);
          setShow(true);
          schedule(); // encadenar siguiente ciclo
        }, FADE);
      }, DELAY);
    };

    // Visibilidad del documento
    const onVisibility = () => {
      if (document.hidden) {
        clearTimeout(cycleRef.current);
        clearTimeout(fadeRef.current);
      } else {
        schedule();
      }
    };

    schedule();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(cycleRef.current);
      clearTimeout(fadeRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [facts, paused]);

  const current = facts[idx]?.fact ?? "";

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-neutral-950 text-neutral-100">
        {/* Cabecera */}
        <section className="max-w-6xl mx-auto px-4 pt-10">
          <h1 className="font-orbitron text-center font-semibold text-4xl md:text-5xl tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400">
              Welcome to Night Nebular
            </span>
          </h1>
          <p className="text-center text-lg md:text-xl mt-4 text-neutral-300">
            Explore the universe with official NASA images
          </p>
        </section>

        {/* Hero con imagen de fondo y capa estética */}
        <section
          className="relative mt-8 h-[28rem] md:h-[34rem] w-full overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0 bg-[url(/img/universe_bgfacts.webp)] bg-cover bg-center bg-no-repeat bg-fixed" />

          {/* Vignette + degradado para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
          </div>

          {/* Contenido centrado: tarjeta de vidrio (glassmorphism) */}
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div
              className={[
                "max-w-3xl w-full",
                "rounded-2xl border border-white/10",
                "bg-white/5 backdrop-blur-md",
                "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]",
                "ring-1 ring-white/10",
                "px-6 py-6 md:px-10 md:py-8",
              ].join(" ")}
              aria-live="polite"
            >
              {/* Etiqueta/chip superior */}
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-200/80">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                Cosmic Fact #{idx + 1}/{facts.length || 1}
              </div>

              {/* Texto con fade/slide sutil */}
              <p
                key={idx} // fuerza reinicio de transición en cada fact
                className={[
                  "text-center text-xl md:text-2xl leading-relaxed",
                  "text-neutral-50 drop-shadow",
                  "transition opacity-0 translate-y-1",
                  show
                    ? "opacity-100 translate-y-0 duration-300 ease-out"
                    : "opacity-0 duration-200 ease-in",
                ].join(" ")}
                style={{ willChange: "opacity, transform" }}
              >
                {current}
              </p>

              {/* Barra de progreso (reinicia cada ciclo) */}
              <div className="mt-6 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  key={`bar-${idx}-${paused}`} // reinicia cuando cambia idx o pausa
                  className={[
                    "h-full bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400",
                    "transition-[width] ease-linear",
                    paused ? "w-0" : progressOn ? "w-full" : "w-0",
                    // duración igual al DELAY
                    `duration-[${DELAY}ms]`,
                  ].join(" ")}
                />
              </div>

              {/* Controles minimalistas */}
              <div className="mt-5 flex items-center justify-between text-sm text-neutral-300">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition"
                    onClick={() => {
                      setShow(false);
                      setTimeout(() => {
                        setIdx((i) => (i - 1 + facts.length) % facts.length);
                        setShow(true);
                      }, FADE);
                    }}
                    aria-label="Previous fact"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    className="rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition"
                    onClick={() => {
                      setShow(false);
                      setTimeout(() => {
                        setIdx((i) => (i + 1) % facts.length);
                        setShow(true);
                      }, FADE);
                    }}
                    aria-label="Next fact"
                  >
                    Next →
                  </button>
                </div>

                <button
                  type="button"
                  className={[
                    "rounded-full px-3 py-1.5",
                    "bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition",
                  ].join(" ")}
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  aria-label={paused ? "Resume rotation" : "Pause rotation"}
                >
                  {paused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>
          </div>

          {/* Sutileza visual extra (estrellas finas en la parte superior) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18)_0%,transparent_60%)] opacity-30" />
        </section>

        {/* Footer mini */}
        <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-sm text-neutral-400">
          Images & data courtesy of NASA · Night Nebular
        </footer>
      </main>
    </>
  );
}

export default Home;
// import { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";

// function Home() {

//   const [facts, setFacts] = useState([]);

//   const loadFacts = async () => {
//     try {
//       const response = await fetch("/data/universe-facts.json");
//       if (!response.ok) throw new Error("Error to load JSON data");
//       const data = await response.json();
//       setFacts(data);
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     loadFacts();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="my-10">
//         <h1 className="font-orbitron text-center font-semibold text-4xl">
//           Welcome to Night Nebular
//         </h1>
//         <h2 className="text-center text-2xl mt-5">
//           Explore the universe with official NASA images
//         </h2>

//         <div className="bg-[url(/img/universe_bgfacts.webp)] w-full h-96 bg-cover bg-no-repeat filter brightness-50"></div>

//         {/* <div>
//           {facts.map((e) => (
//             <p key={e.id}>{e.fact}</p>
//           ))}
//         </div> */}
//       </div>
//     </>
//   );
// }

// export default Home;
