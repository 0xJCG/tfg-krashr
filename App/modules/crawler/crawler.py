__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

from App.core.url import URL
from App.core.url_list import URLlist
from App.modules.crawler.fetcher import Fetcher

class Crawler(object):
    def __init__(self, root):
        self.queue = URLlist()
        self.queue.put_url(root)
        self.final_list = URLlist()
        self.final_list.put_url(root)

    def crawl(self):
        while True:
            url = self.queue.get_url()

            if url is None:
                break

            self.__fetch_urls(url.get_url())

        return self.final_list

    def __fetch_urls(self, url):
        page = Fetcher(url)
        response = page.fetch()

        for link in response:
            self.queue.put_url(link)
            self.final_list.put_url(link)
