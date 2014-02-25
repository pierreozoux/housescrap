# -*- coding: utf-8 -*-
import re
import hashlib
import datetime

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html

def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

class DescHashPipeline(object):
  def process_item(self, item, spider):
    description = ""
    for desc in item['desc']:
      description = description + desc

    item['desc'] = description.strip()
    item['desc_hash'] = hashlib.sha1(item['desc'].encode('utf-8')).hexdigest()
    return item

class TitlePipeline(object):
  def process_item(self, item, spider):
    title = ""
    for line in item['title']:
      title = title + line

    item['title'] = title.strip()
    return item

class PricePipeline(object):
  def process_item(self, item, spider):
    price = item['price'].replace(u"€","").strip().replace(" ", "").replace(".", "")

    item['price'] = int(price)
    return item

class DatePipeline(object):
  def process_item(self, item, spider):
    if re.match("Hoje", item['publication']):
      item['publication'] = unix_time(datetime.datetime.today())
    elif re.match("Ontem", item['publication']):
      item['publication'] = unix_time(datetime.datetime.today() - datetime.timedelta(1))
    else:
      item['publication'] = unix_time(datetime.datetime.strptime(item['publication'], "%d-%m-%Y"))
    return item

