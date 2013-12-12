# -*- coding: utf-8 -*-
from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from scrapy.exceptions import CloseSpider
from house_scrap.items import HouseItem
from urlparse import urljoin
from scrapy.http import Request
import re
import datetime
from scrapy import log
import json
import urllib2
import urllib
import urlparse
import httplib2

class SapoSpider(BaseSpider):
  name = "sapo"
  allowed_domains = ["casa.sapo.pt"]
  start_urls = [
      "http://casa.sapo.pt/Alugar/Apartamentos/Lisboa/?sa=11&or=10&AOP=1"
  ]
  close_down = None


  def parse(self, response):
    hxs = HtmlXPathSelector(response)
    houses = hxs.select('//div[contains(@id, "MC_result")]')
    for house in houses:
      link = house.select('span/a/@href')[0].extract()
      yield Request(link,callback=self.parseHouse)
  
    try:
      next_page = hxs.select('//a[contains(@class, "paginadorNext")]/@href').extract()[0]
    except:
      print "End page"
    else:
      next_url = urljoin(response.url,next_page)
      # uncomment the next one if you want to scrap more than the first page
      yield Request(next_url,callback=self.parse)

  def parseHouse(self, response):
    if self.close_down:
      raise CloseSpider(reason='Duplicate house')
    hxs = HtmlXPathSelector(response)
    item = HouseItem()
    item['currency'] = "€"
    item['title'] = hxs.select('//div[contains(@class, "detaiHeaderProperty")]/text()')[0].extract()
    item['address'] = hxs.select('//div[contains(@class, "detaiHeaderLocation")]/text()')[0].extract()
    item['link'] = response.url
    item['desc'] = hxs.select('//div[contains(@class, "detailDescription")]/h2/text()').extract()
    item['price'] = hxs.select('//div[contains(@class, "detailHeaderPriceValue")]/text()')[0].extract().strip()
    item['state'] = hxs.select('//div[contains(@class, "detailInfo")]/p/*[contains(text(),"Estado")]').select('../span/text()').extract()    
    size_description = hxs.select('//div[contains(@class, "detaiHeaderProperty")]/text()')[0].extract().split(",")[0].strip()
    if size_description == "Quarto":
      item['size'] = 0
    elif size_description == "Apartamento":
      item['size'] = 1
    else:
      item['size'] = int(size_description.split()[-1].replace("T","").strip('+')[0])

    item['publication'] = hxs.select('//div[contains(@class, "detailInfo")]/p/*[contains(text(),"Publicado")]').select('../span/text()').extract()[0]

    computed_date = datetime.datetime.strptime(item['publication'], "%d-%m-%Y")
    one_month_ago = datetime.datetime.today() - datetime.timedelta(days=30)
    if computed_date < one_month_ago:
      log.msg("Too old...", level=log.INFO)
      raise CloseSpider('Houses are too old')

    image_urls = hxs.select('//a[contains(@id, "SmallFotos")]/@onclick').extract()

    item['image_urls'] = []
    for image_url in image_urls:
      item['image_urls'].append(re.findall(r'\'(.+?)\'',image_url)[0])

    iri = "http://maps.googleapis.com/maps/api/geocode/json?address=" + item['address'] + "&sensor=true"
    result = json.load(urllib2.urlopen(httplib2.iri2uri(iri).replace(" ","%20")))['results'][0]
    item['lat'] = result['geometry']['location']['lat']
    item['lng'] = result['geometry']['location']['lng']
    
    yield item
