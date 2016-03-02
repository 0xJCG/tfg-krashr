__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

from backend.core.url_list import URLlist
from backend.core.db_adapter import DBAdapter
from backend.modules.crawler.fetcher import Fetcher

class Crawler(object):
    def __init__(self, process, root):
        self.queue = URLlist()
        self.queue.put_url(root)
        self.final_list = URLlist()
        self.final_list.put_url(root)

        db = DBAdapter()
        db.update_process(process, 2)  # Status: 2, crawling.
        db.close_connection()

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
