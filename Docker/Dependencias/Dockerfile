FROM ubuntu:18.04
RUN apt-get update
RUN apt-get -y upgrade

# instalar dependencias

RUN sudo apt-get install -y nodejs apache2 aptitude npm unzip wget curl tee git virtualbox

RUN git clone https://gitlab.com/michelmat359/sad_lab.git
RUN ldconfig
RUN cd /sad_lab/npm install

# lanzamos todo 
CMD sudo /etc/init.d/apache2 start
CMD ["node"] ["/sad_lab/dmserver.js 127.0.0.1 10000 11000 127.0.0.1:11001,127.0.0.1:11002"]
CMD ["node"] ["/sad_lab/dmforum.js 127.0.0.1 10000 11001 12000"]
CMD ["node"] ["/sad_lab/dmserver.js 127.0.0.1 10001 11001 127.0.0.1:11000,127.0.0.1:11002 "]
CMD ["node"] ["/sad_lab/dmforum.js 127.0.0.1 10001 11000 12001"]
CMD ["node"] ["/sad_lab/dmserver.js 127.0.0.1 10002 11002 127.0.0.1:11001,127.0.0.1:11000"]
CMD ["node"] ["/sad_lab/dmforum.js 127.0.0.1 10002 11002 12002"]