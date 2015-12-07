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

    # def test_fetch(self):
    #    self.assertEqual(self.fetcher.fetch(), [])

    def test_crawl(self):
        from App.core.url import URL
        url = URL("http://pvulpix.hol.es")
        self.assertEqual(self.crawler.crawl(), [url])

if __name__ == '__main__':
    unittest.main()
