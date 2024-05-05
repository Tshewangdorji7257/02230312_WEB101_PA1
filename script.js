// fetches data of all Pokémon from the PokeAPI
async function getAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    const data = await response.json();
    return data.results;
}

// Displays the list of Pokémon on the webpage
function displayPokemonList(pokemonList) {
    const pokemonListContainer = document.getElementById('pokemonList');
    
    // generates HTML for the list of Pokémon
    pokemonListContainer.innerHTML = `
        <ul class="pokemon-list">
            ${pokemonList.map(pokemon => `
                <li class="pokemon-item" data-name="${pokemon.name}">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" alt="${pokemon.name}">
                    <span>${pokemon.name}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

// fetches data of a specific Pokémon from the PokeAPI
async function getPokemonData(pokemonNameOrId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);
        
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error fetching Pokemon data: ${error.message}`);
    }
}

// Displays detailed information of a Pokémon on the webpage
function displayPokemonData(pokemon) {
    // Hide the search elements
    document.querySelector('h1').style.display = 'none';
    document.querySelector('h2').style.display = 'none';
    document.querySelector('img').style.display = 'none';
    document.getElementById('pokemonInput').style.display = 'none';
    document.getElementById('searchButton').style.display = 'none';

    // Display the Pokémon details
    document.getElementById('pokemonData').innerHTML = `
        <h4>${pokemon.name}</h4>
        
        <div class="pokemon-details">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
            
            <div class="pokemon-info">
                <section class="pokemon-section about-section">
                    <h3>About</h3>
                    <table id="aboutTable" style="display: none;">
                        <tr>
                            <td>Type</td>
                            <td>${pokemon.types.map(type => type.type.name).join(', ')}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>${pokemon.height / 10}m</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>${pokemon.weight / 10}kg</td>
                        </tr>
                    </table>
                </section>

                <section class="pokemon-section stats-section">
                    <h3>Basic Stats</h3>
                    <table id="statsTable" style="display: none;">
                        ${pokemon.stats.map(stat => `
                            <tr>
                                <td>${stat.stat.name}</td>
                                <td>${stat.base_stat}</td>
                            </tr>
                        `).join('')}
                    </table>
                </section>

                <section class="pokemon-section moves-section">
                    <h3>Moves</h3>
                    <table id="movesTable" style="display: none;">
                        ${pokemon.moves.slice(0, 5).map(move => `
                            <tr>
                                <td>${move.move.name}</td>
                            </tr>
                        `).join('')}
                    </table>
                </section>
            </div>
        </div>
        
        <button id="backButton">Back to Home</button>
    `;
    
    // Add event listener for the back button
    document.getElementById('backButton').addEventListener('click', () => {
        location.reload(); // Reloads the page to go back to the initial state
    });
    
    // Add event listeners to show/hide tables when clicked
    document.querySelectorAll('.pokemon-section').forEach(section => {
        section.addEventListener('click', () => {
            // Hide all tables first
            document.querySelectorAll('.pokemon-section table').forEach(table => {
                table.style.display = 'none';
            });
            
            // Show the clicked table
            const table = section.querySelector('table');
            table.style.display = 'table';
        });
    });
}

// Event listener for the search button click
document.getElementById('searchButton').addEventListener('click', async () => {
    await searchPokemon(); // Calls the searchPokemon function 
});

// Event listener for the enter key press in the search input field
document.getElementById('pokemonInput').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        await searchPokemon(); // Calls the searchPokemon function 
    }
});

// searches for a Pokémon based on user input
async function searchPokemon() {
    const pokemonNameOrId = document.getElementById('pokemonInput').value.toLowerCase();
    
    if (pokemonNameOrId.trim() === '') {
        console.error('Please enter a Pokémon name or ID.');
        return;
    }

    try {
        const pokemon = await getPokemonData(pokemonNameOrId);
        displayPokemonData(pokemon); // Displays the data of the found Pokémon
    } catch (error) {
        console.error(error.message); // Logs any errors that occur during the search
    }
}

// Event listener for when the window finishes loading
window.addEventListener('load', async () => {
    try {
        const pokemonList = await getAllPokemon(); // Fetches the list of all Pokémon
        displayPokemonList(pokemonList); // Displays the list of Pokémon on the webpage
        
        // Adds event listeners to each Pokémon item in the list
        document.querySelectorAll('.pokemon-item').forEach(item => {
            item.addEventListener('click', async () => {
                const pokemonName = item.getAttribute('data-name');
                try {
                    const pokemon = await getPokemonData(pokemonName);
                    displayPokemonData(pokemon); // Displays detailed information of the clicked Pokémon
                } catch (error) {
                    console.error(error.message); // Logs any errors that occur during the process
                }
            });
        });
    } catch (error) {
        console.error('Error fetching Pokémon list:', error.message); // Logs any errors that occur during the process
    }
});
