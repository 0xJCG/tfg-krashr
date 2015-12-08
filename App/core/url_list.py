__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import queue

from App.core.url import URL

class URLlist(object):
    def __init__(self):
        self.url_list = queue.Queue()
        self.aux = []  # Stores all the urls that are or have been in the queue.

    def get_list(self):
        return self.url_list

    def is_empty(self):
        return self.url_list.empty()

    def put_url(self, url):
        if url not in self.aux:
            self.url_list.put(URL(url))
            self.aux.append(url)
            return True
        return False

    def get_url(self):
        try:
            aux = self.url_list.get(block=False)
            return aux
        except queue.Empty:
            return None

if __name__ == '__main__':
    url_list = URLlist()
