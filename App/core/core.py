"""
Core class.

- Checks the modules installed and the integration between them.
- Checks the spelling of an URL to not go any further.
- Calls the modules and stores the data used between modules (url lists, etc).

"""

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import os
from jsonschema import validate
import requests
from threading import Thread
import sys

from App.core.url_list import URLlist
from App.core.url import URL
from App.core.db_adapter import DBAdapter

schema = {
    "title": "JSON from API",
    "type": "object",
    "properties": {
        "user": {"type": "string"},
        "url": {"type": "string"},
        "search_options": {
            "type": "object",
            "properties": {
                "number": {"type": "number"},
                "module": {"type": "string"}
            }
        }
    }
}

api = "http://localhost:3000"

class Core(object):
    def __init__(self):
        self.url = ""
        self.user = ""
        self.action = 0
        self.modules = {}
        self.results = {}
        self.url_list = URLlist()

    def __is_valid_url(self):
        import re
        regex = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return self.url is not None and regex.search(self.url)

    def __check_modules(self):
        # http://stackoverflow.com/questions/3207219/how-to-list-all-files-of-a-directory-in-python
        path = os.getcwd()
        for name in os.listdir(path + "/modules"):
            if os.path.exists(os.path.join(path + name, "module.py")):
                self.modules[name] = True
            else:
                self.modules[name] = False

    def __check_call(self, call):
        try:
            validate(call, schema)
        except:
            return False
        else:
            data = json.load(call)
            self.user = data["user"]
            self.url = data["url"]
            self.actions = json.load(data["actions"])
        return True

    def start(self, call):
        if self.__check_call(call):
            if self.__is_valid_url():
                db = DBAdapter()
                process, web = db.new_process(self.url, 1, "searching")
                self.url_list.put_url(URL(self.url))
                for n, m in self.actions:  # Going through the required modules by the API.
                    if self.modules[m]:  # Looking if the required module is active.
                        if n == 1:
                            from App.modules.crawler.module import main
                            self.url_list = main(URL(self.url))
                        else:
                            if n == 2:
                                from App.modules.sqlinjection.module import main
                                self.results[m] = main(self.url_list)
                            elif n == 3:
                                from App.modules.incorrectsecurity.module import main
                                self.results[m] = main(self.url_list)
                            else:
                                continue
                            data = {
                                "PROCESS": process,
                                "WEB": web,
                                "VULNERABILITY": self.results[m],
                                "USER": self.user
                            }
                            t = Thread(requests.get(api, data=json.dumps(data)))
                            t.start()
                            db.vulnerability_found(process, web, n)
                db.close_connection()
                return True
            else:
                return False
        else:
            return False

def main(petition):
    core = Core()
    core.start(petition)

if __name__ == "__main__":
    main(sys.argv[1])
