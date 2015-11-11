from bs4 import BeautifulSoup

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

class IncorrectSecurity(object):

    def __init__(self, urls):
        self.urls = urls

    def search_security_flaws(self):
        while True:
            url = self.urls.get_url()
            if url is None:
                break
            soup = BeautifulSoup(url.get_url())
            forms = soup('form')
            for form in forms:
                inputs = BeautifulSoup(form).soup('input')
                for input in inputs:
                    type = input.get("type")
                    if type == "hidden":
                        name = input.get("name")
                        if name == "hash":
                            return True
        return False
