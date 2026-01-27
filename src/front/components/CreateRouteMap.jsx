import { useState } from "react";
import '../styles/stepper.css'

const WORK_STAGES = [
    { value: "initial_contact", label: "Toma de contacto inicial" },
    { value: "hr_interview", label: "Entrevista RH" },
    { value: "technical_test", label: "Prueba técnica" },
    { value: "technical_interview", label: "Entrevista técnica" },
    { value: "onsite_technical_test", label: "Prueba técnica presencial" },
    { value: "practical_test", label: "Prueba práctica" },
    { value: "evaluation", label: "Evaluación" },
    { value: "results_review", label: "Revisión de resultados" },
    { value: "final_interview", label: "Entrevista final" },
    { value: "internal_validation", label: "Validación interna" },
    { value: "offer", label: "Oferta" },
    { value: "decision", label: "Decisión" },
    { value: "process_closure", label: "Cierre del proceso" }
];

const Stepper = () => {
    const [selectedStage, setSelectedStage] = useState(WORK_STAGES[0].value);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [stages, setStages] = useState([]); // listado de etapas añadidas
    const [loading, setLoading] = useState(false);

    const handleAddStage = () => {
        setLoading(true);
        setStages(prev => [...prev, WORK_STAGES.find(s => s.value === selectedStage).label]);
        setLoading(false);
    };

    return (
        <div className="stages_container">
            <div className="header">
                <h2>Tu proceso</h2>
                <button
                    onClick={() => setIsSelectorOpen(prev => !prev)}
                    className="modify_route"
                >
                    {isSelectorOpen ? "Cerrar selector" : "Modificar ruta"}
                </button>
            </div>

            {isSelectorOpen && (
                <div className="selector_container">
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                    >
                        {WORK_STAGES.map(stage => (
                            <option key={stage.value} value={stage.value}>
                                {stage.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddStage} className="add_stage_btn" disabled={loading}>
                        {loading ? "Añadiendo..." : "Añadir etapa"}
                    </button>
                </div>
            )}

            {stages.length === 0 ? (
                <h4>No tienes un proceso creado</h4>
            ) : (
                <div className="stepper">
                    {stages.map((label, index) => {
                        const isLast = index === stages.length - 1;
                        return (
                            <div
                                key={index}
                                className={`stage ${!isLast ? "connected" : ""} completed`}
                            >
                                <div className="step">{index + 1}</div>
                                <p>{label}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Stepper;