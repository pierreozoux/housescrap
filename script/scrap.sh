#!/bin/bash -eux

read -s -p "Enter Password: " password

cd ./meteor/house
cmd=$(meteor mongo --url housescrap3.meteor.com << ENDPASS
$password
ENDPASS)
mongo_uri=$(echo $cmd | cut -f2 -d" ")
mongo_db=`echo $mongo_uri | cut -d/ -f 4`
cd ../..

scrapy crawl custojusto -s MONGODB_URI=$mongo_uri -s MONGODB_DATABASE=$mongo_db
# scrapy crawl sapo -s MONGODB_URI=$url -s MONGODB_DATABASE=$mongo_db
