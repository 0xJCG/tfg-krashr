__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlsplit

class Fetcher(object):
    def __init__(self, url):
        self.url = url
        self.urls = []
        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        self.domain = "{0.scheme}://{0.netloc}/".format(urlsplit(url))

    def __getitem__(self, x):
        return self.urls[x]

    def fetch(self):
        tags = []
        try:
            r = requests.get(self.url, allow_redirects=False)
            soup = BeautifulSoup(r.text)
            tags = soup('a')
        except requests.RequestException:
            tags = []
        finally:
            for tag in tags:
                href = tag.get("href")
                domain = "{0.scheme}://{0.netloc}/".format(urlsplit(href))
                if domain == ":///": # The link may be relative.
                    domain = self.domain
                    href = domain + href
                if href is not None and href not in self.urls and domain == self.domain:
                    self.urls.append(href)
        return self.urls
