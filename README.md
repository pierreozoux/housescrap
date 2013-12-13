housescrap
==========

A lot of house finder are just crap, right? So, let's scrap their houses and display them in a proper map!!

[Live demo](http://pierreozoux.github.io/housescrap/)

![picture](https://raw.github.com/pierreozoux/housescrap/master/assets/readme.jpg)

Installation
============
````
sudo easy_install pip
sudo pip install Scrapy
sudo pip install pil
sudo pip install httplib2
sudo pip install "ScrapyMongoDB"
gem install serve-this
sudo python setup.py install
````
Usage
=====
````
./script/start.sh
````

Hack
====
How to add a new crawler : copy one from house/spider

Start a scrapy shell : 
````
scrapy shell http://www.custojusto.pt/Lisboa\?ca\=14_s\&th\=1\&q\=\&cg\=1020\&w\=114%3A213\&st\=u\&ps\=3\&pe\=5\&ros\=3\&roe\=5\&ss\=\&se\=\&sl\=

# and try to find the right div with the help of inscpect element of chrome and/or Firebug
# and replace in the python file of the spider
>>> houses = hxs.select('//div[contains(@class, "lista")]')
>>> house = houses[0]
>>> house.extract()
....
````

ToDo
====
- add google-connect button
- better "pop-up" to connect
- in div visualisation
- about page to explain the project/ bio attitude
- better design of the form
- automatise house cleaning in the database
- clean houses from user data_store
