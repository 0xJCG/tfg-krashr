__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"


import sys

from backend.modules.crawler.crawler import Crawler

def main(url, process):
    crawler = Crawler(url, process)
    aux = crawler.crawl()
    return aux

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
