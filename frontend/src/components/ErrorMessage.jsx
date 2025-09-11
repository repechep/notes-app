// Componente para mostrar mensajes de error con opción de reintentar
function ErrorMessage({ message, onRetry }) {
  // Estilos para el componente de error
  const styles = {
    container: {
      backgroundColor: '#f8d7da',    // Fondo rojo claro para errores
      color: '#721c24',              // Texto rojo oscuro
      padding: '16px',
      borderRadius: '4px',
      border: '1px solid #f5c6cb',   // Borde rojo claro
      margin: '20px 0',
      textAlign: 'center'
    },
    message: {
      marginBottom: '12px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#dc3545',    // Botón rojo
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      outline: 'none'
    },
    buttonFocus: {
      boxShadow: '0 0 0 3px rgba(220, 53, 69, 0.25)'  // Sombra de foco accesible
    }
  };

  return (
    <div style={styles.container} role="alert" aria-live="assertive">
      {/* Mensaje de error */}
      <div style={styles.message}>{message}</div>
      {/* Botón de reintentar (solo si se proporciona la función) */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={styles.button}
          onFocus={(e) => e.target.style.boxShadow = styles.buttonFocus.boxShadow}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
          aria-label="Retry loading"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;