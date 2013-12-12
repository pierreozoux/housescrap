#!/bin/bash -eux

password=`cat ~/.pass`

cmd=$(/opt/node22/bin/node "/opt/meteor/tools/meteor.js" mongo --url findahouse.meteor.com <<<$password)
mongo_uri=$(echo $cmd | cut -f2 -d" ")
mongo_db=`echo $mongo_uri | cut -d/ -f 4`

scrapy crawl custojusto -s MONGODB_URI=$mongo_uri -s MONGODB_DATABASE=$mongo_db

cmd=$(/opt/node22/bin/node "/opt/meteor/tools/meteor.js" mongo --url findahouse.meteor.com <<<$password)
mongo_uri=$(echo $cmd | cut -f2 -d" ")
mongo_db=`echo $mongo_uri | cut -d/ -f 4`

scrapy crawl sapo -s MONGODB_URI=$mongo_uri -s MONGODB_DATABASE=$mongo_db
