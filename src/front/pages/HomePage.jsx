import { faBell, faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/HomeStatisticsCard";
import GraficoDinamico from "../components/GraphicComponent";
import Calendar from "../components/Calendar";
import '../styles/homeWidgets.css'
import MenuButttons from "../components/MenuButtons";


function HomePage() {
	const options = ['Mes', 'Semana', 'Año']
	return (
		<div className="home_display">
			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={10} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={5} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={0} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={0} date={'12/01/2026'} icon={faCircleXmark} />
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
