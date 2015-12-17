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

search_schema = {
    "title": "JSON from API",
    "type": "object",
    "properties": {
        "user": {"type": "string"},
        "url": {"type": "string"},
        "search_options": {
            "type": "array",
            "items": {
                "number": {"type": "number"},
                "module": {"type": "string"}
            },
            "required": ["number", "module"]
        }
    },
    "required": ["user", "url", "search_options"]
}

process_status_schema = {
    "title": "JSON from API",
    "type": "object",
    "properties": {
        "user": {"type": "string"},
        "process": {"type": "integer"}
    },
    "required": ["user", "process"]
}

current_status_schema = {
    "title": "JSON from API",
    "type": "object",
    "properties": {
        "user": {"type": "string"}
    },
    "required": ["user"]
}

api = "http://localhost:3000/"

class Core(object):
    def __init__(self):
        self.modules = {}
        self.user = ""
        self.url = ""
        self.actions = []
        # self.p = 0

    def __check_call(self, call):
        try:
            validate(call, search_schema)
        except:
            try:
                validate(call, current_status_schema)
            except:
                return 0
            else:
                # data = json.load(call)
                self.user = call["user"]
                # self.p = data["url"]
                return 2
        else:
            data = json.load(call)
            self.user = data["user"]
            self.url = data["url"]
            self.actions = json.load(data["actions"])
        return 1

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

    def start(self, call):
        c = self.__check_call(call)
        if c == 1:  # Search option.
            if self.__is_valid_url():
                self.__check_modules()
                url_list = URLlist()

                db = DBAdapter()
                process = db.new_process(self.url, self.user, 1, 1)  # Status: 1, processing.
                db.close_connection()

                if process == 0:  # The user has a search going on.
                    return False

                # data = {
                #    "PROCESS": process,
                #    "WEB": self.url,
                #    "USER": self.user
                # }
                # t = Thread(requests.post(api + "/newprocess", data=json.dumps(data)))
                # t.start()

                url_list.put_url(URL(self.url))
                for n, m in self.actions:  # Going through the required modules by the API.
                    if self.modules[m]:  # Looking if the required module is active.
                        if n == 1:
                            from App.modules.crawler.module import main
                            url_list = main(process, URL(self.url))
                        else:
                            if n == 2:
                                from App.modules.sqlinjection.module import main
                                main(url_list, process, self.user)
                            elif n == 3:
                                from App.modules.incorrectsecurity.module import main
                                main(url_list, process, self.user)
                            else:
                                continue
                db = DBAdapter()
                db.update_process(process, 5)  # Status: 5, finished.
                db.close_connection()
        elif c == 2:  # Get status option.
            db = DBAdapter()
            # status = db.get_process_status(self.p, self.user)
            process = db.get_current_process_status(self.user)
            db.close_connection()

            # data = {
            #    "PROCESS": self.p,
            #    "STATUS": status
            # }
            # t = Thread(requests.post(api + "/status", data=json.dumps(data)))
            # t.start()

            data = {
                "web": process[1],
                "date": process[2],
                "stype": process[0],
                "status": process[3]
            }
            # return json.dumps(data)
            return data
        else:  # Wrong call.
            return False

        return True  # If we get here, everything was right.

def main(petition):
    core = Core()
    core.start(petition)

if __name__ == "__main__":
    main(sys.argv[1])
