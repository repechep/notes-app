// Importar axios para realizar peticiones HTTP
import axios from "axios";

// Crear instancia de axios configurada para nuestra API de notas
// Esta configuración centralizada permite reutilizar la misma configuración
// en todas las peticiones a nuestro backend
const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // URL base del backend FastAPI
  timeout: 10000, // Timeout de 10 segundos para evitar peticiones colgadas
  headers: {
    'Content-Type': 'application/json', // Especificar que enviamos JSON
  }
});

// Función para obtener notas del backend con parámetros de consulta
// Soporta paginación, búsqueda y filtros
export const getNotes = async (params) => {
  try {
    // Realizar petición GET con parámetros de consulta (query parameters)
    // params puede incluir: page, per_page, search, archived
    const response = await API.get("/notes", { params });
    return response.data; // Retornar solo los datos de la respuesta
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error; // Propagar el error para manejo en el componente
  }
};

// Función para crear una nueva nota en el backend
export const createNote = async (data) => {
  try {
    // Realizar petición POST con los datos de la nueva nota
    // data debe incluir: title, content, tags (opcional), archived (opcional)
    const response = await API.post("/notes", data);
    return response.data; // Retornar la nota creada con su ID generado
  } catch (error) {
    console.error('Error creating note:', error);
    throw error; // Propagar error para mostrar mensaje al usuario
  }
};

// Función para eliminar una nota por su ID
export const deleteNote = async (id) => {
  try {
    // Realizar petición DELETE con el ID de la nota a eliminar
    const response = await API.delete(`/notes/${id}`);
    return response.data; // Retornar confirmación de eliminación
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error; // Propagar error para manejo en el componente
  }
};

// Función para actualizar una nota existente
export const updateNote = async (id, data) => {
  try {
    // Realizar petición PUT con el ID y los nuevos datos de la nota
    // data puede incluir: title, content, tags, archived
    const response = await API.put(`/notes/${id}`, data);
    return response.data; // Retornar la nota actualizada
  } catch (error) {
    console.error('Error updating note:', error);
    throw error; // Propagar error para manejo en el componente
  }
};

// Servicio para obtener datos de Pokémon desde la API externa (PokéAPI)
// Esta función es un ejemplo de integración con APIs externas
export const getExternalData = async () => {
  try {
    // Obtener datos específicos de Ditto desde PokéAPI
    // Se usa axios directamente en lugar de la instancia API porque es una API externa
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
    return response.data; // Retornar datos del Pokémon
  } catch (error) {
    console.error('Error fetching external data:', error);
    throw error; // Propagar el error para manejo en el componente
  }
};

