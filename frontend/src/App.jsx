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

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');
  const [externalData, setExternalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState(null);
  const [pokemonSearch, setPokemonSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

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

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotes({ page, per_page: 10, search });
      setNotes(response.items || response.data || response || []);
    } catch (error) {
      console.error('Fetch notes error:', error);
      setError(`Failed to load notes: ${error.message || 'Please try again.'}`);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonByType = async (type) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!response.ok) return [];
      
      const typeData = await response.json();
      const pokemonList = typeData.pokemon.slice(0, 20).map(p => p.pokemon.name);
      
      const requests = pokemonList.map(async (name) => {
        try {
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return pokemonResponse.ok ? await pokemonResponse.json() : null;
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(requests);
      return results.filter(Boolean);
    } catch {
      return [];
    }
  };

  const fetchExternalData = async () => {
    setExternalLoading(true);
    setExternalError(null);
    try {
      let pokemonList = [];
      
      if (selectedType) {
        pokemonList = await fetchPokemonByType(selectedType);
      } else if (pokemonSearch.trim()) {
        const searchTerm = pokemonSearch.toLowerCase().trim();
        
        const matches = popularPokemon.filter(name => 
          name.includes(searchTerm) || searchTerm.includes(name.substring(0, 3))
        );
        
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
        
        if (pokemonList.length === 0) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (response.ok) {
              const pokemon = await response.json();
              pokemonList = [pokemon];
            }
          } catch {
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
      } else {
        const randomRequests = Array.from({ length: 12 }, async () => {
          const randomId = Math.floor(Math.random() * 150) + 1;
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
      
      setExternalData(pokemonList);
    } catch (error) {
      setExternalError('Failed to load Pokémon data. Please try again.');
    } finally {
      setExternalLoading(false);
    }
  };

  const handlePokemonSearchChange = (e) => {
    const value = e.target.value;
    setPokemonSearch(value);
    
    if (value.trim().length > 0) {
      const filtered = popularPokemon
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setPokemonSearch(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type === selectedType ? '' : type);
    setPokemonSearch('');
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (activeTab === 'notes') {
      fetchNotes();
    } else {
      fetchExternalData();
    }
  }, [page, search, activeTab, pokemonSearch, selectedType]);

  const handleCreate = async (noteData) => {
    try {
      await createNote({ ...noteData, archived: false });
      setShowModal(false);
      setActiveTab('notes'); // Asegurar que regrese al tab de notas
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
      setActiveTab('notes'); // Asegurar que regrese al tab de notas
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
    },
    typeFilters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px'
    },
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
    suggestionItem: {
      padding: '10px 12px',
      cursor: 'pointer',
      textTransform: 'capitalize',
      color: 'var(--text-primary)',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Notes App</h1>
        <DarkModeToggle />
      </div>
      
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
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            onClick={openCreateModal}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Create New Note
          </button>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchNotes} />}

          {!loading && !error && notes.length === 0 && (
            <div style={styles.emptyState}>
              <h3>No notes found</h3>
              <p>Create your first note to get started!</p>
            </div>
          )}

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

          {externalLoading && <LoadingSpinner />}
          {externalError && <ErrorMessage message={externalError} onRetry={fetchExternalData} />}

          {!externalLoading && !externalError && externalData.length > 0 && (
            <div>
              <h2>Pokémon Collection (PokéAPI)</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>
                {selectedType ? 
                  `Showing ${selectedType.toUpperCase()} type Pokémon - ${externalData.length} found` :
                  pokemonSearch.trim() ? 
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

      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={editingNote ? (data) => handleUpdate(editingNote.id, data) : handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}

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