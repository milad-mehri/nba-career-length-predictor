
from nba_api.stats.static import players
import pandas as pd

nba_players = players.get_players()

nba_players_df = pd.DataFrame(nba_players)

nba_players_df.to_csv('nba_players.csv', index=False)
