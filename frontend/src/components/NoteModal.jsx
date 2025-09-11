// Importar hooks necesarios de React
import { useState, useEffect, useRef } from 'react';

// Componente modal para crear y editar notas
function NoteModal({ note, onSave, onClose }) {
  // Estados para los campos del formulario
  const [title, setTitle] = useState('');     // Título de la nota
  const [content, setContent] = useState(''); // Contenido de la nota
  const [tags, setTags] = useState('');       // Tags como string separado por comas
  const [loading, setLoading] = useState(false); // Estado de carga al guardar
  const [error, setError] = useState(null);      // Errores del formulario
  
  // Referencias para manejo de foco y accesibilidad
  const modalRef = useRef(null);      // Referencia al modal para trap focus
  const titleInputRef = useRef(null); // Referencia al input de título para foco inicial

  // Efecto para inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (note) {
      // Si hay una nota (modo edición), llenar los campos
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags?.join(', ') || ''); // Convertir array a string
    } else {
      // Si no hay nota (modo creación), limpiar los campos
      setTitle('');
      setContent('');
      setTags('');
    }
    setError(null); // Limpiar errores previos
    
    // Enfocar el primer campo para accesibilidad
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
    
    // Trap focus in modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [note, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await onSave(noteData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      outline: 'none'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '4px',
      color: '#333'
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      outline: 'none'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      minHeight: '120px',
      resize: 'vertical',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#007bff',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
    },
    error: {
      color: '#dc3545',
      fontSize: '14px',
      marginTop: '4px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: 'white'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  return (
    <div 
      style={styles.overlay} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} style={styles.modal}>
        <div style={styles.header}>
          <h2 id="modal-title" style={styles.title}>
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close modal"
            onFocus={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="note-title" style={styles.label}>
              Title *
            </label>
            <input
              ref={titleInputRef}
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
              }}
              aria-describedby="title-help"
            />
            <small id="title-help" style={{ fontSize: '12px', color: '#666' }}>
              {title.length}/120 characters
            </small>
          </div>

          <div>
            <label htmlFor="note-content" style={styles.label}>
              Content *
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={10000}
              required
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
              }}
              aria-describedby="content-help"
            />
            <small id="content-help" style={{ fontSize: '12px', color: '#666' }}>
              {content.length}/10,000 characters
            </small>
          </div>

          <div>
            <label htmlFor="note-tags" style={styles.label}>
              Tags (comma separated)
            </label>
            <input
              id="note-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={styles.input}
              placeholder="tag1, tag2, tag3..."
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
              }}
              aria-describedby="tags-help"
            />
            <small id="tags-help" style={{ fontSize: '12px', color: '#666' }}>
              Maximum 10 tags, each up to 50 characters
            </small>
          </div>

          {error && (
            <div style={styles.error} role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              style={{...styles.button, ...styles.secondaryButton}}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
              aria-describedby={loading ? 'loading-status' : undefined}
            >
              {loading ? 'Saving...' : (note ? 'Update' : 'Create')}
            </button>
            {loading && (
              <span id="loading-status" className="sr-only">
                Saving note, please wait
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;