import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

function Navbar() {
  return (
    <>
      <nav className="bg-[#4a47a3] flex flex-row justify-between items-center w-full text-center gap-10 p-4">
        <Link to={"/"} className="flex ml-10 justify-center items-center">
          <img src="logoNN.png" className="w-16" alt="Night Nebular" />
          <p className="font-orbitron font-bold text-xl">Night Nebular</p>
        </Link>
        <ul className="flex flex-row font-semibold text-lg w-full justify-end items-center gap-10 mr-10">
          <li>
            <Link
              to={"/apod"}
              className="inline-block hover:text-emerald-400 transition-all duration-300 hover:scale-110"
            >
              Daily Picture
            </Link>
          </li>
          <li>
            <Link
              to={"/mars"}
              className="inline-block hover:text-emerald-400 transition-all duration-300 hover:scale-110"
            >
              Mars Rover Photos
            </Link>
          </li>
          <li>
            <Link
              to={"/neo"}
              className="inline-block hover:text-emerald-400 transition-all duration-300 hover:scale-110"
            >
              Near Earth Objects
            </Link>
          </li>
          <li>
            <Link
              to={"/search"}
              className="inline-block hover:text-emerald-400 transition-all duration-300 hover:scale-110"
            >
              <div className="flex justify-center items-center gap-1">
                Search <IoSearchSharp size={30} />
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
