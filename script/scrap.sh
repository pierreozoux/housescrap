#!/bin/bash -eux

# cd ./meteor/house
# url=`meteor mongo --url housescrap2.meteor.com`
# mongo_server=`echo $url | cut -d/ -f 3`
# mongo_db=`echo $url | cut -d/ -f 4`
# mongo_uri="mongodb://$mongo_server"
# cd ../..

# #-s MONGODB_PORT=$mongo_port 
# echo "db = $mongo_db"
# echo "uri = $mongo_uri"

# scrapy crawl custojusto -s MONGODB_URI=$mongo_uri -s MONGODB_DATABASE=$mongo_db
# scrapy crawl sapo -s MONGODB_URI=mongodb://127.0.0.1:3002/ -s MONGODB_DATABASE=meteor
scrapy crawl sapo
scrapy crawl custojusto
