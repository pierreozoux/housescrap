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
  'house.pipelines.SizePipeline',
  'house.pipelines.ImagePipeline',
  'house.pipelines.AddressPipeline',
  ]

IMAGES_STORE = '/Users/pierreozoux/Documents/scrapy/house/images'
# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'house (+http://www.yourdomain.com)'
