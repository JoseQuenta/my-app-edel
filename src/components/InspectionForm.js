import React, { useState } from 'react';

import { supabase } from '../supabaseClient';

// Estilos CSS básicos para mejorar la apariencia del formulario
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
    }
};

function InspectionForm() {
    const [num, setNum] = useState('');
    const [numFicha, setNumFicha] = useState('');
    const [nombreInspector, setNombreInspector] = useState('Edel Candia Mamani');
    const [nombreResponsable, setNombreResponsable] = useState('Luis Zavala Gutiérrez');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinalizacion, setHoraFinalizacion] = useState('');
    const [areaProduccion, setAreaProduccion] = useState('TACNA 02/02-A-TAC');
    const [numeroDER, setNumeroDER] = useState('');
    const [localizacion, setLocalizacion] = useState('CALETA - PUNTA PICATA');
    const [numeroDniRuc, setNumeroDniRuc] = useState('');
    const [nombreAsociacion, setNombreAsociacion] = useState('');
    const [numeroRegistro, setNumeroRegistro] = useState('');
    const [nombreRepresentante, setNombreRepresentante] = useState('');
    const [dniRepresentante, setDniRepresentante] = useState('');
    const [nombreAplicacion, setNombreAplicacion] = useState('TRAZAMOBI');
    const [plataformaDigital, setPlataformaDigital] = useState('WhatsApp Web');
    const [numeroMatricula, setNumeroMatricula] = useState('');
    const [nombreEmbarcacion, setNombreEmbarcacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [tipoRecurso, setTipoRecurso] = useState('');
    const [destinoFinal, setDestinoFinal] = useState('');
    const [descripcionMedioProbatorio, setDescripcionMedioProbatorio] = useState('Imagen fotográfica');
    const [numeroPlaca, setNumeroPlaca] = useState('');
    const [loadingDniRepresentante, setLoadingDniRepresentante] = useState(false); // Estado añadido para la carga del DNI del Representante
    const [loadingDniRuc, setLoadingDniRuc] = useState(false); // Estado añadido para la carga del DNI o RUC

    // Función para manejar la consulta de DNI del Representante
    const handleDniRepresentanteLookup = async () => {
        if (dniRepresentante.length !== 8) {
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
                body: JSON.stringify({ dni: dniRepresentante })
            });

            const data = await response.json();
            if (data.success) {
                setNombreRepresentante(`${data.data.nombres} ${data.data.apellido_paterno} ${data.data.apellido_materno}`);
            } else {
                alert('No se encontraron datos para el DNI ingresado.');
                setNombreRepresentante('');
            }
        } catch (error) {
            console.error('Error al consultar la API de DNI:', error);
        } finally {
            setLoadingDniRepresentante(false);
        }
    };

    const handleDniRucLookup = async () => {
        // Verificar que el número ingresado sea de 8 dígitos para DNI o 11 dígitos para RUC
        if (numeroDniRuc.length !== 8 && numeroDniRuc.length !== 11) {
            alert('El número debe tener 8 dígitos para DNI o 11 dígitos para RUC.');
            return;
        }

        // Establecer estado de carga a true
        setLoadingDniRuc(true);

        // Limpiar solo el campo de nombre de la asociación si es un RUC (11 dígitos)
        if (numeroDniRuc.length === 11) {
            setNombreAsociacion('');
        }

        const url = numeroDniRuc.length === 8 ? 'https://apiperu.dev/api/dni' : 'https://apiperu.dev/api/ruc';
        const body = numeroDniRuc.length === 8 ? { dni: numeroDniRuc } : { ruc: numeroDniRuc };

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
                if (numeroDniRuc.length === 8) {
                    // Actualizar el nombre del representante si es un DNI
                    setNombreAsociacion(`${data.data.nombres} ${data.data.apellido_paterno} ${data.data.apellido_materno}`);
                } else {
                    // Actualizar el nombre de la asociación si es un RUC
                    setNombreAsociacion(data.data.nombre_o_razon_social);
                }
            } else {
                alert('No se encontraron datos para el número ingresado.');
                if (numeroDniRuc.length === 11) {
                    setNombreAsociacion('');
                }
                if (numeroDniRuc.length === 8) {
                    setNombreAsociacion('');
                }
            }
        } catch (error) {
            console.error('Error al consultar la API de RUC/DNI:', error);
        } finally {
            setLoadingDniRuc(false);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!num || !numFicha || !numeroDER || !nombreAsociacion || !numeroMatricula || !nombreEmbarcacion || !cantidad || !tipoRecurso || !destinoFinal) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Objeto con los datos del formulario
        const formData = {
            num,
            numFicha,
            nombreInspector,
            nombreResponsable,
            fecha,
            horaInicio,
            horaFinalizacion,
            areaProduccion,
            numeroDER,
            localizacion,
            numeroDniRuc,
            nombreAsociacion,
            numeroRegistro,
            nombreRepresentante,
            dniRepresentante,
            nombreAplicacion,
            plataformaDigital,
            numeroMatricula,
            nombreEmbarcacion,
            cantidad,
            tipoRecurso,
            destinoFinal,
            descripcionMedioProbatorio,
            numeroPlaca
        };

        // Aquí es donde conectamos con Supabase para guardar los datos
        const { data, error } = await supabase
            .from('inspections') // Nombre de tu tabla en Supabase
            .insert([formData]); // Asegúrate de pasar un array con el objeto formData

        if (error) {
            console.error('Error al guardar los datos en Supabase:', error.message);
            alert('Hubo un problema al guardar los datos.');
        } else {
            alert('Datos guardados exitosamente en Supabase.');
            console.log('Datos guardados:', data);
        }
    };

    return (
        <form style={styles.formContainer} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número (solo números positivos):</label>
                <input
                    type="number"
                    min="1"
                    style={styles.input}
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Ficha (solo números positivos):</label>
                <input
                    type="number"
                    min="1"
                    style={styles.input}
                    value={numFicha}
                    onChange={(e) => setNumFicha(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Inspector:</label>
                <select
                    style={styles.input}
                    value={nombreInspector}
                    onChange={(e) => setNombreInspector(e.target.value)}
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
                    value={nombreResponsable}
                    onChange={(e) => setNombreResponsable(e.target.value)}
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
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
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
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Hora de Finalización:</label>
                <input
                    type="time"
                    style={styles.input}
                    value={horaFinalizacion}
                    onChange={(e) => setHoraFinalizacion(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Área de Producción:</label>
                <select
                    style={styles.input}
                    value={areaProduccion}
                    onChange={(e) => setAreaProduccion(e.target.value)}
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
                    value={numeroDER}
                    onChange={(e) => setNumeroDER(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Localización:</label>
                <select
                    style={styles.input}
                    value={localizacion}
                    onChange={(e) => setLocalizacion(e.target.value)}
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
                    value={numeroDniRuc}
                    onChange={(e) => {
                        setNumeroDniRuc(e.target.value);
                        setNombreAsociacion(''); // Limpiar solo el campo de nombre de la asociación
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
                    value={nombreAsociacion}
                    onChange={(e) => setNombreAsociacion(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Registro:</label>
                <input
                    type="text"
                    style={styles.input}
                    value={numeroRegistro}
                    onChange={(e) => setNumeroRegistro(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>DNI del Representante (8 dígitos, solo números positivos):</label>
                <input
                    type="text"
                    pattern="[0-9]{8}"
                    style={styles.input}
                    value={dniRepresentante}
                    onChange={(e) => {
                        setDniRepresentante(e.target.value);
                        setNombreRepresentante(''); // Limpiar solo el campo de nombre del representante
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
                    value={nombreRepresentante}
                    onChange={(e) => setNombreRepresentante(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Aplicación:</label>
                <input
                    type="text"
                    style={styles.input}
                    value={nombreAplicacion}
                    onChange={(e) => setNombreAplicacion(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Plataforma Digital:</label>
                <input
                    type="text"
                    style={styles.input}
                    value={plataformaDigital}
                    onChange={(e) => setPlataformaDigital(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Matrícula (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    value={numeroMatricula}
                    onChange={(e) => setNumeroMatricula(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Embarcación (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    value={nombreEmbarcacion}
                    onChange={(e) => setNombreEmbarcacion(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Recurso (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    value={tipoRecurso}
                    onChange={(e) => setTipoRecurso(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Destino Final (obligatorio):</label>
                <input
                    type="text"
                    style={styles.input}
                    value={destinoFinal}
                    onChange={(e) => setDestinoFinal(e.target.value)}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Descripción del Medio Probatorio:</label>
                <input
                    type="text"
                    style={styles.input}
                    value={descripcionMedioProbatorio}
                    onChange={(e) => setDescripcionMedioProbatorio(e.target.value)}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Placa:</label>
                <input
                    type="text"
                    style={styles.input}
                    value={numeroPlaca}
                    onChange={(e) => setNumeroPlaca(e.target.value)}
                />
            </div>
            <button style={styles.button} type="submit">Enviar</button>
        </form>
    );
}

export default InspectionForm;
