import glob
import json

path = "./Images/"

with open('./data/face_api_class.json') as data_file:    
    data = json.load(data_file)

x_file = open("X.txt", 'w')
y_file = open("y.txt", 'w')

with open("./Images/combined.txt", 'r') as file:
    file_lines = file.readlines()
    for file_line in file_lines:
        name = file_line.strip().split(' ')[0]
        if ".jpeg" in name:
            name = name.split('.jpeg')[0]
        y = file_line.strip().split(' ')[1]
        for d in data:
            print(d['fname'] + " " + name)
            if name in d['fname']:
                string = ("%4f %4f %4f %4f %4f %4f %4f %4f \n" % ( d['anger'], d['contempt'], d['disgust'], d['fear'], d['happiness'], d['neutral'], d['sadness'], d['surprise'] ))
                string = ("%d %d %d %d %d %d %d %d\n" % ( d['anger']*1000, d['contempt']*1000, d['disgust']*1000, d['fear']*1000, d['happiness']*1000, d['neutral']*1000, d['sadness']*1000, d['surprise']*1000 ))
                x_file.write(string)
                y_file.write(y+'\n')

