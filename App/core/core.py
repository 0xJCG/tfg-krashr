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

from .url import URL
import json
import os
from jsonschema import validate

schema = {
    "type": "object",
    "properties": {
        "user": {"type": "string"},
        "url": {"type": "string"},
        "search": {"type": "string"}
    }
}

class Core:

    def __init__(self):
        self.url = ""
        self.action = 0
        self.modules = {}
        self.results = {}

    def __is_valid_url(self):
        import re
        regex = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
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
            self.url = data["url"]
            self.action = data["action"]
        return True

    def start(self, call):
        if self.__check_call(call):
            if self.__is_valid_url():
                for module, status in self.modules:
                    if status:
                        # http://stackoverflow.com/questions/4230725/how-to-execute-a-python-script-file-with-an-argument-from-inside-another-python
                        result = os.system(os.getcwd() + "/modules/" + module + "/module.py", URL(self.url))
                        self.results[module] = result
            else:
                return False
        else:
            return False
