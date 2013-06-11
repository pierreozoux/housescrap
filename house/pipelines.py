from scrapy.exceptions import DropItem
import re
import json
import urllib2
import urllib
import urlparse

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html

class SizePipeline(object):
    def process_item(self, item, spider):
      item['size'] = item['title'].split(",")[0].split()[-1]
      return item

class ImagePipeline(object):
  def process_item(self, item, spider):
    image_urls = []
    for image_url in item['image_urls']:
      image_urls.append(re.findall(r'\'(.+?)\'',image_url)[0])
    item['image_urls'] = image_urls
    return item

class AddressPipeline(object):
  def process_item(self, item, spider):
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + item['address'] + "&sensor=true"
    result = json.load(urllib2.urlopen(url.replace(" ","%20")))['results'][0]
    item['lat'] = result['geometry']['location']['lat']
    item['lng'] = result['geometry']['location']['lng']
    return item
