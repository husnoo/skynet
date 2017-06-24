import glob

path = "./Images/"

with open(path + "combined.txt", 'r') as read_files:
    file_lines = read_files.readlines()
    # print the length of the lines from the input file
    print(len(file_lines), "files added")
    for file_name in file_lines:
        print(file_name.strip())