#!/bin/bash

mkdir data || true
curl -o data/20news.tar.gz http://qwone.com/~jason/20Newsgroups/20news-bydate.tar.gz

(cd data && tar -xf 20news.tar.gz)
