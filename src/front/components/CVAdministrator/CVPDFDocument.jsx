import React from "react";
import { Document, Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        objectFit: "cover"
    },
    info: {
        marginLeft: 20
    },
    name: {
        fontSize: 18,
        fontWeight: "bold"
    },
    contact: {
        fontSize: 12,
        marginTop: 4
    }
});

const CVPDFDocument = ({ formData }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.header}>
                {formData.foto && (
                    <Image src={formData.foto} style={styles.photo} />
                )}
                <View style={styles.info}>
                    <Text style={styles.name}>{formData.nombre || "Nombre completo"}</Text>
                    <Text style={styles.contact}>{formData.email || "correo@ejemplo.com"}</Text>
                    <Text style={styles.contact}>{formData.telefono || "+34 600 000 000"}</Text>
                    <Text style={styles.contact}>{formData.ubicacion || "Ciudad, País"}</Text>
                </View>
            </View>

            {formData.resumen && (
                <>
                    <Text style={{ fontSize: 14, marginBottom: 6 }}>Resumen profesional</Text>
                    <Text>{formData.resumen}</Text>
                </>
            )}

            {Array.isArray(formData.habilidades) && formData.habilidades.length > 0 && (
                <>
                    <Text style={{ fontSize: 14, marginTop: 20, marginBottom: 6 }}>Habilidades</Text>
                    <Text>{formData.habilidades.join(" · ")}</Text>
                </>
            )}
        </Page>
    </Document>
);

export default CVPDFDocument;
