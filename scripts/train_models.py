import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

features = pd.read_csv('./data/features.csv')
career_length_labels = pd.read_csv('./data/career_length_labels.csv')

career_length_labels = career_length_labels.values.ravel()

features = features.drop(columns=['PLAYER_ID'])

X_train, X_test, y_train, y_test = train_test_split(features, career_length_labels, test_size=0.2, random_state=42)

rf = RandomForestRegressor(random_state=42)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, scoring='neg_mean_squared_error', n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

best_rf = grid_search.best_estimator_

best_rf.fit(X_train, y_train)

career_length_predictions = best_rf.predict(X_test)
mse = mean_squared_error(y_test, career_length_predictions)
print(f'Career Length Model MSE: {mse}')

joblib.dump(best_rf, './models/career_length_model.pkl')
