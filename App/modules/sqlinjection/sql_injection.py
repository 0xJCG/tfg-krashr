__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

from urllib.parse import urlsplit

# For normal injection; search for login forms, try and if the login form is still there, that injection didn't work.

class SQLInjection(object):

    def __init__(self, url):
        self.url = url
        self.urls = []
        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        self.domain = "{0.scheme}://{0.netloc}/".format(urlsplit(url))
