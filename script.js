document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const sortOptions = document.getElementById('sort-options');
    const statusFilter = document.getElementById('status-filter');
    const playerList = document.getElementById('player-list');
    const playerContainer = document.getElementById('player-container');
    const loadingContainer = document.getElementById('loading');
    const firstPageButton = document.getElementById('first-page');
    const placeholderImage = 'https://via.placeholder.com/50';
    const itemsPerPage = 50;
    let currentPage = 1;
    let currentPlayers = [];

    fetch('./data/players_combined.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(players => {
            currentPlayers = players;
            sortAndDisplayPlayers();

            searchBar.addEventListener('input', () => {
                const searchTerm = searchBar.value.toLowerCase();
                filterAndDisplayPlayers(searchTerm, statusFilter.value);
            });

            sortOptions.addEventListener('change', () => {
                currentPage = 1;
                sortAndDisplayPlayers();
            });

            statusFilter.addEventListener('change', () => {
                currentPage = 1;
                filterAndDisplayPlayers(searchBar.value.toLowerCase(), statusFilter.value);
            });

            document.getElementById('next-page').addEventListener('click', () => {
                if ((currentPage * itemsPerPage) < currentPlayers.length) {
                    currentPage++;
                    displayPlayers(currentPlayers, currentPage);
                }
            });

            document.getElementById('prev-page').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayPlayers(currentPlayers, currentPage);
                }
            });

            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                displayPlayers(currentPlayers, currentPage);
            });
        })
        .catch(error => console.error('Error fetching player data:', error))
        .finally(() => {
            loadingContainer.classList.add('hidden');
          loadingContainer.classList.remove('loading-container');

            playerContainer.classList.remove('hidden');
        });

    function filterAndDisplayPlayers(searchTerm, status) {
        currentPlayers = players.filter(player => {
            const matchesSearchTerm = player.full_name.toLowerCase().includes(searchTerm);
            const matchesStatus = (status === 'all') || (status === 'active' && player.is_active) || (status === 'inactive' && !player.is_active);
            return matchesSearchTerm && matchesStatus;
        });
        currentPage = 1;
        sortAndDisplayPlayers();
    }

    function sortAndDisplayPlayers() {
        const sortValue = sortOptions.value;
        if (sortValue === 'ppg') {
            currentPlayers.sort((a, b) => b.PPG - a.PPG);
        } else if (sortValue === 'apg') {
            currentPlayers.sort((a, b) => b.APG - a.APG);
        } else if (sortValue === 'rpg') {
            currentPlayers.sort((a, b) => b.RPG - a.RPG);
        } else if (sortValue === 'accuracy') {
            currentPlayers.sort((a, b) => Math.abs(a.CAREER_LENGTH - a.Predicted_Career_Length) - Math.abs(b.CAREER_LENGTH - b.Predicted_Career_Length));
        } else if (sortValue === 'positive-dif') {
            currentPlayers.sort((a, b) => (b.Predicted_Career_Length - b.CAREER_LENGTH) - (a.Predicted_Career_Length - a.CAREER_LENGTH));
        } else if (sortValue === 'negative-dif') {
            currentPlayers.sort((a, b) => (a.Predicted_Career_Length - a.CAREER_LENGTH) - (b.Predicted_Career_Length - b.CAREER_LENGTH));
        }
        displayPlayers(currentPlayers, currentPage);
    }

  function displayPlayers(players, page) {
      playerList.innerHTML = '';
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedPlayers = players.slice(start, end);

      paginatedPlayers.forEach(player => {
          const listItem = document.createElement('li');
          listItem.className = 'player-item';

          const img = document.createElement('img');
          img.src = `${player.headshot_url}?v=${new Date().getTime()}`;
          img.alt = player.full_name;
          img.onerror = () => img.src = placeholderImage;

          const infoDiv = document.createElement('div');
          infoDiv.className = 'player-info';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'player-name';
          nameSpan.textContent = player.full_name;

          const statusSpan = document.createElement('span');
          statusSpan.className = `player-status ${player.is_active ? 'active' : 'inactive'}`;
          statusSpan.textContent = player.is_active ? 'Active' : 'Inactive';

          const statsDiv = document.createElement('div');
          statsDiv.className = 'player-stats';

          const seasonsSpan = document.createElement('span');
          seasonsSpan.textContent = `Seasons: ${player.CAREER_LENGTH.toFixed(2)}`;

          const ppgSpan = document.createElement('span');
          ppgSpan.textContent = `PPG: ${player.PPG.toFixed(2)}`;

          const apgSpan = document.createElement('span');
          apgSpan.textContent = `APG: ${player.APG.toFixed(2)}`;

          const rpgSpan = document.createElement('span');
          rpgSpan.textContent = `RPG: ${player.RPG.toFixed(2)}`;

          const predictedSpan = document.createElement('span');
          predictedSpan.textContent = `AI Predicted Seasons: ${player.Predicted_Career_Length.toFixed(2)}`;

          if (player.is_active) {
              if (player.Predicted_Career_Length < player.CAREER_LENGTH) {
                  predictedSpan.className = 'stat-red';
              } else {
                  predictedSpan.className = 'stat-yellow';
              }
          } else {
              if (player.Predicted_Career_Length < player.CAREER_LENGTH) {
                  predictedSpan.className = 'stat-red';
              } else {
                  predictedSpan.className = 'stat-green';
              }
          }

          statsDiv.append(seasonsSpan, ppgSpan, apgSpan, rpgSpan, predictedSpan);
          infoDiv.append(img, nameSpan, statusSpan);
          listItem.append(infoDiv, statsDiv);
          playerList.appendChild(listItem);
      });

      document.getElementById('page-number').textContent = page;
      if (currentPage === 1) {
          firstPageButton.classList.add('hidden');
      } else {
          firstPageButton.classList.remove('hidden');
      }
  }

});
