import pandas as pd
import joblib

def predict_career_length():
    nba_data_summary = pd.read_csv('./data/nba_data_summary.csv')
    
    career_length_model = joblib.load('./models/career_length_model.pkl')
    
    feature_columns = ['PLAYER_AGE', 'GP', 'PPG', 'APG', 'RPG', 'SPG', 'TOV', 'PPG_TREND', 'RPG_TREND', 'APG_TREND', 'MPG_TREND', 'AVG_GAMES_MISSED']
    
    if 'AVG_GAMES_MISSED' not in nba_data_summary.columns:
        nba_data_summary['AVG_GAMES_MISSED'] = 0

    all_players_features = nba_data_summary[feature_columns]
    career_length_predictions = career_length_model.predict(all_players_features)
    
    nba_data_summary['Predicted_Career_Length'] = career_length_predictions
    
    nba_data_summary.to_csv('./data/all_players_with_predictions.csv', index=False)
    print("Predictions saved to './data/all_players_with_predictions.csv'")

if __name__ == '__main__':
    predict_career_length()
