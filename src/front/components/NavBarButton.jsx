import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function NavBarButton({ icon, label, to }) {
    return (
        <Link to={to} className="nav_bar_button">

            <FontAwesomeIcon className="icon" icon={icon} />
            <span>{label}</span>

        </Link>
    );

    return (
        <button type="button" className="nav_bar_button">
            <FontAwesomeIcon className="icon" icon={icon} />
            <span>{label}</span>
        </button>
    );
}
export default NavBarButton;
