# 📋 Guía de Instalación - Notes App

## 🚀 Instalación Rápida

### Opción 1: Docker (Recomendado)
```bash
git clone https://github.com/TU_USUARIO/notes-app.git
cd notes-app
docker-compose up --build
```

### Opción 2: Configuración Automática
```bash
git clone https://github.com/TU_USUARIO/notes-app.git
cd notes-app

# Linux/Mac
chmod +x setup.sh
./setup.sh

# Windows
setup.bat
```

## 🛠️ Instalación Manual

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- npm o yarn

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuración

### Variables de Entorno
1. Copia `.env.example` a `.env`
2. Ajusta las variables según tu entorno

### Base de Datos
- SQLite se crea automáticamente
- Auto-seed con datos de ejemplo

## ✅ Verificación

Después de la instalación, verifica que funcione:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🐛 Solución de Problemas

### Puerto ocupado
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "3001:3000"  # Frontend
  - "8001:8000"  # Backend
```

### Permisos en Linux/Mac
```bash
chmod +x setup.sh
sudo chown -R $USER:$USER .
```

### Limpiar instalación
```bash
make clean
docker-compose down -v
```