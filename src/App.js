import './App.css';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// HTTP Request to get the list of all the existing Pokémon
const fetchAllPokemon = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
    return response.data.results;
};

// HTTP Request to get the searched Pokémon
const fetchPokemon = async (nameOrId) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    return response.data; // Retorna os dados do Pokémon
};

function App() {
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState(''); // Stores the searched name
    const [tempSearch, setTempSearch] = useState('') // Stores the value in the input
    const [pokemonId, setPokemonId] = useState(null); // Stores the current Pokémon ID

    // Indicates if the query is refetched by search or previous/next buttons
    const [manualSearch, setManualSearch] = useState(true);

    // Stores the error message if no match is found in the Pokémon list
    const [errorMessage, setErrorMessage] = useState('');

    // Query to get all Pokémon
    const { data: allPokemon } = useQuery({
        queryKey: ['allPokemon'],
        queryFn: fetchAllPokemon,
    });

    // Query to get the Pokémon either using its ID or the inputted name
    const { data: pokemon, error, isLoading, refetch } = useQuery({
        queryKey: ['pokemon', manualSearch ? searchTerm : pokemonId],
        queryFn: () => fetchPokemon(manualSearch ? searchTerm.toLowerCase() : pokemonId),
        enabled: false,
        retry: 1,
    });

    // Handles the Search button: sets the search name and type

    const handleSearch = () => {
        setManualSearch(true);
        setSearchTerm(tempSearch);
    }

    // Handles the Next button: sets the Pokémon ID and search type
    const handleNext = () => {
        if (pokemon) {
            setPokemonId(pokemon.id + 1);
            setManualSearch(false);
        }
    };

    // Handles the Previous button: sets the Pokémon ID and search type
    const handlePrevious = () => {
        if (pokemon && pokemon.id > 1) {
            setPokemonId(pokemon.id - 1);
            setManualSearch(false);
        }
    };

    // Code to be executed if certain conditions are met
    React.useEffect(() => {
        // Refetch the query to get a Pokémon on name or id change
        if (searchTerm || pokemonId) {
            refetch();
        }

        // Prefetch the Pokémon with given ID
        const prefetchPokemon = (id) => {
            if(id > 0) {
                queryClient.prefetchQuery({
                    queryKey: ['pokemon', id],
                    queryFn: () => fetchPokemon(id)
                });
            }
        };

        // Prefetches the previous and next Pokémon (by ID) when a Pokémon is searched
        if (pokemon) {
            if (pokemon.id > 1) {
                prefetchPokemon(pokemon.id - 1);
                prefetchPokemon(pokemon.id + 1);
            }
            else if(pokemon.id === 1) { // Case where the ID bottom limit is reached
                prefetchPokemon(2);
            }
        }

        // Prefetches the previous and next Pokémon (by ID) when the Previous/Next buttons are used
        if (pokemonId) {
            if (pokemonId > 1) {
                prefetchPokemon(pokemonId - 1);
                prefetchPokemon(pokemonId + 1);
            }
            else if(pokemonId === 1) { // Case where the ID bottom limit is reached
                prefetchPokemon(2);
            }
        }
    }, [refetch, searchTerm, pokemonId, pokemon, queryClient]);

    // Attemps to find a Pokémon by searching the Pokémon list
    // Sets the error message if incapable
    React.useEffect(() => {
        if (error && searchTerm) {
            const matchedPokemon = allPokemon?.find(p => p.name.startsWith(searchTerm.toLowerCase()));
            if (matchedPokemon) {
                setSearchTerm(matchedPokemon.name);
            }
            else {
                setErrorMessage(`Couldn't find "${searchTerm}"`)
            }
        }
    }, [error, searchTerm, allPokemon]);

    return (
        <div className="App">
            <div className="block">
                <div className="title-container">
                    <h1 className="title">Search a</h1>
                    <img className="title-image" alt="pokémon" src="https://i.pinimg.com/originals/34/c1/e5/34c1e5d371d64a581b1902ec5c4509f4.png"/>
                </div>
                <div className="search-container">
                    <input
                        className="search-bar"
                        type="text"
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        placeholder="Enter the Pokémon name"
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>

                {isLoading &&
                    <div className="loading-container">
                        <span>Loading...</span>
                    </div>
                }
                {error &&
                    <div className="error-container">
                        <span>Couldn't find {searchTerm || pokemonId}</span>
                    </div>
                }

                {errorMessage &&
                    <div className="error-container">
                        <span>{errorMessage}</span>
                    </div>
                }

                {pokemon && (
                    <div className="pokemon-container">
                        <div className="pokemon-info-general">
                            <img className="pokemon-image" src={pokemon.sprites.front_default} alt={pokemon.name}/>
                            <div className="pokemon-info">
                                <span className="pokemon-name">
                                    <span id="name">Name: </span>
                                    {pokemon.name}
                                </span>
                                <span className="pokemon-id">
                                    <span id="id">#Id: </span>
                                    {pokemon.id}</span>
                            </div>
                        </div>
                        <div className="pokemon-buttons">
                            <button className="pokemon-button-previous" onClick={handlePrevious}>Previous</button>
                            <button className="pokemon-button-next" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
