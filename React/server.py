#!/usr/bin/env python
import json
import os
from werkzeug import secure_filename
from flask import Flask, render_template, request
import pandas as pd
from ML.KMeans import data_classifier

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/test")
def test():
	return json.dumps("TEST")

@app.route('/api/upload', methods = ['POST'])
def upload_file():
	file = request.files['file']
	df = pd.read_csv(file)

	resp = data_classifier(df)
	return json.dumps(resp)
   	
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
