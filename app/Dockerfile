# docker build -t skynet .
# docker save skynet --output skynet.docker
# scp skynet.docker core@cloud.husnoo.com:/tmp/skynet.docker
# docker load --input /tmp/skynet.docker
# docker run -d -p 0.0.0.0:443:443 --name skynet skynet &
# docker run --rm -ti -p 0.0.0.0:443:443 --name skynet skynet

FROM debian
RUN apt-get update
RUN apt-get install -y python python-openssl python-flask

WORKDIR /code
ADD . /code
ENTRYPOINT [ "python", "/code/skynet.py" ]


EXPOSE  443
CMD ["python", "/code/skynet.py"]
