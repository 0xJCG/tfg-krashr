__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"


import sys

from App.modules.crawler.crawler import Crawler

def main(url, process):
    crawler = Crawler(url, process)
    aux = crawler.crawl()
    print(aux)
    return aux

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
