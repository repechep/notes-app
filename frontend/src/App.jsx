// Importar hooks de React y componentes necesarios
import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './services/api';
import NoteModal from './components/NoteModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import DarkModeToggle from './components/DarkModeToggle';
import DeleteModal from './components/DeleteModal';

// Función para obtener colores de tipos de Pokémon
const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  return colors[type] || '#68A090';
};

function App() {
  // Estados para manejar las notas y la interfaz
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');
  const [externalData, setExternalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  
  // Estados para manejar carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState(null);
  const [pokemonSearch, setPokemonSearch] = useState('');
  // Función para obtener notas del backend
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotes({ page, per_page: 10, search });
      setNotes(response.data);
    } catch (error) {
      setError('Failed to load notes. Please try again.');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener datos de API externa (PokéAPI)
  const fetchExternalData = async () => {
    setExternalLoading(true);
    setExternalError(null);
    try {
      if (pokemonSearch.trim()) {
        const searchTerm = pokemonSearch.toLowerCase().trim();
        const pokemonList = [];
        
        // Lista de Pokémon populares para sugerencias
        const popularPokemon = [
          'pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam', 'gengar',
          'dragonite', 'mewtwo', 'mew', 'gyarados', 'lapras', 'eevee', 'vaporeon',
          'jolteon', 'flareon', 'snorlax', 'articuno', 'zapdos', 'moltres'
        ];
        
        // Buscar coincidencias parciales
        const matches = popularPokemon.filter(name => 
          name.includes(searchTerm) || searchTerm.includes(name.substring(0, 3))
        );
        
        // Si hay coincidencias, buscar esos Pokémon
        if (matches.length > 0) {
          for (const pokemonName of matches.slice(0, 8)) {
            try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
              if (response.ok) {
                const pokemon = await response.json();
                pokemonList.push(pokemon);
              }
            } catch (err) {
              console.log(`Error fetching ${pokemonName}:`, err);
            }
          }
        }
        
        // Si no hay coincidencias, intentar búsqueda exacta
        if (pokemonList.length === 0) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (response.ok) {
              const pokemon = await response.json();
              pokemonList.push(pokemon);
            }
          } catch (err) {
            // Si no encuentra nada, mostrar algunos aleatorios como sugerencia
            for (let i = 0; i < 6; i++) {
              const randomId = Math.floor(Math.random() * 150) + 1;
              try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                if (response.ok) {
                  const pokemon = await response.json();
                  pokemonList.push(pokemon);
                }
              } catch (randomErr) {
                console.log('Error fetching random pokemon:', randomErr);
              }
            }
          }
        }
        
        setExternalData(pokemonList);
      } else {
        // Obtener 12 Pokémon aleatorios
        const pokemonList = [];
        for (let i = 0; i < 12; i++) {
          const randomId = Math.floor(Math.random() * 150) + 1;
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          if (response.ok) {
            const pokemon = await response.json();
            pokemonList.push(pokemon);
          }
        }
        setExternalData(pokemonList);
      }
    } catch (error) {
      setExternalError('Failed to load Pokémon data. Please try again.');
      console.error('Error fetching external data:', error);
    } finally {
      setExternalLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambian los parámetros
  useEffect(() => {
    if (activeTab === 'notes') {
      fetchNotes();
    } else {
      fetchExternalData();
    }
  }, [page, search, activeTab, pokemonSearch]);

  // Función para crear una nueva nota
  const handleCreate = async (noteData) => {
    try {
      await createNote({ ...noteData, archived: false });
      setShowModal(false);
      fetchNotes();
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create note');
    }
  };

  const handleUpdate = async (id, noteData) => {
    try {
      await updateNote(id, noteData);
      setEditingNote(null);
      setShowModal(false);
      fetchNotes();
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update note');
    }
  };

  const openDeleteModal = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteNote(noteToDelete.id);
      setShowDeleteModal(false);
      setNoteToDelete(null);
      fetchNotes();
    } catch (error) {
      alert('Failed to delete note: ' + (error.response?.data?.detail || error.message));
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px'
    },
    headerTitle: {
      margin: 0,
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    },
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
    activeTab: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    inactiveTab: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)'
    },
    searchContainer: {
      marginBottom: '20px'
    },
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
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    dangerButton: {
      backgroundColor: '#dc3545',
      color: 'white'
    },
    notesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    noteCard: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px var(--shadow)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    noteTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: 'var(--text-primary)'
    },
    noteContent: {
      color: 'var(--text-secondary)',
      marginBottom: '15px',
      lineHeight: '1.5'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--text-secondary)'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '30px',
      gap: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Notes App</h1>
        <DarkModeToggle />
      </div>
      
      {/* Tabs */}
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

      {activeTab === 'notes' ? (
        <div>
          {/* Search */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Create Button */}
          <button
            onClick={openCreateModal}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Create New Note
          </button>

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && <ErrorMessage message={error} onRetry={fetchNotes} />}

          {/* Empty State */}
          {!loading && !error && notes.length === 0 && (
            <div style={styles.emptyState}>
              <h3>No notes found</h3>
              <p>Create your first note to get started!</p>
            </div>
          )}

          {/* Notes Grid */}
          {!loading && !error && notes.length > 0 && (
            <div style={styles.notesGrid}>
              {notes.map((note) => (
                <div key={note.id} style={styles.noteCard}>
                  <div style={styles.noteTitle}>{note.title}</div>
                  <div style={styles.noteContent}>{note.content}</div>
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

          {/* Pagination */}
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
        <div>
          {/* Pokémon Search */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search Pokémon (e.g., pika, char, dragon)..."
              value={pokemonSearch}
              onChange={(e) => setPokemonSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Loading State */}
          {externalLoading && <LoadingSpinner />}

          {/* Error State */}
          {externalError && <ErrorMessage message={externalError} onRetry={fetchExternalData} />}

          {/* External Data */}
          {!externalLoading && !externalError && externalData.length > 0 && (
            <div>
              <h2>Pokémon Collection (PokéAPI)</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>
                {pokemonSearch.trim() ? 
                  `Showing results for "${pokemonSearch}" - ${externalData.length} Pokémon found` : 
                  'Random Pokémon from the first generation'
                }
              </p>
              <div style={styles.notesGrid}>
                {externalData.map((pokemon) => (
                  <div key={pokemon.id} style={styles.noteCard}>
                    <div style={{textAlign: 'center', marginBottom: '15px'}}>
                      <img 
                        src={pokemon.sprites?.front_default} 
                        alt={pokemon.name}
                        style={{width: '96px', height: '96px'}}
                      />
                    </div>
                    <h3 style={{...styles.noteTitle, textAlign: 'center', textTransform: 'capitalize'}}>
                      {pokemon.name}
                    </h3>
                    <p style={{...styles.noteContent, textAlign: 'center'}}>
                      #{pokemon.id.toString().padStart(3, '0')}
                    </p>
                    <p style={styles.noteContent}>
                      Height: {pokemon.height / 10} m | Weight: {pokemon.weight / 10} kg
                    </p>
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

      {/* Modal */}
      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={editingNote ? (data) => handleUpdate(editingNote.id, data) : handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Modal */}
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