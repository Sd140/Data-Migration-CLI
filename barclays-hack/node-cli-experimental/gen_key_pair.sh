openssl genrsa -out $IBLIZ_HOME/private_key.pem 1024;
openssl rsa -in $IBLIZ_HOME/private_key.pem -pubout -out $IBLIZ_HOME/public_key.pem;
