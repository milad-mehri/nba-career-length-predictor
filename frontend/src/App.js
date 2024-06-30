import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import PlayerCard from './components/PlayerCard';
import './index.css'; // Ensure Tailwind CSS is imported

function App() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Parse CSV file
        Papa.parse('/data/current_players_with_predictions.csv', {
            download: true,
            header: true,
            complete: (results) => {
                setPlayers(results.data);
            },
        });
    }, []);

    return (
        <div className="App p-5">
            <h1 className="text-3xl font-bold mb-5">NBA Career Length Predictor</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map(player => (
                    <PlayerCard key={player.PLAYER_ID} player={player} />
                ))}
            </div>
        </div>
    );
}

export default App;