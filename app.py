# from flask import Flask, request, jsonify
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.preprocessing import LabelEncoder
# import pickle
# import os

# app = Flask(__name__)

# # Load or train the model
# model_file = 'model.pkl'
# if os.path.exists(model_file) and os.path.getsize(model_file) > 0:
#     with open(model_file, 'rb') as f:
#         model, label_encoder = pickle.load(f)
# else:
#     # Load dataset
#     dataset_path = 'train.csv'  # Assumes train.csv is in the project directory
#     try:
#         df = pd.read_csv(dataset_path)
#     except FileNotFoundError:
#         raise FileNotFoundError(f"Dataset not found at {dataset_path}. Please ensure train.csv is in the project directory.")

#     # Data preprocessing
#     try:
#         df = df[['Area', 'No. of Bedrooms', 'Location', 'Price']].dropna()
#     except KeyError:
#         raise KeyError("Dataset must contain columns: Area, No. of Bedrooms, Location, Price. Check train.csv columns.")

#     label_encoder = LabelEncoder()
#     df['Location'] = label_encoder.fit_transform(df['Location'])

#     # Features and target
#     X = df[['Area', 'No. of Bedrooms', 'Location']]
#     y = df['Price']

#     # Split data
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # Train model
#     model = RandomForestRegressor(n_estimators=100, random_state=42)
#     model.fit(X_train, y_train)

#     # Save model
#     with open(model_file, 'wb') as f:
#         pickle.dump((model, label_encoder), f)

# @app.route('/')
# def home():
#     return app.send_static_file('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         area = data['area']
#         bedrooms = data['bedrooms']
#         location = data['location']

#         # Encode location
#         try:
#             location_encoded = label_encoder.transform([location])[0]
#         except ValueError:
#             return jsonify({'error': 'Invalid location'}), 400

#         # Prepare input
#         input_data = np.array([[area, bedrooms, location_encoded]])
#         prediction = model.predict(input_data)[0]

#         return jsonify({'price': prediction})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import os

app = Flask(__name__)

# Load or train the model
model_file = 'model.pkl'
if os.path.exists(model_file) and os.path.getsize(model_file) > 0:
    with open(model_file, 'rb') as f:
        model, label_encoder = pickle.load(f)
else:
    dataset_path = 'train.csv'
    if not os.path.exists(dataset_path):
        raise FileNotFoundError("Dataset not found. Please add 'train.csv' in the project directory.")

    df = pd.read_csv(dataset_path)
    df = df[['Area', 'No. of Bedrooms', 'Location', 'Price']]

    label_encoder = LabelEncoder()
    df['Location'] = label_encoder.fit_transform(df['Location'])

    X = df[['Area', 'No. of Bedrooms', 'Location']]
    y = df['Price']

    model = RandomForestRegressor()
    model.fit(X, y)

    with open(model_file, 'wb') as f:
        pickle.dump((model, label_encoder), f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    area = data['area']
    bedrooms = data['bedrooms']
    location = data['location']

    location_encoded = label_encoder.transform([location])[0]
    prediction = model.predict(np.array([[area, bedrooms, location_encoded]]))[0]

    return jsonify({'price': prediction})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
