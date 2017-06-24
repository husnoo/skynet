from PIL import Image
import glob

path = "./Images/yalefaces/"
images_filenames = glob.glob(path + "*.*")

print (len(images_filenames))

for im_path in images_filenames:
	if ".gif" not in im_path and ".txt" not in im_path:
		im = Image.open(im_path)
		im.save(im_path + ".jpeg")
