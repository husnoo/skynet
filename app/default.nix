with import <nixpkgs> {};

(let aws = stdenv.mkDerivation rec {
  name = "aws-1.75";
  
  src = fetchurl {
    url = https://github.com/aws/aws-cli/archive/1.11.112.tar.gz;
    sha256 = "7ca7d14e3e5c4df80536421c8d5b2b4f4a3159e36d4e6ccec457576d31cbfa0c";
  };

  buildInputs = [ perl ];

  unpackPhase = "true";

  installPhase =
    ''	       
      #echo ${curl.bin}
      mkdir -p $out/bin
      #sed 's|\[curl|[${curl.bin}/bin/curl|g' $src > $out/bin/aws
      ls $src
      tar -xvzf $src
      cd aws-cli-1.11.112
      ls
      find
      #cp $src > $out/bin/aws
      chmod +x $out/bin/aws
    '';

  meta = {
    homepage = http://www.timkay.com/aws/;
    description = "Command-line utility for working with Amazon EC2, S3, SQS, ELB, IAM and SDB";
    license = stdenv.lib.licenses.gpl3Plus;
    platforms = stdenv.lib.platforms.unix;
  };
};
in

pkgs.python.withPackages (ps: [
    aws
])).env





