import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './SideBar';
import { Link, Outlet } from 'react-router-dom';
import "../styles/app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import Registration from './RegisterPage.jsx';
import LoadingScreen from "../components/LoadingScreen";

export default function App() {
    const { token, user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!token) {
        return <Registration />;
    }

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="main_container">
            <div className="display_component">
                <Sidebar />
                <div className="main_content">
                    <header className="header_bar">
                        <FontAwesomeIcon className="notification_icon" icon={faBell} />
                        <div className="user_data">
                            <div className="user_personal_information">
                                <h3>Hello, {user.username}</h3>
                                <p>{user.email}</p>
                            </div>
                            <Link to="/perfil">
                                <div className="user_picture"></div>
                            </Link>
                        </div>
                    </header>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
