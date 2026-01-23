import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../hooks/UserContextProvier.jsx";
import {
    User, Briefcase, GraduationCap, Award, Trash2, Edit2, Save, X, Plus,
    Download, Upload, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import '../styles/CVAdministrator.css';

const CVAdministrator = () => {
    const { token } = useContext(UserContext);


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    



    const [cvExists, setCvExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [formData, setFormData] = useState({
        personalInfo: { nombre: '', email: '', telefono: '', ubicacion: '', linkedin: '', github: '' },
        resumen: '',
        experiencia: [],
        educacion: [],
        habilidades: [],
        idiomas: []
    });

    useEffect(() => {
        loadCV();
    }, []);

    const loadCV = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/cv`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                setCvExists(false);
                return;
            }

            const data = await res.json();

            if (!data || !data.datos) {
                setCvExists(false);
                return;
            }

            setFormData(data.datos);
            setCvExists(true);

        } catch (err) {
            console.error("Error cargando CV:", err);
            setCvExists(false);
        }
    };

    const saveCV = async () => {
        if (!formData.personalInfo.nombre || !formData.personalInfo.email || !formData.personalInfo.telefono) {
            alert('Completa: Nombre, Email y Teléfono');
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/cv`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setCvExists(true);
                setIsEditing(false);
                alert("CV guardado correctamente");
            }

        } catch (err) {
            console.error("Error guardando CV:", err);
        }
    };


    const deleteCV = async () => {
        if (!window.confirm("¿Eliminar tu CV?")) return;

        try {
            const res = await fetch(`${backendUrl}/api/cv`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success) {
                setFormData({
                    personalInfo: { nombre: '', email: '', telefono: '', ubicacion: '', linkedin: '', github: '' },
                    resumen: '',
                    experiencia: [],
                    educacion: [],
                    habilidades: [],
                    idiomas: []
                });
                setCvExists(false);
                setIsEditing(false);
                setIsExpanded(false);
                alert("CV eliminado correctamente");
            }

        } catch (err) {
            console.error("Error eliminando CV:", err);
        }
    };


    const downloadPDF = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        const doc = printWindow.document;

        doc.write('<html><head><title>CV - ' + formData.personalInfo.nombre + '</title>');
        doc.write('<style>body{font-family:Arial;padding:40px;line-height:1.6}h1{color:#2563eb;border-bottom:3px solid #2563eb;padding-bottom:10px}h2{color:#1e40af;margin-top:30px;border-bottom:2px solid #e5e7eb;padding-bottom:8px}.section{margin:20px 0}.contact{color:#64748b;margin:10px 0}.item{margin:15px 0}.skill{display:inline-block;background:#e0e7ff;padding:5px 10px;margin:5px;border-radius:4px}</style>');
        doc.write('</head><body>');
        doc.write('<h1>' + formData.personalInfo.nombre + '</h1>');
        doc.write('<div class="contact">' + formData.personalInfo.email + ' | ' + formData.personalInfo.telefono + '</div>');

        if (formData.resumen) doc.write('<p>' + formData.resumen + '</p>');

        if (formData.experiencia.length > 0) {
            doc.write('<h2>Experiencia Laboral</h2>');
            formData.experiencia.forEach(exp => {
                doc.write('<div class="item"><strong>' + exp.puesto + '</strong> - ' + exp.empresa + ' (' + exp.periodo + ')<br>' + (exp.descripcion || '') + '</div>');
            });
        }

        if (formData.educacion.length > 0) {
            doc.write('<h2>Educación</h2>');
            formData.educacion.forEach(edu => {
                doc.write('<div class="item"><strong>' + edu.titulo + '</strong> - ' + edu.institucion + ' (' + edu.periodo + ')</div>');
            });
        }

        if (formData.habilidades.length > 0) {
            doc.write('<h2>Habilidades</h2><div>');
            formData.habilidades.forEach(h => {
                doc.write('<span class="skill">' + h + '</span>');
            });
            doc.write('</div>');
        }

        doc.write('</body></html>');
        doc.close();

        setTimeout(() => printWindow.print(), 250);
    };

    const importCV = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    setFormData(data);
                    alert('📥 CV importado exitosamente');
                } catch {
                    alert('❌ Error: El archivo no es válido');
                }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    };

    const addExperience = () => {
        setFormData({ ...formData, experiencia: [...formData.experiencia, { empresa: '', puesto: '', periodo: '', descripcion: '' }] });
    };

    const updateExperience = (i, field, value) => {
        const exp = [...formData.experiencia];
        exp[i][field] = value;
        setFormData({ ...formData, experiencia: exp });
    };

    const removeExperience = (i) => {
        setFormData({ ...formData, experiencia: formData.experiencia.filter((_, idx) => idx !== i) });
    };

    const addEducation = () => {
        setFormData({ ...formData, educacion: [...formData.educacion, { institucion: '', titulo: '', periodo: '' }] });
    };

    const updateEducation = (i, field, value) => {
        const edu = [...formData.educacion];
        edu[i][field] = value;
        setFormData({ ...formData, educacion: edu });
    };

    const removeEducation = (i) => {
        setFormData({ ...formData, educacion: formData.educacion.filter((_, idx) => idx !== i) });
    };

    const handleSkillsChange = (value) => {
        const skills = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setFormData({ ...formData, habilidades: skills });
    };

    const handleLanguagesChange = (value) => {
        const languages = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setFormData({ ...formData, idiomas: languages });
    };

    return (
        <div className="cv-admin-container">
            <div className="cv-admin-wrapper">
                <div className="cv-admin-header">
                    <div className="cv-admin-header-content">
                        <h1 className="cv-admin-title">
                            <FileText size={28} /> Administrador de CV
                        </h1>
                        <div className="cv-admin-actions">
                            {cvExists && !isEditing && (
                                <>
                                    <button className="btn btn-secondary" onClick={downloadPDF}>
                                        <Download size={18} />Descargar PDF
                                    </button>
                                    <label className="btn btn-secondary btn-file">
                                        <Upload size={18} />Cargar CV
                                        <input type="file" accept=".json" onChange={importCV} className="file-input-hidden" />
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!cvExists && !isEditing ? (
                    <div className="cv-admin-content">
                        <div className="cv-empty-state">
                            <div className="empty-icon">
                                <FileText size={64} />
                            </div>
                            <h2>No tienes un CV registrado</h2>
                            <p>Crea tu currículum vitae o importa uno existente desde tus archivos</p>
                            <div className="cv-empty-actions">
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    <Plus size={20} />Crear nuevo CV
                                </button>
                                <label className="btn btn-outline btn-file">
                                    <Upload size={18} />Importar desde archivo
                                    <input type="file" accept=".json" onChange={importCV} className="file-input-hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                ) : cvExists && !isEditing ? (
                    <div className="cv-card-container">
                        <div className={`cv-card ${isExpanded ? 'expanded' : ''}`}>
                            <div className="cv-card-header" onClick={() => setIsExpanded(!isExpanded)}>
                                <div className="cv-card-title">
                                    <FileText size={24} />
                                    <div>
                                        <h3>{formData.personalInfo.nombre}</h3>
                                        <p>{formData.personalInfo.email}</p>
                                    </div>
                                </div>
                                <div className="cv-card-actions">
                                    {!isExpanded && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                            >
                                                <Edit2 size={16} />Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => { e.stopPropagation(); deleteCV(); }}
                                            >
                                                <Trash2 size={16} />Eliminar
                                            </button>
                                        </>
                                    )}
                                    <button className="btn-icon">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="cv-card-content">
                                    <div className="cv-preview">
                                        <div className="cv-preview-actions-top">
                                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                                <Edit2 size={18} />Editar CV
                                            </button>
                                            <button className="btn btn-danger" onClick={deleteCV}>
                                                <Trash2 size={18} />Eliminar CV
                                            </button>
                                        </div>

                                        <div className="cv-section">
                                            <h3 className="cv-section-title">
                                                <User size={22} />Información Personal
                                            </h3>
                                            <div className="cv-info-grid">
                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Nombre completo</div>
                                                    <div className="cv-info-value">{formData.personalInfo.nombre || 'No especificado'}</div>
                                                </div>
                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Correo electrónico</div>
                                                    <div className="cv-info-value">{formData.personalInfo.email || 'No especificado'}</div>
                                                </div>
                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Teléfono</div>
                                                    <div className="cv-info-value">{formData.personalInfo.telefono || 'No especificado'}</div>
                                                </div>
                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Ubicación</div>
                                                    <div className="cv-info-value">{formData.personalInfo.ubicacion || 'No especificado'}</div>
                                                </div>
                                                {formData.personalInfo.linkedin && (
                                                    <div className="cv-info-item">
                                                        <div className="cv-info-label">LinkedIn</div>
                                                        <div className="cv-info-value cv-link">{formData.personalInfo.linkedin}</div>
                                                    </div>
                                                )}
                                                {formData.personalInfo.github && (
                                                    <div className="cv-info-item">
                                                        <div className="cv-info-label">GitHub</div>
                                                        <div className="cv-info-value cv-link">{formData.personalInfo.github}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {formData.resumen && (
                                                <div className="cv-resume">
                                                    <div className="cv-info-label">Resumen profesional</div>
                                                    <p className="cv-resume-text">{formData.resumen}</p>
                                                </div>
                                            )}
                                        </div>

                                        {formData.experiencia.length > 0 && (
                                            <div className="cv-section">
                                                <h3 className="cv-section-title">
                                                    <Briefcase size={22} />Experiencia Laboral
                                                </h3>
                                                {formData.experiencia.map((e, i) => (
                                                    <div key={i} className="cv-experience-item">
                                                        <h4>{e.puesto || 'Puesto no especificado'}</h4>
                                                        <p className="cv-company"><strong>{e.empresa}</strong> • {e.periodo}</p>
                                                        {e.descripcion && <p className="cv-description">{e.descripcion}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {formData.educacion.length > 0 && (
                                            <div className="cv-section">
                                                <h3 className="cv-section-title">
                                                    <GraduationCap size={22} />Educación
                                                </h3>
                                                {formData.educacion.map((e, i) => (
                                                    <div key={i} className="cv-education-item">
                                                        <h4>{e.titulo || 'Título no especificado'}</h4>
                                                        <p><strong>{e.institucion}</strong> • {e.periodo}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(formData.habilidades.length > 0 || formData.idiomas.length > 0) && (
                                            <div className="cv-section">
                                                <h3 className="cv-section-title">
                                                    <Award size={22} />Habilidades y Competencias
                                                </h3>
                                                {formData.habilidades.length > 0 && (
                                                    <div className="cv-skills-section">
                                                        <div className="cv-info-label">Habilidades técnicas</div>
                                                        <div className="cv-tags">
                                                            {formData.habilidades.map((h, i) => (
                                                                <span key={i} className="cv-tag">{h}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.idiomas.length > 0 && (
                                                    <div className="cv-skills-section">
                                                        <div className="cv-info-label">Idiomas</div>
                                                        <div className="cv-tags">
                                                            {formData.idiomas.map((l, i) => (
                                                                <span key={i} className="cv-tag">{l}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="cv-admin-content">
                        <div className="cv-editor">
                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <User size={20} />Información Personal
                                </h3>
                                <div className="cv-form-grid">
                                    <div className="cv-form-group">
                                        <label>Nombre completo <span className="required">*</span></label>
                                        <input
                                            className="cv-input"
                                            value={formData.personalInfo.nombre}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, nombre: e.target.value } })}
                                            placeholder="Ej: Juan Pérez García"
                                        />
                                    </div>
                                    <div className="cv-form-group">
                                        <label>Correo electrónico <span className="required">*</span></label>
                                        <input
                                            className="cv-input"
                                            type="email"
                                            value={formData.personalInfo.email}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <div className="cv-form-group">
                                        <label>Teléfono <span className="required">*</span></label>
                                        <input
                                            className="cv-input"
                                            type="tel"
                                            value={formData.personalInfo.telefono}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, telefono: e.target.value } })}
                                            placeholder="+34 600 000 000"
                                        />
                                    </div>
                                    <div className="cv-form-group">
                                        <label>Ubicación</label>
                                        <input
                                            className="cv-input"
                                            value={formData.personalInfo.ubicacion}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, ubicacion: e.target.value } })}
                                            placeholder="Ciudad, País"
                                        />
                                    </div>
                                    <div className="cv-form-group">
                                        <label>LinkedIn</label>
                                        <input
                                            className="cv-input"
                                            value={formData.personalInfo.linkedin}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, linkedin: e.target.value } })}
                                            placeholder="linkedin.com/in/usuario"
                                        />
                                    </div>
                                    <div className="cv-form-group">
                                        <label>GitHub</label>
                                        <input
                                            className="cv-input"
                                            value={formData.personalInfo.github}
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, github: e.target.value } })}
                                            placeholder="github.com/usuario"
                                        />
                                    </div>
                                </div>
                                <div className="cv-form-group">
                                    <label>Resumen profesional</label>
                                    <textarea
                                        className="cv-input cv-textarea"
                                        value={formData.resumen}
                                        onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                                        placeholder="Describe brevemente tu perfil profesional, experiencia y objetivos..."
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <Briefcase size={20} />Experiencia Laboral
                                </h3>
                                {formData.experiencia.map((exp, i) => (
                                    <div key={i} className="cv-dynamic-item">
                                        <button className="cv-remove-btn" onClick={() => removeExperience(i)} title="Eliminar experiencia">
                                            <X size={16} />
                                        </button>
                                        <div className="cv-form-grid">
                                            <div className="cv-form-group">
                                                <label>Empresa</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.empresa}
                                                    onChange={(e) => updateExperience(i, 'empresa', e.target.value)}
                                                    placeholder="Nombre de la empresa"
                                                />
                                            </div>
                                            <div className="cv-form-group">
                                                <label>Puesto</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.puesto}
                                                    onChange={(e) => updateExperience(i, 'puesto', e.target.value)}
                                                    placeholder="Ej: Desarrollador Full Stack"
                                                />
                                            </div>
                                            <div className="cv-form-group">
                                                <label>Período</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.periodo}
                                                    onChange={(e) => updateExperience(i, 'periodo', e.target.value)}
                                                    placeholder="Ej: 2020 - 2023"
                                                />
                                            </div>
                                        </div>
                                        <div className="cv-form-group">
                                            <label>Descripción</label>
                                            <textarea
                                                className="cv-input cv-textarea"
                                                value={exp.descripcion}
                                                onChange={(e) => updateExperience(i, 'descripcion', e.target.value)}
                                                placeholder="Describe tus responsabilidades y logros..."
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button className="cv-add-btn" onClick={addExperience}>
                                    <Plus size={18} />Agregar experiencia laboral
                                </button>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <GraduationCap size={20} />Educación
                                </h3>
                                {formData.educacion.map((edu, i) => (
                                    <div key={i} className="cv-dynamic-item">
                                        <button className="cv-remove-btn" onClick={() => removeEducation(i)} title="Eliminar educación">
                                            <X size={16} />
                                        </button>
                                        <div className="cv-form-grid">
                                            <div className="cv-form-group">
                                                <label>Institución</label>
                                                <input
                                                    className="cv-input"
                                                    value={edu.institucion}
                                                    onChange={(e) => updateEducation(i, 'institucion', e.target.value)}
                                                    placeholder="Universidad o institución"
                                                />
                                            </div>
                                            <div className="cv-form-group">
                                                <label>Título</label>
                                                <input
                                                    className="cv-input"
                                                    value={edu.titulo}
                                                    onChange={(e) => updateEducation(i, 'titulo', e.target.value)}
                                                    placeholder="Ej: Ingeniería Informática"
                                                />
                                            </div>
                                            <div className="cv-form-group">
                                                <label>Período</label>
                                                <input
                                                    className="cv-input"
                                                    value={edu.periodo}
                                                    onChange={(e) => updateEducation(i, 'periodo', e.target.value)}
                                                    placeholder="Ej: 2016 - 2020"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="cv-add-btn" onClick={addEducation}>
                                    <Plus size={18} />Agregar formación académica
                                </button>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <Award size={20} />Habilidades y Competencias
                                </h3>
                                <div className="cv-form-group">
                                    <label>Habilidades técnicas</label>
                                    <input
                                        className="cv-input"
                                        value={formData.habilidades.join(', ')}
                                        onChange={(e) => handleSkillsChange(e.target.value)}
                                        placeholder="React, Node.js, Python, SQL (separadas por comas)"
                                    />
                                    <small className="cv-help-text">Separa cada habilidad con una coma</small>
                                </div>
                                <div className="cv-form-group">
                                    <label>Idiomas</label>
                                    <input
                                        className="cv-input"
                                        value={formData.idiomas.join(', ')}
                                        onChange={(e) => handleLanguagesChange(e.target.value)}
                                        placeholder="Español (Nativo), Inglés (Avanzado), Francés (Intermedio)"
                                    />
                                    <small className="cv-help-text">Separa cada idioma con una coma</small>
                                </div>
                            </div>

                            <div className="cv-form-actions">
                                <button className="btn btn-secondary" onClick={() => { loadCV(); setIsEditing(false); }}>
                                    <X size={18} />Cancelar
                                </button>
                                <button className="btn btn-success" onClick={saveCV}>
                                    <Save size={18} />Guardar CV
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVAdministrator;
