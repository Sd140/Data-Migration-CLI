#!/bin/bash

# Prompt for remote machine and username
read -p "Enter remote machine IP/hostname: " remote
read -p "Enter remote username: " username

# Generate public and private key pair for the remote machine
ssh $username@$remote << EOF
  cd postre
  # Add any other commands here
  openssl genrsa -out ./private_key.pem 1024;
  openssl rsa -in ./private_key.pem -pubout -out ./public_key.pem;
EOF

scp $username@$remote:/postre/public_key.pem ./rec_pub_key.pem




# # Copy the public key to your machine
# ssh-copy-id $username@$remote

# Generate AES key and encrypt file
openssl rand -out aes_key.bin 32
openssl enc -aes-256-cbc -in backup_db -out encrypted_backup_db -pass file:aes_key.bin

# Encrypt the AES key using the public key of the remote machine
openssl rsautl -encrypt -inkey ./rec_pub_key.pem -pubin -in aes_key.bin -out encrypted_aes_key.bin

# Transfer both the encrypted file and encrypted AES key to the remote machine
scp encrypted_backup_db encrypted_aes_key.bin $username@$remote:/postre


ssh $username@$remote << EOF
  cd postre
  openssl rsautl -decrypt -inkey /path/to/private_key.pem -in encrypted_aes_key.bin -out decrypted_aes_key.bin
  openssl enc -d -aes-256-cbc -in encrypted_backup_db -out decrypted_file -pass file:decrypted_aes_key.bin
EOF

# Decrypt the AES key using the private key of the remote machine
# openssl rsautl -decrypt -inkey ./private_key.pem -in encrypted_aes_key.bin -out decrypted_aes_key.bin

# Use the decrypted AES key to decrypt the file