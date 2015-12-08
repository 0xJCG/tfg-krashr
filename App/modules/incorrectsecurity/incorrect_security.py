__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

from bs4 import BeautifulSoup

from App.core.url import URL
from App.core.url_list import URLlist

class IncorrectSecurity(object):
    def __init__(self, url_list):
        if url_list is None:
            self.url_list = URLlist()
        else:
            self.url_list = url_list

    def search_security_flaws(self):
        while True:
            url = self.url_list.get_url()
            if url is None or type(url) is not URL:
                break
            content = url.get_content()
            forms = content('form')
            for form in forms:
                inputs = form('input')
                for i in inputs:
                    t = i.get("type")
                    if t == "hidden":
                        name = i.get("name")
                        if name == "hash":
                            return False
        return True
