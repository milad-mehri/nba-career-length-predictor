import React from 'react';

const PlayerCard = ({ player }) => (
  <div className="card w-96 bg-base-100 shadow-xl image-full">
    <div className="card-body">
      <h2 className="card-title">{player.PlayerName}</h2>
      <p>Years Played: {player.YEARS_PLAYED}</p>
      <p>Predicted Career Length: {player.Predicted_Career_Length}</p>
    </div>
  </div>
);

export default PlayerCard;