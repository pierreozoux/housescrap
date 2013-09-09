# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/topics/items.html

from scrapy.item import Item, Field

class HouseItem(Item):
    # define the fields for your item here like:
    # name = Field()
    title = Field()
    link = Field()
    desc = Field()
    price = Field()
    currency = Field()
    address = Field()
    lat = Field()
    lng = Field()
    size = Field()
    state = Field()
    publication = Field()
    image_urls = Field()
    desc_hash = Field()
