# import nltk
from nltk.stem.snowball import SnowballStemmer
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import re

# nltk.download('vader_lexicon') # Download this if use for first time

class Sentiment:

    def cleanText(self, text):
        text = text.lower()
        cleanedText = re.sub("https://\S+|http://\S+|[^a-zA-Z0-9 ]+", '', text)

        ss = SnowballStemmer("english")

        newText = ''
        for word in cleanedText.split():
            newText = newText + ss.stem(word) + ' '
            
        return newText

    def getScore(self, text):
        cleanedText = self.cleanText(text)
        print(cleanedText)
        analyzer = SentimentIntensityAnalyzer()

        score = analyzer.polarity_scores(cleanedText)

        return score

    def getStar(self, text):
        scores = self.getScore(text)
        star = 0
        negative = scores['neg']
        neutral = scores['neu']
        positive = scores['pos']
        sc = (neutral/2 + positive - negative) * 100
        print(sc)
        if sc > 80:
            star = 5
        elif sc > 60:
            star = 4
        elif sc > 40:
            star = 3
        elif sc > 20:
            star = 2
        else:
            star = 1
        return str(star)



if __name__ == '__main__':
    text = """
        Each slice was inconsistent with toppings and how cooked it was. Salad was so rotted I had to throw it away or risk food poisoning. The pasta looked crusty so 
        I stayed away should have just stayed away from this place altogether. Awful. Anyone with more than a one star review was paid for sure.
    """
    st = Sentiment()
    star = st.getStar(text)
    sentimentScore = st.getScore(text)
    print(sentimentScore)
    print(star)