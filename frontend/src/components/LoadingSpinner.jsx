// Componente para mostrar indicador de carga con animación
function LoadingSpinner() {
  // Estilos para el componente de carga
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      flexDirection: 'column'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',      // Borde gris claro
      borderTop: '4px solid #007bff',   // Borde superior azul para animación
      borderRadius: '50%',              // Hacer círculo perfecto
      animation: 'spin 1s linear infinite'  // Animación de rotación continua
    },
    text: {
      marginTop: '16px',
      color: '#666',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container} role="status" aria-live="polite">
      {/* Spinner animado (oculto para lectores de pantalla) */}
      <div style={styles.spinner} aria-hidden="true"></div>
      {/* Texto visible de carga */}
      <div style={styles.text}>Loading...</div>
      {/* Texto para lectores de pantalla */}
      <span className="sr-only">Loading content, please wait</span>
      {/* Definir animación CSS inline */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;