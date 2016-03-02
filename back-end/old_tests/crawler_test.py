__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest

from App.modules.crawler.crawler import Crawler
from App.modules.crawler.fetcher import Fetcher

class CrawlerTest(unittest.TestCase):
    def setUp(self):
        self.fetcher = Fetcher("http://pvulpix.hol.es")
        self.crawler = Crawler("http://pvulpix.hol.es")

    def test_fetch(self):
        self.assertEqual(self.fetcher.fetch(), ["http://pvulpix.hol.es/sqli.php", "http://pvulpix.hol.es/is.html"])

    def test_crawl(self):
        crawled_urls = self.crawler.crawl()
        url = crawled_urls.get_url().get_url()
        self.assertEqual(url, "http://pvulpix.hol.es")
        url = crawled_urls.get_url().get_url()
        self.assertEqual(url, "http://pvulpix.hol.es/sqli.php")
        url = crawled_urls.get_url().get_url()
        self.assertEqual(url, "http://pvulpix.hol.es/is.html")
        url = crawled_urls.get_url().get_url()
        self.assertEqual(url, "http://pvulpix.hol.es/index.html")
        self.assertEqual(crawled_urls.is_empty(), True)

if __name__ == '__main__':
    unittest.main()
