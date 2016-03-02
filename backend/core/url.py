__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import sys
import requests
from bs4 import BeautifulSoup

class URL(object):
    def __init__(self, path):
        self.url = path

        r = requests.get(self.url, allow_redirects=False)

        if r.status_code == requests.codes.ok:
            self.online = True
            # self.content = BeautifulSoup(r.text)
            # self.content = r.text
            aux = BeautifulSoup(r.text)
            self.content = aux('body')[0]  # Warning! It's a bs4 object.
        else:
            self.online = False
            self.content = None

    def get_url(self):
        return self.url

    def is_online(self):
        return self.online

    def get_content(self):
        return self.content

if __name__ == '__main__':
    url = URL(sys.argv[1])
