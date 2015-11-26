from queue import Queue

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class URLlist:
    def __init__(self):
        self.url_list = Queue()
        self.visited = []

    def get_list(self):
        return self.url_list

    def is_empty(self):
        return self.url_list.empty()

    def put_url(self, url):
        if url not in self.visited:
            self.url_list.put(url)
            return True
        return False

    def get_url(self):
        try:
            aux = self.url_list.get()
            self.visited.append(aux)
            return aux
        except:
            return None

    def get_visited(self):
        return self.visited
