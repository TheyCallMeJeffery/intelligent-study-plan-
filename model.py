import pandas as pd
data = pd.read_csv('study_data.csv')

from sklearn.ensemble import RandomForestRegressor

X = data[['day', 'hour', 'habit_score']]
y = data['study_efficiency']

model = RandomForestRegressor()
model.fit(X, y)

import joblib
joblib.dump(model, 'study_model.pkl')
