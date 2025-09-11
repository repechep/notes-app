// Importar hooks de React y servicios de API externa
import { useEffect, useState } from "react";
import { getExternalData } from "../services/api";

// Componente para mostrar datos de PokéAPI
export default function External() {
  // Estados para almacenar datos de PokéAPI
  const [pokemon, setPokemon] = useState(null);    // Datos de Pokémon desde PokéAPI
  const [loading, setLoading] = useState(true);    // Estado de carga

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener datos de PokéAPI
    const fetchData = async () => {
      try {
        // Obtener datos de Pokémon
        const pokemonData = await getExternalData();
        // Actualizar estado con los datos obtenidos
        setPokemon(pokemonData);
      } catch (error) {
        console.error('Error fetching external data:', error);
      } finally {
        setLoading(false);  // Finalizar estado de carga
      }
    };

    fetchData();  // Ejecutar la función de carga
  }, []);  // Solo ejecutar una vez al montar

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading external data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Datos de Pokémon desde API externa */}
      {pokemon && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Pokémon Data (PokéAPI)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen y datos básicos del Pokémon */}
            <div className="text-center">
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name}
                className="mx-auto mb-4 w-32 h-32"
              />
              <h3 className="text-2xl font-bold capitalize text-gray-900">{pokemon.name}</h3>
              <p className="text-gray-600">Height: {pokemon.height / 10} m | Weight: {pokemon.weight / 10} kg</p>
            </div>
            {/* Habilidades y tipos del Pokémon */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Abilities:</h4>
              <div className="space-y-2">
                {/* Mapear y mostrar cada habilidad */}
                {pokemon.abilities.map((ability, index) => (
                  <div key={index} className="bg-blue-100 px-3 py-2 rounded-lg">
                    <span className="font-medium capitalize">{ability.ability.name}</span>
                    {/* Indicar si es habilidad oculta */}
                    {ability.is_hidden && <span className="text-xs text-blue-600 ml-2">(Hidden)</span>}
                  </div>
                ))}
              </div>
              <h4 className="text-lg font-semibold mt-4 mb-3">Types:</h4>
              <div className="flex gap-2">
                {/* Mapear y mostrar cada tipo */}
                {pokemon.types.map((type, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}