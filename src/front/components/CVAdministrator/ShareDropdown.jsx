import React, { useState } from "react";
import { Share2, Mail, FileDown } from "lucide-react";
import PortalDropdown from "./PortalDropdown";
import { pdf } from "@react-pdf/renderer";
import CVPDFDocument from "./CVPDFDocument";

const ShareDropdown = ({ cv }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const cvUrl = `${window.location.origin}/cv/${cv.id}`;

    const toggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });
        setOpen(prev => !prev);
    };

    const handleEmail = () => {
        const subject = "";
        const body = "";
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
        setOpen(false);
    };

    const handleDownloadPDF = async () => {
        setOpen(false);

        try {
            // Generar el PDF usando cv.datos
            const blob = await pdf(<CVPDFDocument formData={cv.datos} />).toBlob();

            // Crear link de descarga
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${cv?.datos?.titulo || "CV"}.pdf`;
            link.click();

            // Limpiar
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Error al generar el PDF");
        }
    };

    return (
        <div className="share-dropdown">
            <button
                type="button"
                className="btn-cv-action btn-secondary share-trigger"
                onClick={toggle}
            >
                <Share2 size={18} />
            </button>

            <PortalDropdown open={open} position={pos}>
                <div className="share-menu open">
                    <button className="share-item" onClick={handleEmail}>
                        <Mail size={16} />
                        <span>Correo electrónico</span>
                    </button>

                    <button className="share-item" onClick={handleDownloadPDF}>
                        <FileDown size={16} />
                        <span>Descargar PDF</span>
                    </button>
                </div>
            </PortalDropdown>
        </div>
    );
};

export default ShareDropdown;