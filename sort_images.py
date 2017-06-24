import tkinter as tk
from PIL import Image, ImageTk
import os, glob

#.  from math import abs
path = "./Images/jaffe/"
images_filenames = glob.glob(path + "*.tiff")

print (len(images_filenames))

class ExampleApp(tk.Tk):
	def __init__(self):
		tk.Tk.__init__(self)
		self.x = self.y = 0
		self.canvas = tk.Canvas(self, width=400, height=400, cursor="cross")
		self.canvas.pack(side="top", fill="both", expand=True)
		self.canvas.focus_set()
		self.canvas.bind("<Key>", self.key_pressed)
		self.rect = self.canvas.create_rectangle(0,0,0,0, outline="")
		self.outline = 'cyan'
		self.cylinder_flag = True
		self.ball_count = 0
		self.cylinder_count = 0
		self.count = -1
		self.image_path = ""
		self.pressed = False
		self.cross_hor = self.canvas.create_line(0,0,0,0, width=1, fill=self.outline)
		self.cross_ver = self.canvas.create_line(0,0,0,0, width=1, fill=self.outline)
		self.crop_points = (0,0,0,0)
		self.f = open(path + "/output.txt", 'w')
		self.next_image()

	def key_pressed(self, event):
		if event.char == '1':
			self.f.write(self.image_path.split("/")[-1] + " 0\n")
			self.next_image()
		
		elif event.char == '2':
			self.f.write(self.image_path.split("/")[-1] + " 1\n")
			self.next_image()
			
		elif event.char == '3':
			self.f.write(self.image_path.split("/")[-1] + " 2\n")
			self.next_image()

		elif event.char == 's':
			self.next_image()

		elif event.char == 'q':
			if self.pressed:
				self.pressed = False
				self.canvas.delete(self.rect)

	def next_image(self):
		if self.count+1 < len(images_filenames):
			self.count += 1
			self.image_path = images_filenames[self.count]
			print (os.path.basename(self.image_path))
			self.image = Image.open(self.image_path)
			self.photo = ImageTk.PhotoImage(self.image)
			self.canvas.config(width=self.image.size[0], height=self.image.size[1])
			self.canvas.create_image(0, 0, anchor="nw", image=self.photo)

	def delete_image(self):
		image_to_detele = images_filenames[self.count]
		self.next_image()
		print ('deleting {}'.format(image_to_detele))
		os.remove(image_to_detele)

if __name__ == "__main__":
    app = ExampleApp()
    app.mainloop()