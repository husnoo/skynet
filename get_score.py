import numpy as np
import json 

def sigmoid_array(x):                                        
	return 1 / (1 + np.exp(-x))

def get_score(d):
	theta1 = np.loadtxt("theta1.txt")
	theta2 = np.loadtxt("theta2.txt")
	x = np.array([[1, d['anger'], d['contempt'], d['disgust'], d['fear'], d['happiness'], d['neutral'], d['sadness'], d['surprise']]])
	h1 = sigmoid_array(np.matrix(x) * np.matrix(theta1.transpose()))
	h2 = np.ones(len(np.array(h1)[0]) + 1)
	h2[1:] = h1 
	h3 = sigmoid_array(np.matrix(h2) * np.matrix(theta2.transpose()))
	return np.argmax(h3) + 1


d = json.loads("""{
        "anger": 0.0,
        "contempt": 0.002,
        "disgust": 0.004,
        "fear": 0.553,
        "fname": "jaffe/YM.FE4.70.tiff",
        "happiness": 0.0,
        "neutral": 0.02,
        "sadness": 0.096,
        "surprise": 0.325
    }""")
get_score(d)