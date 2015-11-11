from bs4 import BeautifulSoup
import urllib

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

# For normal injection; search for login forms, try and if the login form is still there, that injection didn't work.

class SQLInjection(object):

    def __init__(self, urls):
        self.urls = urls
        # http://stackoverflow.com/questions/9626535/get-domain-name-from-url
        #self.domain = "{0.scheme}://{0.netloc}/".format(urllib.parse.urlsplit(url))

    def search_injections(self):
        while True:
            url = self.urls.get_url()
            if url is None:
                break
            self.__signin_attemp(url)
            self.__blind_sqli(url)
            self.__serialized_sqli(url)

    def __signin_attemp(self, url):
        soup = BeautifulSoup(url.get_content())
        forms = soup('form')
        for form in forms:
            action = form.get("action")
            inputs = BeautifulSoup(form).soup('input')
            if len(inputs) == 2:
                data = []
                for input in inputs:
                    data.append(input.get("name"))
                req = urllib.Request.post(action, data=urllib.urlenconde(data))
                response = urllib.urlopen(req)
        return False

    def __blind_sqli(self, url):
        params = self.__get_parameters(url)
        return False

    def __serialized_sqli(self, url):
        params = self.__get_parameters(url)
        return False

    def __get_parameters(self, url):
        parsed = urllib.parse.urlparse(url.get_url())
        params = urllib.parse.parse_qsl(parsed.query)
        return params
