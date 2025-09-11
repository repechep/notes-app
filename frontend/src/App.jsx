// Importar hooks de React y componentes necesarios
import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './services/api';
import NoteModal from './components/NoteModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  // Estados para manejar las notas y la interfaz
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');
  const [externalData, setExternalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Estados para manejar carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

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

  // Función para obtener datos de API externa (GitHub)
  const fetchExternalData = async () => {
    setExternalLoading(true);
    setExternalError(null);
    try {
      const response = await fetch('https://api.github.com/repos/microsoft/vscode/issues?state=open&per_page=10');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setExternalData(data);
    } catch (error) {
      setExternalError('Failed to load external data. Please try again.');
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
  }, [page, search, activeTab]);

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (error) {
      alert('Failed to delete note: ' + (error.response?.data?.detail || error.message));
    }
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
      marginBottom: '30px',
      role: 'tablist'
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
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
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
    sortContainer: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
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
          GitHub Issues
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
                      onClick={() => handleDelete(note.id)}
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
          {!loading && !error && notes.length > 0 && (
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
                style={{...styles.button, ...styles.primaryButton}}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Loading State */}
          {externalLoading && <LoadingSpinner />}

          {/* Error State */}
          {externalError && <ErrorMessage message={externalError} onRetry={fetchExternalData} />}

          {/* External Data */}
          {!externalLoading && !externalError && (
            <div>
              <h2>VS Code Issues (GitHub API)</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '20px'}}>
                Latest open issues from the VS Code repository
              </p>
              {externalData.map((issue) => (
                <div key={issue.id} style={styles.noteCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                    <h3 style={styles.noteTitle}>{issue.title}</h3>
                    <span style={{
                      backgroundColor: issue.state === 'open' ? '#28a745' : '#6c757d',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {issue.state}
                    </span>
                  </div>
                  <p style={styles.noteContent}>
                    {issue.body ? issue.body.substring(0, 200) + '...' : 'No description available'}
                  </p>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px'}}>
                    {issue.labels?.slice(0, 3).map((label) => (
                      <span key={label.id} style={{
                        backgroundColor: `#${label.color}`,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}>
                        {label.name}
                      </span>
                    ))}
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <small style={{color: 'var(--text-muted)'}}>
                      #{issue.number} by {issue.user.login}
                    </small>
                    <a 
                      href={issue.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontSize: '12px'
                      }}
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              ))}
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
    </div>
  );
}

export default App;