import nltk
from nltk.tree import Tree
import re

class Chunker:

    def chunk(self, text):

        #Tokenize the text
        token = nltk.word_tokenize(text)

        #POS Tag each tokenized word
        tag = nltk.pos_tag(token)
        pos = ""
        for x in tag:
            pos = pos + x[1] + "-" + x[0] + " "

        # NP Grammar = {<DT>?<JJ.?>*<NN.?>+}
        npGrammar = "(DT-\w*\s)?(JJ.?-\w*\s)*(NN.?-\w*\s)+"
        # VP Grammar = {<MD>?<TO>?<VB.?>+<RB.?>?}
        vpGrammar = "(MD-\w*\s)?(TO-\w*\s)?(VB.?-\w*\s)+(RB.?-\w*\s)?"

        # Chunk for Noun Phrase
        while re.search(npGrammar, pos) != None:
            x = re.search(npGrammar, pos)
            nptemp = ""
            for y in x.group().split():
                z = y.split("-")
                nptemp = nptemp + z[0] + "/" + z[1] + " "
            np = "NP( " + nptemp + ") "
            pos = re.sub(x.group(), np, pos)

        # Chunk Verb Phrase
        while re.search(vpGrammar, pos) != None:
            x = re.search(vpGrammar, pos)
            vptemp = ""
            for y in x.group().split():
                z = y.split("-")
                vptemp = vptemp + z[0] + "/" + z[1] + " "
            vp = "VBP( " + vptemp + ") "
            pos = re.sub(x.group(), vp, pos)

        # Return String Chunked in Tree Form for Draw
        return pos


    def draw(self, text):
        # Convert String to Tree Form
        tr = Tree.fromstring(text)

        # Draw the Tree
        tr.draw()


if __name__ == '__main__':
    ck = Chunker()
    x = ck.chunk("The beautiful lady is walking on the pavement")
    print(x)
    # ck.draw(x)