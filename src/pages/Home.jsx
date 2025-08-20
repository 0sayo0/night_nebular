import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const [facts, setFacts] = useState([]);

  const loadFacts = async () => {
    try {
      const response = await fetch("/data/universe-facts.json");
      if (!response.ok) throw new Error("Error to load JSON data");
      const data = await response.json();
      setFacts(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFacts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="my-10">
        <h1 className="font-orbitron text-center font-semibold text-4xl">
          Welcome to Night Nebular
        </h1>
        <h2 className="text-center text-2xl mt-5">
          Explore the universe with official NASA images
        </h2>

        <div className="bg-[url(/img/universe_bgfacts.webp)] w-full h-96 bg-cover bg-no-repeat filter brightness-50">
          {
            <div>
              {facts.map((e) => (
                <p key={e.id}>{e.fact}</p>
              ))}
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default Home;
