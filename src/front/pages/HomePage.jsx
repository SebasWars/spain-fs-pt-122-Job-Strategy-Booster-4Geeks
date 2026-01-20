import { faBell, faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/HomeStatisticsCard";
import GraficoDinamico from "../components/GraphicComponent";
import Calendar from "../components/Calendar";
import '../styles/homeWidgets.css'
import MenuButttons from "../components/MenuButtons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../hooks/UserContextProvier";


function HomePage() {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const { token } = useContext(UserContext)
	const [count, setCount] = useState(0)
	const [entrevista, setEntrevista] = useState(0)
	const [ofertas, setOfertas] = useState(0)
	const [descartado, setDescartado] = useState(0)


	useEffect(() => {

		axios.get(`${backendUrl}/posts/my-post-count`, {
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => { setCount(res.data) })
	}, [token])


	useEffect(() => {

		axios.get(`${backendUrl}/posts/entrevista`, {
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => { setEntrevista(res.data) })
	}, [token])


	useEffect(() => {

		axios.get(`${backendUrl}/posts/ofertas`, {
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => { setOfertas(res.data) })
	}, [token])

	useEffect(() => {

		axios.get(`${backendUrl}/posts/descartado`, {
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => { setDescartado(res.data) })
	}, [token])
	const options = ['Mes', 'Semana', 'Año']
	return (

		<div className="home_display">
			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={count.count} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={entrevista.entrevista} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={ofertas.ofertas} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={descartado.descartado} date={'12/01/2026'} icon={faCircleXmark} />
			</div>

			<div className="grafica">
				<div className="title">
					<h3>Registro de actividad</h3>
					<MenuButttons options={options} />
				</div>
				<GraficoDinamico />
			</div>
			<div className="calendar">
				<Calendar />
			</div>
			<div className="todo_list">hola</div>
		</div>
	);
}

export default HomePage;
