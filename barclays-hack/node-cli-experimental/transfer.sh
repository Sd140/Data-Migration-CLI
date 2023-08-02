#!/usr/bin/bash

echo "  ___ ____  _     ___ _____"
echo " |_ _| __ )| |   |_ _|__  /"
echo "  | ||  _ \| |    | |  / / "
echo "  | || |_) | |___ | | / /_ "
echo " |___|____/|_____|___/____|"


transfer_file_path=$1
login_name=$2
aws_private_key_path=$3

transfer_file_name=$(basename $transfer_file_path)

source /home/yashshingade28/projects/sandbox/ibliz/src/init_setup.sh

source $IBLIZ_SRC/init_aws_setup.sh $login_name $aws_private_key_path

source $IBLIZ_SRC/gen_aes_key.sh

source $IBLIZ_SRC/gen_key_pair.sh

source $IBLIZ_SRC/enc_file_aes.sh $transfer_file_path $IBLIZ_HOME/aes256.key

source $IBLIZ_SRC/get_aws_pub_key.sh $login_name $aws_private_key_path

source $IBLIZ_SRC/enc_file_rsa.sh $IBLIZ_HOME/aes256.key $IBLIZ_HOME/rec_cred/public_key.pem

source $IBLIZ_SRC/send_to_aws.sh $IBLIZ_HOME/encrypted_aes256.key $login_name $aws_private_key_path

source $IBLIZ_SRC/send_to_aws.sh $IBLIZ_HOME/encrypted_$transfer_file_name $login_name $aws_private_key_path