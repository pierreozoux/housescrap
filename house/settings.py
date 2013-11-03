# Scrapy settings for house project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/topics/settings.html
#

BOT_NAME = 'house'

SPIDER_MODULES = ['house.spiders']
NEWSPIDER_MODULE = 'house.spiders'

ITEM_PIPELINES = [
  'house.pipelines.DescHashPipeline',
  'house.pipelines.TitlePipeline',
  'house.pipelines.PricePipeline',
  'scrapy_mongodb.MongoDBPipeline'
  ]


MONGODB_URI = 'mongodb://127.0.0.1:3002/'
MONGODB_DATABASE = 'meteor'

MONGODB_COLLECTION = 'houses'
MONGODB_UNIQ_KEY = 'desc_hash'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'house (+http://www.yourdomain.com)'
