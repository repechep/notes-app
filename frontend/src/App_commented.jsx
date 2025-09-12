// Importaciones de React y hooks necesarios
import { useState, useEffect } from 'react';
// Importación de servicios API para operaciones CRUD de notas
import { getNotes, createNote, updateNote, deleteNote } from './services/api';
// Importación de componentes de la interfaz de usuario
import NoteModal from './components/NoteModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import DarkModeToggle from './components/DarkModeToggle';
import DeleteModal from './components/DeleteModal';

// Colores oficiales de los tipos de Pokémon para la interfaz visual
const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

// Función utilitaria para obtener el color de un tipo de Pokémon
// Retorna el color específico del tipo o un color por defecto
const getTypeColor = (type) => TYPE_COLORS[type] || '#68A090';

// Componente principal de la aplicación Notes App
function App() {
  // Estados para la gestión de notas
  const [notes, setNotes] = useState([]); // Lista de notas obtenidas del backend
  const [editingNote, setEditingNote] = useState(null); // Nota que se está editando actualmente
  const [search, setSearch] = useState(''); // Término de búsqueda para filtrar notas
  const [page, setPage] = useState(1); // Página actual para la paginación de notas
  
  // Estados para la navegación y modales
  const [activeTab, setActiveTab] = useState('notes'); // Pestaña activa: 'notes' o 'external'
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal de nota
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controla el modal de confirmación de eliminación
  const [noteToDelete, setNoteToDelete] = useState(null); // Nota seleccionada para eliminar
  
  // Estados para manejo de carga y errores de notas
  const [loading, setLoading] = useState(false); // Estado de carga para operaciones de notas
  const [error, setError] = useState(null); // Errores relacionados con notas
  
  // Estados para la funcionalidad de Pokémon (datos externos)
  const [externalData, setExternalData] = useState([]); // Lista de Pokémon obtenidos de PokéAPI
  const [externalLoading, setExternalLoading] = useState(false); // Estado de carga para Pokémon
  const [externalError, setExternalError] = useState(null); // Errores de PokéAPI
  const [pokemonSearch, setPokemonSearch] = useState(''); // Término de búsqueda de Pokémon
  const [selectedType, setSelectedType] = useState(''); // Tipo de Pokémon seleccionado para filtrar
  
  // Estados para el sistema de sugerencias de búsqueda
  const [suggestions, setSuggestions] = useState([]); // Lista de sugerencias de Pokémon
  const [showSuggestions, setShowSuggestions] = useState(false); // Controla la visibilidad del dropdown

  // Lista completa de tipos de Pokémon disponibles para filtrado
  // Incluye los 18 tipos oficiales de Pokémon
  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  // Lista extensa de Pokémon populares para el sistema de sugerencias
  // Incluye los 150 Pokémon originales de la primera generación
  const popularPokemon = [
    'pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam', 'gengar',
    'dragonite', 'mewtwo', 'mew', 'gyarados', 'lapras', 'eevee', 'vaporeon',
    'jolteon', 'flareon', 'snorlax', 'articuno', 'zapdos', 'moltres',
    'squirtle', 'wartortle', 'charmander', 'charmeleon', 'bulbasaur', 'ivysaur',
    'caterpie', 'metapod', 'butterfree', 'weedle', 'kakuna', 'beedrill',
    'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate', 'spearow',
    'fearow', 'ekans', 'arbok', 'sandshrew', 'sandslash', 'nidoran-f',
    'nidorina', 'nidoqueen', 'nidoran-m', 'nidorino', 'nidoking', 'clefairy',
    'clefable', 'vulpix', 'ninetales', 'jigglypuff', 'wigglytuff', 'zubat',
    'golbat', 'oddish', 'gloom', 'vileplume', 'paras', 'parasect', 'venonat',
    'venomoth', 'diglett', 'dugtrio', 'meowth', 'persian', 'psyduck', 'golduck',
    'mankey', 'primeape', 'growlithe', 'arcanine', 'poliwag', 'poliwhirl',
    'poliwrath', 'abra', 'kadabra', 'machop', 'machoke', 'machamp',
    'bellsprout', 'weepinbell', 'victreebel', 'tentacool', 'tentacruel',
    'geodude', 'graveler', 'golem', 'ponyta', 'rapidash', 'slowpoke',
    'slowbro', 'magnemite', 'magneton', 'farfetchd', 'doduo', 'dodrio',
    'seel', 'dewgong', 'grimer', 'muk', 'shellder', 'cloyster', 'gastly',
    'haunter', 'onix', 'drowzee', 'hypno', 'krabby', 'kingler', 'voltorb',
    'electrode', 'exeggcute', 'exeggutor', 'cubone', 'marowak', 'hitmonlee',
    'hitmonchan', 'lickitung', 'koffing', 'weezing', 'rhyhorn', 'rhydon',
    'chansey', 'tangela', 'kangaskhan', 'horsea', 'seadra', 'goldeen',
    'seaking', 'staryu', 'starmie', 'mr-mime', 'scyther', 'jynx',
    'electabuzz', 'magmar', 'pinsir', 'tauros', 'magikarp', 'ditto',
    'porygon', 'omanyte', 'omastar', 'kabuto', 'kabutops', 'aerodactyl'
  ];

  // Función para obtener notas del backend con paginación y búsqueda
  const fetchNotes = async () => {
    setLoading(true); // Activar estado de carga
    setError(null); // Limpiar errores previos
    try {
      // Llamada a la API con parámetros de paginación y búsqueda
      const response = await getNotes({ page, per_page: 10, search });
      // Manejar diferentes formatos de respuesta del backend
      setNotes(response.items || response.data || response || []);
    } catch (error) {
      console.error('Fetch notes error:', error);
      // Mostrar mensaje de error amigable al usuario
      setError(`Failed to load notes: ${error.message || 'Please try again.'}`);
      setNotes([]); // Limpiar lista en caso de error
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Función para obtener Pokémon filtrados por tipo desde PokéAPI
  const fetchPokemonByType = async (type) => {
    try {
      // Obtener información del tipo específico desde PokéAPI
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!response.ok) return []; // Retornar array vacío si falla la petición
      
      const typeData = await response.json();
      // Limitar a 20 Pokémon para evitar sobrecarga y extraer solo nombres
      const pokemonList = typeData.pokemon.slice(0, 20).map(p => p.pokemon.name);
      
      // Crear peticiones paralelas para obtener datos detallados de cada Pokémon
      const requests = pokemonList.map(async (name) => {
        try {
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return pokemonResponse.ok ? await pokemonResponse.json() : null;
        } catch {
          return null; // Manejar errores individuales sin afectar otras peticiones
        }
      });
      
      // Esperar a que todas las peticiones se completen
      const results = await Promise.all(requests);
      return results.filter(Boolean); // Filtrar resultados nulos
    } catch {
      return []; // Retornar array vacío en caso de error general
    }
  };

  // Función principal para obtener datos de Pokémon según filtros aplicados
  const fetchExternalData = async () => {
    setExternalLoading(true); // Activar estado de carga para Pokémon
    setExternalError(null); // Limpiar errores previos
    try {
      let pokemonList = [];
      
      // Caso 1: Filtrar por tipo específico de Pokémon
      if (selectedType) {
        pokemonList = await fetchPokemonByType(selectedType);
      } 
      // Caso 2: Búsqueda por nombre de Pokémon
      else if (pokemonSearch.trim()) {
        const searchTerm = pokemonSearch.toLowerCase().trim();
        
        // Buscar coincidencias en la lista de Pokémon populares
        const matches = popularPokemon.filter(name => 
          name.includes(searchTerm) || searchTerm.includes(name.substring(0, 3))
        );
        
        // Si hay coincidencias, obtener datos detallados
        if (matches.length > 0) {
          const requests = matches.slice(0, 12).map(async (pokemonName) => {
            try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
              return response.ok ? await response.json() : null;
            } catch {
              return null;
            }
          });
          
          const results = await Promise.all(requests);
          pokemonList = results.filter(Boolean);
        }
        
        // Si no hay coincidencias, intentar búsqueda directa en PokéAPI
        if (pokemonList.length === 0) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (response.ok) {
              const pokemon = await response.json();
              pokemonList = [pokemon];
            }
          } catch {
            // Como último recurso, mostrar Pokémon aleatorios
            const randomRequests = Array.from({ length: 8 }, async () => {
              const randomId = Math.floor(Math.random() * 150) + 1;
              try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                return response.ok ? await response.json() : null;
              } catch {
                return null;
              }
            });
            
            const randomResults = await Promise.all(randomRequests);
            pokemonList = randomResults.filter(Boolean);
          }
        }
      } 
      // Caso 3: Sin filtros - mostrar Pokémon aleatorios
      else {
        const randomRequests = Array.from({ length: 12 }, async () => {
          const randomId = Math.floor(Math.random() * 150) + 1; // Solo primera generación
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            return response.ok ? await response.json() : null;
          } catch {
            return null;
          }
        });
        
        const results = await Promise.all(randomRequests);
        pokemonList = results.filter(Boolean);
      }
      
      setExternalData(pokemonList); // Actualizar estado con los Pokémon obtenidos
    } catch (error) {
      setExternalError('Failed to load Pokémon data. Please try again.');
    } finally {
      setExternalLoading(false); // Desactivar estado de carga
    }
  };

  // Manejador para cambios en el campo de búsqueda de Pokémon
  // Implementa el sistema de sugerencias en tiempo real
  const handlePokemonSearchChange = (e) => {
    const value = e.target.value;
    setPokemonSearch(value);
    
    // Mostrar sugerencias solo si hay texto ingresado
    if (value.trim().length > 0) {
      // Filtrar Pokémon que coincidan con el texto ingresado
      const filtered = popularPokemon
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8); // Limitar a 8 sugerencias para mejor UX
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      // Limpiar sugerencias si no hay texto
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Función para seleccionar una sugerencia del dropdown
  const selectSuggestion = (suggestion) => {
    setPokemonSearch(suggestion); // Establecer el Pokémon seleccionado
    setShowSuggestions(false); // Ocultar el dropdown
    setSuggestions([]); // Limpiar la lista de sugerencias
  };

  // Manejador para los filtros de tipo de Pokémon
  const handleTypeFilter = (type) => {
    // Toggle: si el tipo ya está seleccionado, lo deselecciona
    setSelectedType(type === selectedType ? '' : type);
    setPokemonSearch(''); // Limpiar búsqueda por nombre al filtrar por tipo
    setShowSuggestions(false); // Ocultar sugerencias
  };

  // Effect para cargar datos cuando cambian los filtros o la pestaña activa
  useEffect(() => {
    if (activeTab === 'notes') {
      fetchNotes(); // Cargar notas si está en la pestaña de notas
    } else {
      fetchExternalData(); // Cargar Pokémon si está en la pestaña externa
    }
  }, [page, search, activeTab, pokemonSearch, selectedType]); // Dependencias que disparan la recarga

  // Función para crear una nueva nota
  const handleCreate = async (noteData) => {
    try {
      // Llamar al servicio de creación con archived: false por defecto
      await createNote({ ...noteData, archived: false });
      setShowModal(false); // Cerrar modal
      fetchNotes(); // Recargar lista de notas
    } catch (error) {
      // Propagar error con mensaje específico para manejo en el modal
      throw new Error(error.response?.data?.detail || 'Failed to create note');
    }
  };

  // Función para actualizar una nota existente
  const handleUpdate = async (id, noteData) => {
    try {
      await updateNote(id, noteData); // Llamar al servicio de actualización
      setEditingNote(null); // Limpiar nota en edición
      setShowModal(false); // Cerrar modal
      fetchNotes(); // Recargar lista de notas
    } catch (error) {
      // Propagar error con mensaje específico
      throw new Error(error.response?.data?.detail || 'Failed to update note');
    }
  };

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (note) => {
    setNoteToDelete(note); // Establecer nota a eliminar
    setShowDeleteModal(true); // Mostrar modal de confirmación
  };

  // Función para confirmar y ejecutar la eliminación de una nota
  const handleDelete = async () => {
    if (!noteToDelete) return; // Validar que hay una nota seleccionada
    
    try {
      await deleteNote(noteToDelete.id); // Llamar al servicio de eliminación
      setShowDeleteModal(false); // Cerrar modal
      setNoteToDelete(null); // Limpiar nota seleccionada
      fetchNotes(); // Recargar lista de notas
    } catch (error) {
      // Mostrar error al usuario mediante alert
      alert('Failed to delete note: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowDeleteModal(false); // Cerrar modal
    setNoteToDelete(null); // Limpiar nota seleccionada
  };

  // Función para abrir el modal de creación de nota
  const openCreateModal = () => {
    setEditingNote(null); // Asegurar que no hay nota en edición
    setShowModal(true); // Mostrar modal
  };

  // Función para abrir el modal de edición con una nota específica
  const openEditModal = (note) => {
    setEditingNote(note); // Establecer nota a editar
    setShowModal(true); // Mostrar modal
  };

  // Objeto de estilos CSS-in-JS para todos los componentes
  const styles = {
    // Contenedor principal de la aplicación
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    },
    // Header con título y toggle de modo oscuro
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px'
    },
    // Título principal de la aplicación
    headerTitle: {
      margin: 0,
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)'
    },
    // Contenedor de pestañas de navegación
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    },
    // Estilo base para pestañas
    tab: {
      padding: '12px 24px',
      margin: '0 5px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none'
    },
    // Estilo para pestaña activa
    activeTab: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    // Estilo para pestaña inactiva
    inactiveTab: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)'
    },
    // Contenedor de campo de búsqueda
    searchContainer: {
      marginBottom: '20px'
    },
    // Estilo para campos de entrada de texto
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    },
    // Estilo base para botones
    button: {
      padding: '12px 24px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none'
    },
    // Estilo para botones primarios (azul)
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    // Estilo para botones de peligro (rojo)
    dangerButton: {
      backgroundColor: '#dc3545',
      color: 'white'
    },
    // Grid responsivo para mostrar notas y Pokémon
    notesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    // Tarjeta individual para nota o Pokémon
    noteCard: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px var(--shadow)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    // Título de nota o Pokémon
    noteTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: 'var(--text-primary)'
    },
    // Contenido de nota o información de Pokémon
    noteContent: {
      color: 'var(--text-secondary)',
      marginBottom: '15px',
      lineHeight: '1.5'
    },
    // Estado vacío cuando no hay datos
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--text-secondary)'
    },
    // Controles de paginación
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '30px',
      gap: '10px'
    },
    // Contenedor de filtros de tipo
    typeFilters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px'
    },
    // Botones de filtro por tipo
    typeButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      textTransform: 'capitalize',
      transition: 'all 0.2s',
      outline: 'none'
    },
    // Caja de sugerencias dropdown
    suggestionBox: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderTop: 'none',
      borderRadius: '0 0 4px 4px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 2px 8px var(--shadow)'
    },
    // Elemento individual de sugerencia
    suggestionItem: {
      padding: '10px 12px',
      cursor: 'pointer',
      textTransform: 'capitalize',
      color: 'var(--text-primary)',
      transition: 'background-color 0.2s'
    }
  };

  // Renderizado del componente principal
  return (
    <div style={styles.container}>
      {/* Header con título y toggle de modo oscuro */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Notes App</h1>
        <DarkModeToggle />
      </div>
      
      {/* Navegación por pestañas */}
      <div style={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
          style={{
            ...styles.tab,
            ...(activeTab === 'notes' ? styles.activeTab : styles.inactiveTab)
          }}
        >
          My Notes
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'external'}
          onClick={() => setActiveTab('external')}
          style={{
            ...styles.tab,
            ...(activeTab === 'external' ? styles.activeTab : styles.inactiveTab)
          }}
        >
          Pokémon Data
        </button>
      </div>

      {/* Contenido condicional según la pestaña activa */}
      {activeTab === 'notes' ? (
        // Sección de gestión de notas
        <div>
          {/* Campo de búsqueda de notas */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Botón para crear nueva nota */}
          <button
            onClick={openCreateModal}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Create New Note
          </button>

          {/* Estados de carga y error para notas */}
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchNotes} />}

          {/* Estado vacío cuando no hay notas */}
          {!loading && !error && notes.length === 0 && (
            <div style={styles.emptyState}>
              <h3>No notes found</h3>
              <p>Create your first note to get started!</p>
            </div>
          )}

          {/* Grid de notas cuando hay datos */}
          {!loading && !error && notes.length > 0 && (
            <div style={styles.notesGrid}>
              {notes.map((note) => (
                <div key={note.id} style={styles.noteCard}>
                  {/* Título de la nota */}
                  <div style={styles.noteTitle}>{note.title}</div>
                  {/* Contenido de la nota */}
                  <div style={styles.noteContent}>{note.content}</div>
                  {/* Tags de la nota si existen */}
                  {note.tags && note.tags.length > 0 && (
                    <div style={{marginBottom: '10px'}}>
                      {note.tags.map((tag, index) => (
                        <span key={index} style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          marginRight: '5px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Botones de acción para cada nota */}
                  <div>
                    <button
                      onClick={() => openEditModal(note)}
                      style={{...styles.button, ...styles.primaryButton}}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(note)}
                      style={{...styles.button, ...styles.dangerButton}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controles de paginación */}
          {!loading && !error && (page > 1 || notes.length === 10) && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{...styles.button, backgroundColor: page === 1 ? '#ccc' : '#007bff', color: 'white'}}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={notes.length < 10}
                style={{...styles.button, backgroundColor: notes.length < 10 ? '#ccc' : '#007bff', color: 'white'}}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        // Sección de datos de Pokémon
        <div>
          {/* Campo de búsqueda de Pokémon con sugerencias */}
          <div style={styles.searchContainer}>
            <div style={{position: 'relative'}}>
              <input
                type="text"
                placeholder="Search Pokémon by name..."
                value={pokemonSearch}
                onChange={handlePokemonSearchChange}
                onFocus={() => pokemonSearch.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={styles.input}
              />
              {/* Dropdown de sugerencias */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={styles.suggestionBox}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      style={{
                        ...styles.suggestionItem,
                        borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Filtros por tipo de Pokémon */}
          <div style={{marginBottom: '20px'}}>
            <h3 style={{color: 'var(--text-primary)', marginBottom: '10px'}}>Filter by Type:</h3>
            <div style={styles.typeFilters}>
              {pokemonTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  style={{
                    ...styles.typeButton,
                    backgroundColor: selectedType === type ? getTypeColor(type) : 'var(--bg-tertiary)',
                    color: selectedType === type ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            {/* Botón para limpiar filtro activo */}
            {selectedType && (
              <button
                onClick={() => handleTypeFilter('')}
                style={{
                  ...styles.button,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  fontSize: '14px',
                  padding: '8px 16px'
                }}
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Estados de carga y error para Pokémon */}
          {externalLoading && <LoadingSpinner />}
          {externalError && <ErrorMessage message={externalError} onRetry={fetchExternalData} />}

          {/* Grid de Pokémon cuando hay datos */}
          {!externalLoading && !externalError && externalData.length > 0 && (
            <div>
              <h2>Pokémon Collection (PokéAPI)</h2>
              {/* Información contextual sobre los resultados */}
              <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>
                {selectedType ? 
                  `Showing ${selectedType.toUpperCase()} type Pokémon - ${externalData.length} found` :
                  pokemonSearch.trim() ? 
                    `Showing results for "${pokemonSearch}" - ${externalData.length} Pokémon found` : 
                    'Random Pokémon from the first generation'
                }
              </p>
              {/* Grid de tarjetas de Pokémon */}
              <div style={styles.notesGrid}>
                {externalData.map((pokemon) => (
                  <div key={pokemon.id} style={styles.noteCard}>
                    {/* Imagen del Pokémon */}
                    <div style={{textAlign: 'center', marginBottom: '15px'}}>
                      <img 
                        src={pokemon.sprites?.front_default} 
                        alt={pokemon.name}
                        style={{width: '96px', height: '96px'}}
                      />
                    </div>
                    {/* Nombre del Pokémon */}
                    <h3 style={{...styles.noteTitle, textAlign: 'center', textTransform: 'capitalize'}}>
                      {pokemon.name}
                    </h3>
                    {/* Número de Pokédex */}
                    <p style={{...styles.noteContent, textAlign: 'center'}}>
                      #{pokemon.id.toString().padStart(3, '0')}
                    </p>
                    {/* Estadísticas físicas */}
                    <p style={styles.noteContent}>
                      Height: {pokemon.height / 10} m | Weight: {pokemon.weight / 10} kg
                    </p>
                    {/* Tipos del Pokémon con colores */}
                    <div style={{marginBottom: '10px'}}>
                      <strong>Types: </strong>
                      {pokemon.types?.map((type, index) => (
                        <span key={index} style={{
                          marginRight: '5px', 
                          textTransform: 'capitalize', 
                          backgroundColor: getTypeColor(type.type.name), 
                          color: 'white',
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                    {/* Habilidades del Pokémon */}
                    <div>
                      <strong>Abilities: </strong>
                      <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>
                        {pokemon.abilities?.slice(0, 2).map((ability, index) => (
                          <span key={index} style={{marginRight: '8px', textTransform: 'capitalize'}}>
                            {ability.ability.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar notas */}
      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={editingNote ? (data) => handleUpdate(editingNote.id, data) : handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de confirmación para eliminar notas */}
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        noteTitle={noteToDelete?.title || ''}
      />
    </div>
  );
}

export default App;