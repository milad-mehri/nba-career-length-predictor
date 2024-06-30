
from nba_api.stats.static import players
import pandas as pd

nba_players = players.get_players()

nba_players_df = pd.DataFrame(nba_players)


nba_players_df['headshot_url'] = nba_players_df['id'].apply(lambda x: f'https://cdn.nba.com/headshots/nba/latest/260x190/{x}.png')

nba_players_df.to_csv('./data/nba_players.csv', index=False)
