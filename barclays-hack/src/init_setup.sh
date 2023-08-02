#!/bin/bash

IBLIZ_SRC=/home/yashshingade28/projects/sandbox/ibliz/src/
IBLIZ_HOME=$HOME/transfer

if [ -d "$HOME/transfer" ]; then
  cd $HOME/transfer
else
  mkdir $HOME/transfer
  cd $HOME/transfer
fi

if [ ! -d rec_cred ]; then
  mkdir rec_cred
fi
