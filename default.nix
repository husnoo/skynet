with import <nixpkgs> {};

(python.buildEnv.override {
  extraLibs = [
    pkgs.pythonPackages.numpy
    pkgs.pythonPackages.scipy
    pkgs.pythonPackages.pyqt4
    pkgs.pythonPackages.tkinter                                         pkgs.pythonPackages.tkinter					    pkgs.pythonPackages.pillow                                     
];
  ignoreCollisions = true;
}).env







