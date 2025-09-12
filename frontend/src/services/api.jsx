// Importar axios para realizar peticiones HTTP
import axios from "axios";

// Crear instancia de axios configurada para nuestra API de notas
const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // URL base del backend
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Funciones para interactuar con la API de notas con manejo de errores
export const getNotes = async (params) => {
  try {
    const response = await API.get("/notes", { params });
    return response.data;
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

export const createNote = async (data) => {
  try {
    const response = await API.post("/notes", data);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await API.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const updateNote = async (id, data) => {
  try {
    const response = await API.put(`/notes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

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

