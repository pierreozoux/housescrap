# -*- coding: utf-8 -*-
from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from scrapy.exceptions import CloseSpider
from house.items import HouseItem
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
import locale

class CustojustoSpider(BaseSpider):
  name = "custojusto"
  allowed_domains = ["custojusto.pt"]
  start_urls = [
      "http://www.custojusto.pt/Lisboa?ca=14_s&th=1&q=&cg=1020&w=114%3A213&st=u&ps=&pe=&ros=&roe=&ss=&se="
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
      log.msg("End page", level=log.INFO)
    else:
      next_url = urljoin(response.url,next_page)
      # uncomment the next one if you want to scrap more than the first page
      #yield Request(next_url,callback=self.parse)

  def parseHouse(self, response):
    hxs = HtmlXPathSelector(response)
    item = HouseItem()
    item['currency'] = "€"
    item['title'] = hxs.select('//h1[contains(@class, "long_subject")]/text()').extract()
    Concelho = hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Concelho")]').select('../text()').extract()[1].strip()
    Freguesia = ""
    try:
      Freguesia = hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Freguesia")]').select('../text()').extract()[1].strip()
    except:
      print "No Freguesia"

    item['address'] = Concelho + ' ' + Freguesia
    item['link'] = response.url
    item['size'] = int(hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Tipologia")]').select('../text()').extract()[1].strip().replace("T","")[0])

    item['desc'] = hxs.select('//div[contains(@class, "body_text")]/text()').extract()

    item['price'] = hxs.select('//span[contains(@class, "coolprice")]/text()').extract()[0].strip()

    locale.setlocale(locale.LC_ALL, 'pt_PT')
    item['publication'] = hxs.select('//p[contains(@class,"right")]/text()').extract()[1].strip()
    if re.match("Ontem|Hoje", item['publication']) is None:
      log.msg("date is older, analyse...", level=log.INFO)
      computed_date = datetime.datetime.strptime(item['publication'], "%d %b %H:%M")
      if datetime.date.today().month is 1 and computed_date.month is 12:
        year = (datetime.date.today() - datetime.timedelta(days=365)).year
      else:
        year = datetime.date.today().year

      computed_date = datetime.datetime.strptime(item['publication'] + ' %d' % year, "%d %b %H:%M %Y")
      one_month_ago = datetime.datetime.today() - datetime.timedelta(days=30)
      if computed_date < one_month_ago:
        log.msg("Too old...", level=log.INFO)
        raise CloseSpider('Houses are too old')

    image_from_script = hxs.select('//div[contains(@id, "slider")]/script/text()').extract()
    images_urls = image_from_script[0].split('[')[1].split(',')
    images_urls[-1] = images_urls[-1].split(']')[0]
    item['lat'] = float(hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Ver mapa")]').select('../a/@onclick').extract()[0].split(',')[0].split('(')[1])
    item['lng'] = float(hxs.select('//div[contains(@class, "info right")]/ul/li/*[contains(text(), "Ver mapa")]').select('../a/@onclick').extract()[0].split(',')[1])

    item['image_urls'] = []
    for image_url in images_urls:
     item['image_urls'].append(image_url.replace("'",""))

    yield item
