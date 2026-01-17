import { useState } from "react"

function MenuButttons({ options }) {
    const [active, setActive] = useState(options[0]);

    return (
        <div className="menu_options">
            {options.map(option => (
                <button
                    key={option}
                    className={active === option ? "active" : ""}
                    onClick={() => setActive(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default MenuButttons