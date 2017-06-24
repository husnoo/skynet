import tkinter as tk
from PIL import Image, ImageTk
import os, glob
import json
import random

path = "./Images/"
images_filenames = glob.glob(path + "jaffe/*.tiff") + glob.glob(path + "yalefaces/*.jpeg") 

with open('./data/face_api_class.json') as data_file:    
    data = json.load(data_file)

window = tk.Tk()
window.canvas = tk.Canvas(window, width=400, height=400, cursor="cross")
window.canvas.pack(side="top", fill="both", expand=True)
window.canvas.focus_set()
window.rect = window.canvas.create_rectangle(0,0,0,0, outline="")

with open("./Images/combined.txt", 'r') as file:
    with open("./NeuralNetworks/predict.txt", 'r') as pre_file:
        file_lines = file.readlines()
        predictions = pre_file.readlines()
        for file_line in file_lines:
            name = file_line.strip().split(' ')[0]
            if ".jpeg" in name:
                name = name.split('.jpeg')[0]
            y = file_line.strip().split(' ')[1]
            for d in data:
                print(d['fname'] + " " + name)
                if name in d['fname']:
                    for f in range(len(images_filenames)):
                        if name in images_filenames[f]:
                            print(images_filenames[f])
                            print ("Actual: " + y + " pred:" + predictions[f].split('.')[0])
                            string = ("anger: %d contempt: %d disgust: %d fear: %d \nhappiness: %d neutral: %d sadness: %d surprise: %d \n" % ( d['anger']*1000, d['contempt']*1000, d['disgust']*1000, d['fear']*1000, d['happiness']*1000, d['neutral']*1000, d['sadness']*1000, d['surprise']*1000 ))
                            print(string)
                            image = Image.open(images_filenames[f])
                            photo = ImageTk.PhotoImage(image)
                            window.canvas.config(width=image.size[0], height=image.size[1])
                            window.canvas.create_image(0, 0, anchor="nw", image=photo)
                            input()
