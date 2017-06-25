# docker build -t skynet .
# docker save skynet --output skynet.docker
# tar -cvf skynet.docker.tar.gz skynet.docker
# scp skynet.docker.tar.gz core@cloud.husnoo.com:/tmp/skynet.docker.tar.gz

# On husnoo.com
# tar -xvf /tmp/skynet.docker.tar.gz -C /tmp/
# docker load --input /tmp/skynet.docker
# docker run -d -p 0.0.0.0:443:443 --name skynet skynet &
# docker run --rm -ti -p 0.0.0.0:443:443 --name skynet skynet

FROM debian
RUN apt-get update
RUN apt-get install -y python python-openssl python-flask python-numpy

WORKDIR /code
ADD . /code
ENTRYPOINT [ "python", "/code/skynet.py" ]


EXPOSE  443
CMD ["python", "/code/skynet.py"]
