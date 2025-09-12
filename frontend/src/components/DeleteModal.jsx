// Modal de confirmación para eliminar notas
function DeleteModal({ isOpen, onConfirm, onCancel, noteTitle }) {
  if (!isOpen) return null;

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
      backgroundColor: 'var(--bg-secondary)',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px var(--shadow)',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: 'var(--text-primary)'
    },
    message: {
      fontSize: '16px',
      marginBottom: '25px',
      color: 'var(--text-secondary)',
      lineHeight: '1.5'
    },
    noteTitle: {
      fontWeight: 'bold',
      color: 'var(--text-primary)'
    },
    buttons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.2s'
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white'
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white'
    }
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Delete Note</h3>
        <p style={styles.message}>
          Are you sure you want to delete <span style={styles.noteTitle}>"{noteTitle}"</span>?
          <br />
          This action cannot be undone.
        </p>
        <div style={styles.buttons}>
          <button
            onClick={onCancel}
            style={{...styles.button, ...styles.cancelButton}}
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{...styles.button, ...styles.deleteButton}}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;