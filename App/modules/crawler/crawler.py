from .fetcher import Fetcher
from ...core.url_list import URLlist

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class Crawler(object):

    def __init__(self, root):
        self.root = root
        self.queue = URLlist()

    def crawl(self):
        self.__fetch_urls(self.root)

        while True:
            url = self.queue.get_url()

            if url is None:
                break

            self.__fetch_urls(url)

        return self.queue.get_visited()

    def __fetch_urls(self, url):
        page = Fetcher(url)
        page.fetch()

        for link in page.urls:
            self.queue.put_url(link)
