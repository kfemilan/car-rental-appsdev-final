from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_jsonpify import jsonify
from chunking import Chunker
from sentiment import Sentiment

app = Flask(__name__)
api = Api(app)
CORS(app)

class SentimentAnalysis(Resource):
    def get(self, text):
        st = Sentiment()
        score = st.getStar(text)
        return jsonify(score) 

class Chunk(Resource):
    def get(self, text):
        ch = Chunker()
        chunk = ch.chunk(text)
        return jsonify(chunk)

api.add_resource(SentimentAnalysis, '/sentiment/<string:text>')
api.add_resource(Chunk, '/chunk/<string:text>')

if __name__ == '__main__':
    app.run()

    #comment check