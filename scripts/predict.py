import pandas as pd
import joblib

def predict_career_length():
    current_players = pd.read_csv('./data/current_players.csv')
    nba_data_summary = pd.read_csv('./data/nba_data_summary.csv')
    
    career_length_model = joblib.load('./models/career_length_model.pkl')
    

    feature_columns = ['PLAYER_AGE', 'GP', 'PPG', 'APG', 'RPG', 'SPG', 'TOV', 'PPG_TREND', 'RPG_TREND', 'APG_TREND', 'MPG_TREND', 'AVG_GAMES_MISSED']
    
    current_players_features = current_players[feature_columns]
    career_length_predictions = career_length_model.predict(current_players_features)
    
    current_players['Predicted_Career_Length'] = career_length_predictions
    
    current_players = current_players.merge(nba_data_summary[['PLAYER_ID', 'CAREER_LENGTH']], on='PLAYER_ID', how='left')
    
    current_players.to_csv('./data/current_players_with_predictions.csv', index=False)
    print("Predictions saved to './data/current_players_with_predictions.csv'")

if __name__ == '__main__':
    predict_career_length()
