import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../hooks/UserContextProvier.jsx";
import CVPreview from "./CVPreview.jsx";
import CVEditor from "./CVEditor.jsx";
import { createEmptyCV, cloneCV } from "./utils/cvHelpers.js";
import "../../styles/CVAdministrator.css";
import ModalAgregarCV from "./ModalAgregarCV.jsx";

const CVAdministrator = () => {
    const { token } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cvList, setCvList] = useState([]);
    const [selectedCVId, setSelectedCVId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAgregarModal, setShowAgregarModal] = useState(false);

    useEffect(() => {
        if (token) loadCVList();
    }, [token]);

    const normalizeCV = (datos) => ({
        ...datos,
        experiencia: datos.experiencia || [],
        educacion: datos.educacion || [],
        habilidades: datos.habilidades || [],
        idiomas: datos.idiomas || []
    });

    const loadCVList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/cv`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && Array.isArray(data.cvs)) {
                setCvList(data.cvs);

                if (data.cvs.length > 0) {
                    setSelectedCVId(data.cvs[0].id);
                    setFormData(normalizeCV(data.cvs[0].datos));
                }
            }
        } catch (err) {
            console.error("Error al cargar CVs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const selectCV = (id) => {
        const cv = cvList.find((c) => c.id === id);
        if (cv) {
            setSelectedCVId(id);
            setFormData(normalizeCV(cv.datos));
            setIsEditing(false);
        }
    };

    const updateCurrentCV = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);

        setCvList((prev) =>
            prev.map((cv) =>
                cv.id === selectedCVId ? { ...cv, datos: updated } : cv
            )
        );
    };

    const createNewCV = () => {
        const nuevo = createEmptyCV();
        setCvList((prev) => [...prev, nuevo]);
        setSelectedCVId(null);
        setFormData(normalizeCV(nuevo.datos));
        setIsEditing(true);
    };

    const saveCV = async () => {
        setSaving(true);

        try {
            if (!selectedCVId) {
                const res = await fetch(`${backendUrl}/api/cv`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (data.success) {
                    setCvList((prev) => [...prev, data.cv]);
                    setSelectedCVId(data.cv.id);
                    setFormData(normalizeCV(data.cv.datos));
                    setIsEditing(false);
                }

                setSaving(false);
                return;
            }

            const res = await fetch(`${backendUrl}/api/cv/${selectedCVId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setCvList((prev) =>
                    prev.map((cv) => (cv.id === selectedCVId ? data.cv : cv))
                );
                setFormData(normalizeCV(data.cv.datos));
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Error al guardar CV:", err);
        } finally {
            setSaving(false);
        }
    };

    const deleteCV = async (cvId) => {
        if (!confirm("¿Seguro que deseas eliminar este CV?")) return;

        try {
            await fetch(`${backendUrl}/api/cv/${cvId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedList = cvList.filter((cv) => cv.id !== cvId);
            setCvList(updatedList);

            if (updatedList.length > 0) {
                setSelectedCVId(updatedList[0].id);
                setFormData(normalizeCV(updatedList[0].datos));
            } else {
                setSelectedCVId(null);
                setFormData(null);
            }
        } catch (err) {
            console.error("Error al eliminar CV:", err);
        }
    };

    const handleView = (id) => {
        selectCV(id);
        setIsEditing(false);
    };

    const handleEdit = (id) => {
        selectCV(id);
        setIsEditing(true);
    };

    const handleSelectForAdd = (id) => {
        const original = cvList.find((cv) => cv.id === id);
        if (!original) return;

        const copia = normalizeCV(original.datos);
        copia.titulo = "";

        setFormData(copia);
        setSelectedCVId(null);
        setIsEditing(true);
        setShowAgregarModal(false);
    };

    const handleAddFrom = (id) => {
        const original = cvList.find((cv) => cv.id === id);
        if (!original) return;

        const copia = cloneCV(original);
        copia.datos = normalizeCV(copia.datos);
        copia.datos.titulo = "";

        setCvList((prev) => [...prev, copia]);
        setSelectedCVId(null);
        setFormData(copia.datos);
        setIsEditing(true);
    };

    return (
        <div className="cv-admin-container">

            {showAgregarModal && (
                <ModalAgregarCV
                    cvList={cvList}
                    onSelect={handleSelectForAdd}
                    onClose={() => setShowAgregarModal(false)}
                />
            )}

            <div className="cv-topbar">
                <div className="cv-topbar-title">Administrador de CVs</div>

                <div className="cv-topbar-actions">
                    <button onClick={createNewCV}>+ Nuevo CV</button>
                    <button onClick={() => setShowAgregarModal(true)}>Agregar</button>
                </div>
            </div>

            <table className="cv-table">
                <thead>
                    <tr>
                        <th>Nombre del CV</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {cvList.map((cv) => (
                        <tr key={cv.id}>
                            <td>{cv.datos.titulo || "Sin título"}</td>
                            <td>{new Date(cv.created_at).toLocaleDateString()}</td>

                            <td>
                                <div className="cv-actions-row">
                                    <button onClick={() => handleView(cv.id)}>👁️</button>
                                    <button onClick={() => handleEdit(cv.id)}>🖉</button>
                                    <button onClick={() => handleAddFrom(cv.id)}>📄</button>
                                    <button onClick={() => deleteCV(cv.id)}>🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <main className="cv-main">
                {isLoading ? (
                    <p>Cargando...</p>
                ) : isEditing ? (
                    <CVEditor
                        formData={formData}
                        updateCurrentCV={updateCurrentCV}
                        setIsEditing={setIsEditing}
                        saveCV={saveCV}
                        saving={saving}
                    />
                ) : formData ? (
                    <CVPreview
                        formData={formData}
                        setIsEditing={setIsEditing}
                        deleteCV={deleteCV}
                        cloneCV={cloneCV}
                    />
                ) : (
                    <p>No hay CV seleccionado</p>
                )}
            </main>
        </div>
    );
};

export default CVAdministrator;
