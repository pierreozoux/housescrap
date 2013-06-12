#!/bin/bash
mv item_sapo.csv item_sapo.csv.old
mv item_custojusto.csv item_custojusto.csv.old
scrapy crawl sapo -o item_sapo.csv -t csv
scrapy crawl custojusto -o item_custojusto.csv -t csv
cat item_sapo.csv > item.csv
cat item_custojusto.csv >> item.csv
serve-this
