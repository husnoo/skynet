FROM alpine
RUN apk update && apk upgrade
RUN apk add --update python py-pip py2-openssl py2-bottle


WORKDIR /code
ADD . /code
ADD /home/nawal/data/infrastructure/config-proxy/cloud.husnoo.com.pem /data/host.pem
ENTRYPOINT [ "python", "/code/skynet.py" ]


EXPOSE  443
CMD ["python", "/code/skynet.py"]
