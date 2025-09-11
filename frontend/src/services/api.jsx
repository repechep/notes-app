// Importar axios para realizar peticiones HTTP
import axios from "axios";

// Crear instancia de axios configurada para nuestra API de notas
const API = axios.create({
  baseURL: "http://localhost:8000/api/v1/notes", // URL base del backend
});

// Funciones para interactuar con la API de notas
export const getNotes = (params) => API.get("", { params });     // Obtener lista de notas
export const createNote = (data) => API.post("", data);          // Crear nueva nota
export const deleteNote = (id) => API.delete(`/${id}`);         // Eliminar nota por ID
export const updateNote = (id, data) => API.put(`/${id}`, data); // Actualizar nota existente

// Servicio para API externa (PokéAPI)
export const getExternalData = async () => {
  try {
    // Obtener datos de Ditto desde PokéAPI
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
    return response.data;
  } catch (error) {
    console.error('Error fetching external data:', error);
    throw error; // Propagar el error para manejo en el componente
  }
};

