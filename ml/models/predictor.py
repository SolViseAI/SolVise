import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

class TokenPredictor:
    def __init__(self, model_path=None):
        if model_path:
            self.model = joblib.load(model_path)
        else:
            self.model = RandomForestRegressor()
        
    def train(self, historical_data):
        X = historical_data[['volume', 'price', 'market_cap']]
        y = historical_data['next_day_price']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(X_train, y_train)
        return self.model.score(X_test, y_test)
    
    def predict(self, current_data):
        return self.model.predict(current_data)
    
    def save_model(self, path):
        joblib.dump(self.model, path) 