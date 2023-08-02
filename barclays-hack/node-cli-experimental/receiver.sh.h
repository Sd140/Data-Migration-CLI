#!/bin/bash

sudo ssh $1@$2 -i $3 << EOF
  echo "Hello, world!"
  
  # Add any other commands here
EOF