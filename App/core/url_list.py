from queue import Queue

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class URLlist:
    def __init__(self):
        self.url_list = Queue()
        self.aux_list = []
        self.visited = []

    def get_list(self):
        return self.url_list

    def url_count(self):
        return len(self.aux_list)

    def is_empty(self):
        return self.url_list.empty()

    def put_url(self, url):
        if url not in self.aux_list and url not in self.visited:
            self.url_list.put(url)
            self.aux_list.append(url)
            return True
        return False

    def get_url(self):
        try:
            self.visited.append(self.url_list.get())
            return self.aux_list.pop(0)
        except Queue.Empty:
            return None

    def get_visited(self):
        return self.visited
