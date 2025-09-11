// Componente para alternar entre modo claro y oscuro
import { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const styles = {
    toggle: {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '34px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      outline: 'none'
    },
    slider: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#4f46e5' : '#cbd5e1',
      borderRadius: '34px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isDark ? 'flex-end' : 'flex-start',
      padding: '2px'
    },
    circle: {
      width: '30px',
      height: '30px',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={styles.toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div style={styles.slider}>
        <div style={styles.circle}>
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
}

export default DarkModeToggle;