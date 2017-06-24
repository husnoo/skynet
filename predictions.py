import glob
import json
import random

path = "./Images/"
images_filenames = glob.glob(path + "*.tiff") + glob.glob(path + "*.jpeg") 

with open("./Images/combined.txt", 'r') as file:
    with open("./NeuralNetworks/predict.txt", 'r') as pre_file:
        file_lines = file.readlines()
        predictions = pre_file.readlines()
        for file_line in file_lines:
            name = file_line.strip().split(' ')[0]
            y = file_line.strip().split(' ')[1]
            for f in range(len(images_filenames)):
                print(name)
                print(images_filenames[f])
                if name in images_filenames[f]:
                    print (os.path.basename(image_path))
                    print ("Actual: " + y + " pred:" + predictions[f])
                    image = Image.open(image_path)
                    photo = ImageTk.PhotoImage(self.image)
                    canvas.config(width=image.size[0], height=image.size[1])
                    canvas.create_image(0, 0, anchor="nw", image=photo)

