# -*- coding: utf-8 -*-
from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from house.items import HouseItem
from urlparse import urljoin
from scrapy.http import Request
import json
import urllib2
import urllib
import urlparse
import httplib2

class CustojustoSpider(BaseSpider):
  name = "custojusto"
  allowed_domains = ["custojusto.pt"]
  start_urls = [
      "http://www.custojusto.pt/Lisboa?ca=14_s&th=1&q=&cg=1020&w=114:213&st=u&ps=3&pe=5&ros=3&roe=5&ss=&se="
  ]

  def parse(self, response):
    hxs = HtmlXPathSelector(response)
    houses = hxs.select('//div[contains(@class, "lista")]')
    for house in houses:
      link = house.select('div/a/@href').extract()[0]
      yield Request(link,callback=self.parseHouse)
  
    try:
      next_page = hxs.select('//div[contains(@id, "content_footer")]/div/div/*[contains(text(),"Seguinte")]/@href').extract()[0]
    except:
      print "End page"
    else:
      next_url = urljoin(response.url,next_page)
      # uncomment the next one if you want to scrap more than the first page
      yield Request(next_url,callback=self.parse)

  def parseHouse(self, response):
    hxs = HtmlXPathSelector(response)
    item = HouseItem()
    item['title'] =hxs.select('//h1[contains(@class, "long_subject")]/text()').extract()
    Concelho = hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Concelho")]').select('../text()').extract()[1].strip()
    Freguesia = ""
    try:
      Freguesia = hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Freguesia")]').select('../text()').extract()[1].strip()
    except:
      print "No Freguesia"

    item['address'] = Concelho + ' ' + Freguesia
    item['link'] = response.url
    item['size'] = hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Tipologia")]').select('../text()').extract()[1].strip()

    item['desc'] = hxs.select('//div[contains(@class, "body_text")]/text()').extract()

    item['price'] = hxs.select('//span[contains(@class, "coolprice")]/text()').extract()[0].strip()
    item['publication'] = hxs.select('//p[contains(@class,"right")]/text()').extract()[1].strip()

    image_from_script = hxs.select('//div[contains(@id, "slider")]/script/text()').extract()
    images_urls = image_from_script[0].split('[')[1].split(',')

    try:
      if "googleapis" in images_urls[-3]:
        item['lng'] = images_urls[-1].split("'")[0]
        item['lat'] = images_urls[-2].split('C')[-1]
        images_urls.remove(images_urls[-1])
        images_urls.remove(images_urls[-1])
        images_urls.remove(images_urls[-1])
      else:
        raise RunExceptCode
    except:
      iri = "http://maps.googleapis.com/maps/api/geocode/json?address=" + item['address'] + "&sensor=true"
      result = json.load(urllib2.urlopen(httplib2.iri2uri(iri).replace(" ","%20")))['results'][0]
      item['lat'] = result['geometry']['location']['lat']
      item['lng'] = result['geometry']['location']['lng']


    item['image_urls'] = []
    for image_url in images_urls:
     item['image_urls'].append(image_url.replace("'",""))

    yield item
