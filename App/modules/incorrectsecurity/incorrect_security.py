__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import requests
from threading import Thread
from bs4 import BeautifulSoup

from App.core.url import URL
from App.core.url_list import URLlist
from App.core.db_adapter import DBAdapter

api = "http://localhost:3000/saveresult"

class IncorrectSecurity(object):
    def __init__(self, url_list, process, user):
        self.process = process
        self.user = user

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
            self.__save_results(url, 10)
        return True

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
