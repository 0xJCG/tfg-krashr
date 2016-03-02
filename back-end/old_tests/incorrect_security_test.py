__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest

from App.core.url_list import URLlist
from App.modules.csrf.csrf import CSRF

class IncorrectSecurityTest(unittest.TestCase):
    def setUp(self):
        pass

    def test_search_security_flaws(self):
        url_list = URLlist()
        url_list.put_url("http://pvulpix.hol.es/is.html")
        csrf = CSRF(url_list, 1, 1)
        self.assertEqual(csrf.search_security_flaws(), True)

    def test_search_security_flaws2(self):
        url_list = URLlist()
        url_list.put_url("http://pvulpix.hol.es/is2.html")
        csrf = CSRF(url_list, 1, 1)
        self.assertEqual(csrf.search_security_flaws(), False)

if __name__ == '__main__':
    unittest.main()
