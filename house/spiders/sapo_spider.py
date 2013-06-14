# -*- coding: utf-8 -*-
from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from house.items import HouseItem
from urlparse import urljoin
from scrapy.http import Request
import re
import json
import urllib2
import urllib
import urlparse
import httplib2



class SapoSpider(BaseSpider):
  name = "sapo"
  allowed_domains = ["casa.sapo.pt"]
  start_urls = [
      "http://casa.sapo.pt/Alugar/Apartamentos/Lisboa/?sa=11&aop=1&gp=450&lp=300&mpr=1,2,3,4&or=10&pn=1"
  ]

  def parse(self, response):
    hxs = HtmlXPathSelector(response)
    houses = hxs.select('//div[contains(@id, "ctl00_MC_result")]')
    for house in houses:
      link = house.select('span/a/@href')[0].extract()
      yield Request(link,callback=self.parseHouse)
  
    try:
      next_page = hxs.select('//a[contains(@class, "paginadorNext")]/@href').extract()[0]
    except:
      print "End page"
    else:
      next_url = urljoin(response.url,next_page)
      #yield Request(next_url,callback=self.parse)

  def parseHouse(self, response):
    hxs = HtmlXPathSelector(response)
    item = HouseItem()
    item['title'] = hxs.select('//div[contains(@class, "detaiHeaderProperty")]/text()')[0].extract()
    item['address'] = hxs.select('//div[contains(@class, "detaiHeaderLocation")]/text()')[0].extract()
    item['link'] = response.url
    item['desc'] = hxs.select('//div[contains(@class, "detailDescription")]/h2/text()').extract()
    item['price'] = hxs.select('//div[contains(@class, "detailHeaderPriceValue")]/text()')[0].extract().strip()
    item['state'] = hxs.select('//div[contains(@class, "detailInfo")]/p/*[contains(text(),"Estado")]').select('../span/text()').extract()
    item['publication'] = hxs.select('//div[contains(@class, "detailInfo")]/p/*[contains(text(),"Publicado")]').select('../span/text()').extract()
    item['size'] = item['title'].split(",")[0].split()[-1]

    image_urls = hxs.select('//a[contains(@id, "SmallFotos")]/@onclick').extract()

    item['image_urls'] = []
    for image_url in image_urls:
      item['image_urls'].append(re.findall(r'\'(.+?)\'',image_url)[0])

    iri = "http://maps.googleapis.com/maps/api/geocode/json?address=" + item['address'] + "&sensor=true"
    result = json.load(urllib2.urlopen(httplib2.iri2uri(iri).replace(" ","%20")))['results'][0]
    item['lat'] = result['geometry']['location']['lat']
    item['lng'] = result['geometry']['location']['lng']
    
    yield item
