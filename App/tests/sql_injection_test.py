__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest

from App.modules.sqlinjection.sql_injection import SQLInjection

class SQLInjectionTest(unittest.TestCase):
    def setUp(self):
        from App.core.url_list import URLlist
        url_list = URLlist()
        url_list.put_url("http://pvulpix.hol.es")
        self.sqt = SQLInjection(url_list)

    def test_search_injections(self):
        self.assertEqual(self.sqt.search_injections(), False)

if __name__ == '__main__':
    unittest.main()
