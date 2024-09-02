import React from 'react';
import ReactDOM from 'react-dom/client';
import InspectionForm from './components/InspectionForm'; // Importa tu nuevo componente

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <InspectionForm />
  </React.StrictMode>
);
