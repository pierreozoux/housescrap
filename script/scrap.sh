#!/bin/bash -eux

# cd ./meteor/house
# url=`meteor mongo --url`
# mongo_server=`echo $url | cut -d/ -f 3`
# mongo_db=`echo $url | cut -d/ -f 4`
# mongo_uri="mongodb://$mongo_server"

# cd ../..
# #-s MONGODB_PORT=$mongo_port 
# echo "db = $mongo_db"
# echo "uri = $mongo_uri"
# scrapy crawl sapo -s MONGODB_URI=$mongo_uri -s MONGO_DATABASE=$mongo_db
# scrapy crawl sapo
scrapy crawl custojusto
