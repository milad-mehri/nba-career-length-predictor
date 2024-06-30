import pandas as pd

def preprocess_data():
    updated_nba_data = pd.read_csv('./data/updated_nba_data.csv')
    nba_data_summary = pd.read_csv('./data/nba_data_summary.csv')


    updated_nba_data['YEAR'] = updated_nba_data['SEASON_ID'].apply(lambda x: int(x.split('-')[1]))
    years_played = updated_nba_data.groupby('PLAYER_ID')['YEAR'].nunique().reset_index()
    years_played.columns = ['PLAYER_ID', 'YEARS_PLAYED']
    updated_nba_data['GAMES_MISSED'] = updated_nba_data['GP'].apply(lambda x: 82 - x)  
    avg_games_missed = updated_nba_data.groupby('PLAYER_ID')['GAMES_MISSED'].mean().reset_index()
    avg_games_missed.columns = ['PLAYER_ID', 'AVG_GAMES_MISSED']
    
    nba_data_summary = nba_data_summary.merge(years_played, on='PLAYER_ID', how='left')
    nba_data_summary = nba_data_summary.merge(avg_games_missed, on='PLAYER_ID', how='left')
    nba_data_summary['YEARS_PLAYED'].fillna(0, inplace=True)
    nba_data_summary['AVG_GAMES_MISSED'].fillna(0, inplace=True)

    current_players = updated_nba_data[updated_nba_data['SEASON_ID'] == '2023-24']
    current_players = current_players.merge(nba_data_summary, on='PLAYER_ID', how='left', suffixes=('', '_DROP'))

    current_players.drop([col for col in current_players.columns if 'DROP' in col], axis=1, inplace=True)

    features_columns = ['PLAYER_ID', 'PLAYER_AGE', 'GP', 'PPG', 'APG', 'RPG', 'SPG', 'TOV', 'PPG_TREND', 'RPG_TREND', 'APG_TREND', 'MPG_TREND', 'AVG_GAMES_MISSED']
    labels_columns = ['CAREER_LENGTH']
    
    for col in features_columns:
        if col not in current_players.columns:
            current_players[col] = 0
    
    features = current_players[features_columns]

    for col in labels_columns:
        if col not in current_players.columns:
            current_players[col] = 0

    career_length_labels = current_players['CAREER_LENGTH']

    features.to_csv('./data/features.csv', index=False)
    career_length_labels.to_csv('./data/career_length_labels.csv', index=False)

    current_players_features = current_players[features_columns]
    current_players_features.to_csv('./data/current_players.csv', index=False)

if __name__ == '__main__':
    preprocess_data()
