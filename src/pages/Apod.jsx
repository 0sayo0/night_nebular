import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const API = "https://api.nasa.gov/planetary/apod";
const KEY = "QnAB1i668622ct3MMfTwPHNLbnfzeNiKANM8r4UX";

function formatApodPageUrl(dateStr) {
  // date: "YYYY-MM-DD" -> https://apod.nasa.gov/apod/apYYMMDD.html
  const [y, m, d] = dateStr.split("-");
  const yy = y.slice(-2);
  return `https://apod.nasa.gov/apod/ap${yy}${m}${d}.html`;
}

function toEmbeddable(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch")
        return `https://www.youtube.com/embed/${u.searchParams.get("v") || ""}`;
      if (u.pathname.startsWith("/shorts/"))
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      return url;
    }
    if (u.hostname === "youtu.be")
      return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && !isNaN(Number(id)))
        return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

function Apod() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchUsableApod = async () => {
      setLoading(true);
      setErr("");
      const today = new Date();

      // prueba hoy y hasta 3 días hacia atrás si no hay media usable
      for (let i = 0; i < 4; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);

        try {
          const res = await fetch(
            `${API}?api_key=${KEY}&thumbs=true&date=${dateStr}`
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          const hasImage =
            data.media_type === "image" && (data.hdurl || data.url);
          const hasVideo =
            data.media_type === "video" && (data.url || data.thumbnail_url);

          if (hasImage || hasVideo) {
            setApod(data);
            setLoading(false);
            return;
          }

          // guarda al menos algo por si no encontramos usable
          if (i === 0) setApod(data);
        } catch (e) {
          // si falla hoy, intenta siguiente iteración (día anterior)
          if (i === 3) setErr(String(e));
        }
      }
      setLoading(false);
    };

    fetchUsableApod();
  }, []);

  return (
    <>
      <Navbar />
      <div className="my-10" />

      {loading && <p className="text-center">Cargando APOD…</p>}
      {err && <p className="text-center text-red-500">Error: {err}</p>}

      {apod && (
        <>
          <h1 className="font-orbitron text-center font-semibold text-4xl px-4">
            {apod.title}
          </h1>

          {/* IMAGEN */}
          {apod.media_type === "image" && (apod.hdurl || apod.url) && (
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              className="mx-auto mt-6 rounded-lg shadow-lg max-w-[95vw]"
            />
          )}

          {/* VIDEO */}
          {apod.media_type === "video" && (apod.url || apod.thumbnail_url) && (
            <>
              {apod.url ? (
                <div className="mx-auto mt-6 max-w-[960px] aspect-video rounded-lg shadow-lg overflow-hidden">
                  <iframe
                    title={apod.title}
                    src={toEmbeddable(apod.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={apod.thumbnail_url}
                  alt={apod.title}
                  className="mx-auto mt-6 rounded-lg shadow-lg max-w-[95vw]"
                />
              )}
            </>
          )}

          {/* OTRO / SIN URL: LINK A LA PÁGINA */}
          {!apod.url && !apod.hdurl && !apod.thumbnail_url && (
            <div className="mx-auto mt-6 max-w-3xl text-center">
              <div className="rounded-xl border border-white/10 p-6">
                <p className="mb-4 opacity-80">
                  El APOD de este día no provee un archivo embebible desde la
                  API.
                </p>
                <a
                  href={formatApodPageUrl(apod.date)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  Ver en la página oficial de APOD
                </a>
              </div>
            </div>
          )}

          {apod.explanation && (
            <p className="mx-auto mt-6 max-w-3xl text-center opacity-80 px-4">
              {apod.explanation}
            </p>
          )}
        </>
      )}
    </>
  );
}

export default Apod;

// import { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";

// function Apod() {
//   const [dailyPicture, setDailyPicture] = useState([]);

//   const loadPicture = async () => {
//     try {
//       const response = await fetch(
//         "https://api.nasa.gov/planetary/apod?api_key=QnAB1i668622ct3MMfTwPHNLbnfzeNiKANM8r4UX"
//       );
//       if (!response.ok) throw new Error("Error to load image");
//       const data = await response.json();
//       console.log(data);
//       setDailyPicture(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     loadPicture();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="my-10"></div>
//       <h1 className="font-orbitron text-center font-semibold text-4xl">
//         {dailyPicture.title}
//       </h1>

//       <img
//         src={dailyPicture.url}
//         alt={dailyPicture.title}
//         className="mx-auto mt-6 rounded-lg shadow-lg"
//       />

//       <p className="w-[1200px] mx-auto">{dailyPicture.explanation}</p>
//     </>
//   );
// }

// export default Apod;
