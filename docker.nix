/*

scp /home/nawal/data/skynet/* core@cloud.husnoo.com:/media/data/code/skynet/

docker run         --rm -ti         -p 0.0.0.0:443:443         -v /media/data/projects_data/skynet/:/data       dia/data/code/skynet/:/code         --name skynet skynet 








scp /home/nawal/data/skynet/* core@cloud.husnoo.com:/media/data/code/skynet/






iptables -A INPUT -i docker0 -j ACCEPT

    # Local
    nix-build docker.nix
    docker load < result
    
    # Online
    scp /home/nawal/data/skynet/* core@cloud.husnoo.com:/media/data/code/skynet/
    scp -r /home/nawal/data/skynet/html core@cloud.husnoo.com:/media/data/code/skynet/
    scp /nix/store/7466zzp39k7c3l62zrhy133xwk9iyp91-docker-image-skynet.tar.gz core@cloud.husnoo.com:/media/data/backup/old/images/
    docker load < /media/data/backup/old/images/7466zzp39k7c3l62zrhy133xwk9iyp91-docker-image-skynet.tar.gz


# See /home/nawal/data/infrastructure/notes.txt for the nginex proxy and https

    docker run \
        --rm -ti \
        -p 0.0.0.0:443:443 \
        -v /media/data/projects_data/skynet/:/data \
        -v /media/data/code/skynet/:/code \
        --name skynet skynet
	


*/

# http://lethalman.blogspot.co.uk/2016/04/cheap-docker-images-with-nix_15.html
# http://datakurre.pandala.org/2015/10/nix-for-python-developers.html
# http://stackoverflow.com/questions/43837691/how-to-package-a-single-python-script-with-nix


with import <nixpkgs> {};

(let

code = "";

in

dockerTools.buildImage {
    name = "skynet";

    runAsRoot = ''
        #!${stdenv.shell}
        ${dockerTools.shadowSetup}
        groupadd -r skynet
        useradd -r -g skynet -d /data -M skynet
	echo "ONE"
	ls -lh
	echo "TWO"
	mkdir /data
	mkdir /code
	#cp /home/nawal/data/skynet/*.py /code/
	#cp -r /home/nawal/data/skynet/html /code/
	#cp /home/nawal/data/infrastructure/config-proxy/cloud.husnoo.com.pem /data/host.pem
	
    '';

    contents = (python.buildEnv.override {
        extraLibs = [
	    busybox
            pythonPackages.bottle
	    pythonPackages.pyopenssl
	    pythonPackages.lockfile
	    
	    
        ];
        ignoreCollisions = true;
    }) ++[code];

    config = {
        Cmd = [ "/bin/python" "/code/skynet.py"];
        ExposedPorts = {
            "443/tcp" = {};
        };
        WorkingDir = "/code";
    };
}