import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TokenPredictor:
    def __init__(self, model_path=None, n_estimators=100, random_state=42):
        """Initialize the TokenPredictor with optional pre-trained model."""
        self.scaler = StandardScaler()
        if model_path:
            try:
                self.load_model(model_path)
            except Exception as e:
                logger.error(f"Error loading model: {str(e)}")
                self.initialize_model(n_estimators, random_state)
        else:
            self.initialize_model(n_estimators, random_state)

    def initialize_model(self, n_estimators, random_state):
        """Initialize a new model with specified parameters."""
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state,
            n_jobs=-1  # Use all available cores
        )

    def preprocess_data(self, data):
        """Preprocess input data with validation and scaling."""
        required_columns = ['volume', 'price', 'market_cap']
        
        try:
            # Validate input data
            if not all(col in data.columns for col in required_columns):
                raise ValueError(f"Missing required columns: {required_columns}")
            
            # Handle missing values
            data = data.fillna(method='ffill').fillna(method='bfill')
            
            # Feature engineering
            data['price_to_volume'] = data['price'] / (data['volume'] + 1)
            data['market_cap_to_volume'] = data['market_cap'] / (data['volume'] + 1)
            
            return data
            
        except Exception as e:
            logger.error(f"Error in data preprocessing: {str(e)}")
            raise

    def train(self, historical_data, validation_split=0.2):
        """Train the model with cross-validation and performance metrics."""
        try:
            # Preprocess data
            processed_data = self.preprocess_data(historical_data)
            
            # Prepare features and target
            X = processed_data[['volume', 'price', 'market_cap', 
                              'price_to_volume', 'market_cap_to_volume']]
            y = processed_data['next_day_price']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=validation_split, random_state=42
            )
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Calculate metrics
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            cv_scores = cross_val_score(self.model, X_scaled, y, cv=5)
            
            # Log performance metrics
            logger.info(f"Training Score: {train_score:.4f}")
            logger.info(f"Test Score: {test_score:.4f}")
            logger.info(f"Cross-validation Scores: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            return {
                'train_score': train_score,
                'test_score': test_score,
                'cv_scores_mean': cv_scores.mean(),
                'cv_scores_std': cv_scores.std()
            }
            
        except Exception as e:
            logger.error(f"Error in model training: {str(e)}")
            raise

    def predict(self, current_data):
        """Make predictions with confidence intervals."""
        try:
            # Preprocess input data
            processed_data = self.preprocess_data(current_data)
            
            # Prepare features
            X = processed_data[['volume', 'price', 'market_cap', 
                              'price_to_volume', 'market_cap_to_volume']]
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make predictions with all trees
            predictions = np.array([tree.predict(X_scaled) 
                                  for tree in self.model.estimators_])
            
            # Calculate mean and confidence intervals
            mean_pred = predictions.mean(axis=0)
            std_pred = predictions.std(axis=0)
            conf_interval = 1.96 * std_pred  # 95% confidence interval
            
            return {
                'prediction': mean_pred,
                'lower_bound': mean_pred - conf_interval,
                'upper_bound': mean_pred + conf_interval,
                'confidence': 1 - (std_pred / mean_pred)  # Normalized confidence score
            }
            
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise

    def save_model(self, path):
        """Save model and scaler to disk."""
        try:
            model_data = {
                'model': self.model,
                'scaler': self.scaler
            }
            joblib.dump(model_data, path)
            logger.info(f"Model saved successfully to {path}")
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            raise

    def load_model(self, path):
        """Load model and scaler from disk."""
        try:
            model_data = joblib.load(path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            logger.info(f"Model loaded successfully from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise 