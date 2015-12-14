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

import os
import sys
import json
import requests
from threading import Thread
from jsonschema import validate

from App.core.url import URL
from App.core.url_list import URLlist
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
            },
            "required": ["number", "module"]
        }
    },
    "required": ["user", "url", "search_options"]
}

api = "http://localhost:3000/"

class Core(object):
    def __init__(self, petition):
        self.modules = {}
        self.results = {}
        self.petition_validation = self.__check_call(petition)
        self.__check_modules()
        self.url_list = URLlist()

        db = DBAdapter()
        self.process, web = db.new_process(self.url, 1, "searching")
        db.close_connection()

        data = {
            "PROCESS": self.process,
            "WEB": self.url,
            "USER": self.user
        }
        t = Thread(requests.post(api + "/newprocess", data=json.dumps(data)))
        t.start()

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
            pass
        return True

    def __check_modules(self):
        # http://stackoverflow.com/questions/5137497/find-current-directory-and-files-directory
        path = os.path.dirname(os.getcwd())
        path = os.path.join(path, "modules")
        for name in os.listdir(path):
            folder = os.path.join(path, name)
            if os.path.exists(os.path.join(folder, "module.py")):
                self.modules[name] = True
            else:
                self.modules[name] = False

    def __is_valid_url(self):
        import re
        regex = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return self.url is not None and regex.match(self.url) is not None

    def start(self):
        if self.petition_validation:
            if self.__is_valid_url():
                self.url_list.put_url(URL(self.url))
                for n, m in self.actions:  # Going through the required modules by the API.
                    if self.modules[m]:  # Looking if the required module is active.
                        if n == 1:
                            from App.modules.crawler.module import main
                            self.url_list = main(URL(self.url))
                        else:
                            if n == 2:
                                from App.modules.sqlinjection.module import main
                                main(self.url_list, self.process, self.user)
                            elif n == 3:
                                from App.modules.incorrectsecurity.module import main
                                main(self.url_list, self.process, self.user)
                            else:
                                continue
        data = {
            "PROCESS": self.process,
            "STATUS": "finished"
        }
        t = Thread(requests.post(api + "/updateprocess", data=json.dumps(data)))
        t.start()

def main(petition):
    core = Core(petition)
    core.start()

if __name__ == "__main__":
    main(sys.argv[1])
