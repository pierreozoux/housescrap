# http://www.custojusto.pt/Lisboa?ca=14_s&th=1&q=&cg=1020&w=114%3A213&st=u&ps=3&pe=5&ros=3&roe=5&ss=&se=&sl=

# -*- coding: utf-8 -*-
from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from house.items import HouseItem
from urlparse import urljoin
from scrapy.http import Request
import unicodedata


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
    item['price'] = hxs.select('//div[contains(@class, "detailHeaderPriceValue")]/text()')[0].extract().replace(u"€","").strip()
    item['state'] = hxs.select('//div[contains(@class, "detailInfo")]/p')[0].select('span/text()').extract()
    item['publication'] = hxs.select('//div[contains(@class, "detailInfo")]/p')[4].select('span/text()').extract()
    item['image_urls'] = hxs.select('//a[contains(@id, "SmallFotos")]/@onclick').extract()

    yield item
