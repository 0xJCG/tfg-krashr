__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class URL:
    def __init__(self, url):
        self.url = url
        from http.client import HTTPConnection
        conn = HTTPConnection(self.url)
        conn.request('HEAD', '/')
        code = conn.getresponse().getcode()

        if code == 200:
            self.online = True
        else:
            self.online = False

    def get_url(self):
        return self.url

    def is_online(self):
        return self.online
