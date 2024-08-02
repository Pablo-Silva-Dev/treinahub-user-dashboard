import { Link } from "react-router-dom";
import logo_text from "./logo_with_text_light.svg";

export function ImageCardButton() {
  return (
    <div className="w-full p-4 lg:p-8 rounded-lg bg-gradient-to-r from-primary to-primary-dark ">
      <Link to="/dashboard/meus-trainamentos">
        <img src={logo_text} alt="logo" width={240} />
      </Link>
    </div>
  );
}
