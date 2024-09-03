import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Estilos CSS básicos para mejorar la apariencia del formulario
// Estilos CSS mejorados
const styles = {
    formContainer: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    table: {
        width: '80%',
        margin: '20px auto',
        borderCollapse: 'collapse',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    th: {
        borderBottom: '2px solid #ddd',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        textAlign: 'left',
    },
    td: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    trHover: {
        backgroundColor: '#f9f9f9',
    },
    editButton: {
        marginRight: '10px',
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};


// Estado inicial del formulario
const initialState = {
    num: '',
    numFicha: '',
    nombreInspector: 'Edel Candia Mamani',
    nombreResponsable: 'Luis Zavala Gutiérrez',
    fecha: '',
    horaInicio: '',
    horaFinalizacion: '',
    areaProduccion: 'TACNA 02/02-A-TAC',
    numeroDER: '',
    localizacion: 'CALETA - PUNTA PICATA',
    numeroDniRuc: '',
    nombreAsociacion: '',
    numeroRegistro: '',
    nombreRepresentante: '',
    dniRepresentante: '',
    nombreAplicacion: 'TRAZAMOBI',
    plataformaDigital: 'WhatsApp Web',
    numeroMatricula: '',
    nombreEmbarcacion: '',
    cantidad: '',
    tipoRecurso: '',
    destinoFinal: '',
    descripcionMedioProbatorio: 'Imagen fotográfica',
    numeroPlaca: '',
};


function InspectionForm({ selectedRecord, onFormSubmit, onFormReset }) {
    const [formData, setFormData] = useState(initialState);
    const [loadingDniRepresentante, setLoadingDniRepresentante] = useState(false);
    const [loadingDniRuc, setLoadingDniRuc] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (selectedRecord) {
            setFormData(selectedRecord);
        }
    }, [selectedRecord]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (typeof onFormSubmit === 'function') {  // Comprobación adicional
            onFormSubmit(formData);
            handleReset();
        } else {
            console.error('onFormSubmit is not a function');
        }
    };

    const handleReset = () => {
        setFormData(initialState);  // Usar el estado inicial predefinido
        onFormReset();
    };

    // Función para manejar la consulta de DNI del Representante
    const handleDniRepresentanteLookup = async () => {
        if (formData.dniRepresentante.length !== 8) {
            alert('El DNI debe tener 8 dígitos.');
            return;
        }

        setLoadingDniRepresentante(true);
        try {
            const response = await fetch('https://apiperu.dev/api/dni', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 5e4aa7d17be2534a53b0a775a5b8f5eb715ac02de4472b8e9fd40edd4d9a24c1'
                },
                body: JSON.stringify({ dni: formData.dniRepresentante })
            });

            const data = await response.json();
            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    nombreRepresentante: `${data.data.nombres} ${data.data.apellido_paterno} ${data.data.apellido_materno}`
                }));
            } else {
                alert('No se encontraron datos para el DNI ingresado.');
                setFormData((prev) => ({ ...prev, nombreRepresentante: '' }));
            }
        } catch (error) {
            console.error('Error al consultar la API de DNI:', error);
        } finally {
            setLoadingDniRepresentante(false);
        }
    };

    // Función para manejar la consulta de DNI/RUC
    const handleDniRucLookup = async () => {
        if (formData.numeroDniRuc.length !== 8 && formData.numeroDniRuc.length !== 11) {
            alert('El número debe tener 8 dígitos para DNI o 11 dígitos para RUC.');
            return;
        }

        setLoadingDniRuc(true);

        if (formData.numeroDniRuc.length === 11) {
            setFormData((prev) => ({ ...prev, nombreAsociacion: '' }));
        }

        const url = formData.numeroDniRuc.length === 8 ? 'https://apiperu.dev/api/dni' : 'https://apiperu.dev/api/ruc';
        const body = formData.numeroDniRuc.length === 8 ? { dni: formData.numeroDniRuc } : { ruc: formData.numeroDniRuc };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 5e4aa7d17be2534a53b0a775a5b8f5eb715ac02de4472b8e9fd40edd4d9a24c1'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.success) {
                if (formData.numeroDniRuc.length === 8) {
                    setFormData((prev) => ({
                        ...prev,
                        nombreAsociacion: `${data.data.nombres} ${data.data.apellido_paterno} ${data.data.apellido_materno}`
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        nombreAsociacion: data.data.nombre_o_razon_social
                    }));
                }
            } else {
                alert('No se encontraron datos para el número ingresado.');
                setFormData((prev) => ({ ...prev, nombreAsociacion: '' }));
            }
        } catch (error) {
            console.error('Error al consultar la API de RUC/DNI:', error);
        } finally {
            setLoadingDniRuc(false);
        }
    };

    return (
        <form style={styles.formContainer} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número (solo números positivos):</label>
                <input
                    type="number"
                    min="1"
                    style={{ ...styles.input, ...(isHovering ? styles.inputFocus : {}) }}
                    name="num"
                    value={formData.num}
                    onChange={handleChange}
                    required
                    onFocus={() => setIsHovering(true)}
                    onBlur={() => setIsHovering(false)}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Ficha (solo números positivos):</label>
                <input
                    type="number"
                    min="1"
                    name="numFicha"
                    style={styles.input}
                    value={formData.numFicha}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Inspector:</label>
                <select
                    style={styles.input}
                    name="nombreInspector"
                    value={formData.nombreInspector}
                    onChange={handleChange}
                    required
                >
                    <option value="Edel Candia Mamani">Edel Candia Mamani</option>
                    <option value="Luis Zavala Gutiérrez">Luis Zavala Gutiérrez</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Responsable:</label>
                <select
                    style={styles.input}
                    name="nombreResponsable"
                    value={formData.nombreResponsable}
                    onChange={handleChange}
                    required
                >
                    <option value="Edel Candia Mamani">Edel Candia Mamani</option>
                    <option value="Luis Zavala Gutiérrez">Luis Zavala Gutiérrez</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Fecha (solo 2021):</label>
                <input
                    type="date"
                    style={styles.input}
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min="2021-01-01"
                    max="2021-12-31"
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Hora de Inicio:</label>
                <input
                    type="time"
                    style={styles.input}
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Hora de Finalización:</label>
                <input
                    type="time"
                    style={styles.input}
                    name="horaFinalizacion"
                    value={formData.horaFinalizacion}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Área de Producción:</label>
                <select
                    style={styles.input}
                    name="areaProduccion"
                    value={formData.areaProduccion}
                    onChange={handleChange}
                >
                    <option value="TACNA 02/02-A-TAC">TACNA 02/02-A-TAC</option>
                    <option value="TACNA 02/02-B-TAC">TACNA 02/02-B-TAC</option>
                    <option value="TACNA 03/03-B-TAC">TACNA 03/03-B-TAC</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de DER (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="numeroDER"
                    value={formData.numeroDER}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Localización:</label>
                <select
                    style={styles.input}
                    name="localizacion"
                    value={formData.localizacion}
                    onChange={handleChange}
                >
                    <option value="CALETA - PUNTA PICATA">CALETA - PUNTA PICATA</option>
                    <option value="DPA MORRO SAMA">DPA MORRO SAMA</option>
                    <option value="CALETA - VILA VILA">CALETA - VILA VILA</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de DNI/RUC (hasta 11 dígitos, solo números positivos):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="numeroDniRuc"
                    value={formData.numeroDniRuc}
                    onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({ ...prev, nombreAsociacion: '' }));
                    }}
                    maxLength="11"
                />
                <button style={styles.button} type="button" onClick={handleDniRucLookup} disabled={loadingDniRuc}>
                    {loadingDniRuc ? 'Buscando...' : 'Buscar DNI/RUC'}
                </button>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Asociación (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="nombreAsociacion"
                    value={formData.nombreAsociacion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Registro:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="numeroRegistro"
                    value={formData.numeroRegistro}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>DNI del Representante (8 dígitos, solo números positivos):</label>
                <input
                    type="text"
                    pattern="[0-9]{8}"
                    style={styles.input}
                    name="dniRepresentante"
                    value={formData.dniRepresentante}
                    onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({ ...prev, nombreRepresentante: '' }));
                    }}
                    maxLength="8"
                />
                <button style={styles.button} type="button" onClick={handleDniRepresentanteLookup} disabled={loadingDniRepresentante}>
                    {loadingDniRepresentante ? 'Buscando...' : 'Buscar DNI'}
                </button>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Representante:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="nombreRepresentante"
                    value={formData.nombreRepresentante}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Aplicación:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="nombreAplicacion"
                    value={formData.nombreAplicacion}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Plataforma Digital:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="plataformaDigital"
                    value={formData.plataformaDigital}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Matrícula (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="numeroMatricula"
                    value={formData.numeroMatricula}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Embarcación (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="nombreEmbarcacion"
                    value={formData.nombreEmbarcacion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Recurso (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="tipoRecurso"
                    value={formData.tipoRecurso}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Destino Final (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    name="destinoFinal"
                    value={formData.destinoFinal}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Descripción del Medio Probatorio:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="descripcionMedioProbatorio"
                    value={formData.descripcionMedioProbatorio}
                    onChange={handleChange}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Placa:</label>
                <input
                    type="text"
                    style={styles.input}
                    name="numeroPlaca"
                    value={formData.numeroPlaca}
                    onChange={handleChange}
                />
            </div>

            <button style={styles.button} type="submit">Enviar</button>
        </form>
    );

}

const InspectionTable = ({ records, onEdit, onDelete }) => {
    return (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Número</th>
                    <th style={styles.th}>Número de Ficha</th>
                    <th style={styles.th}>Nombre del Inspector</th>
                    <th style={styles.th}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {records.map((record, index) => (
                    <tr key={record.id} style={index % 2 === 0 ? styles.trHover : {}}>
                        <td style={styles.td}>{record.num}</td>
                        <td style={styles.td}>{record.numFicha}</td>
                        <td style={styles.td}>{record.nombreInspector}</td>
                        <td style={styles.td}>
                            <button
                                onClick={() => onEdit(record)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onDelete(record.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


const InspectionApp = () => {
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        const { data, error } = await supabase.from('inspections').select('*');
        if (error) console.error('Error fetching records:', error);
        else setRecords(data);
    };

    const handleFormSubmit = async (formData) => {
        if (formData.id) {
            const { data, error } = await supabase.from('inspections').update(formData).eq('id', formData.id);
            if (error) console.error('Error updating record:', error);
        } else {
            const { data, error } = await supabase.from('inspections').insert([formData]);
            if (error) console.error('Error inserting record:', error);
        }
        fetchRecords();
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('inspections').delete().eq('id', id);
        if (error) console.error('Error deleting record:', error);
        fetchRecords();
    };

    const handleFormReset = () => {
        setSelectedRecord(null);
    };

    return (
        <div>
            <InspectionForm
                selectedRecord={selectedRecord}
                onFormSubmit={handleFormSubmit}
                onFormReset={handleFormReset}
            />
            <InspectionTable records={records} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default InspectionApp;
