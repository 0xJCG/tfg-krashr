from http.client import HTTPConnection
from bs4 import BeautifulSoup
from urllib.parse import urlsplit

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class Fetcher(object):

    def __init__(self, url):
        self.url = url
        self.urls = []
        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        self.domain = "{0.scheme}://{0.netloc}/".format(urlsplit(url))

    def __getitem__(self, x):
        return self.urls[x]

    def fetch(self):
        try:
            content = HTTPConnection(self.url).getresponse().read()
            soup = BeautifulSoup(content)
            tags = soup('a')
        except HTTPConnection.HTTPException:
            tags = []
        finally:
            for tag in tags:
                href = tag.get("href")
                domain = "{0.scheme}://{0.netloc}/".format(urlsplit(href))
                if href is not None and self.url not in self and domain == self.domain:
                    self.urls.append(self.url)
