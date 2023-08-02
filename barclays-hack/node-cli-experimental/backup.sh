#!/usr/bin/bash

database_name=$1

pg_dump $database_name > backup.sql