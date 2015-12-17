__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest

from App.core.db_adapter import DBAdapter

class SQLInjectionTest(unittest.TestCase):
    def setUp(self):
        self.dba = DBAdapter()

    # def test_search_injections(self):
    #    self.assertEqual(self.sqt.search_injections(), False)

    def test_new_process(self):
        p = self.dba.new_process('http://google.es', 'prueba', '1', '1')
        self.assertEqual(p, 2)
        self.dba.close_connection()

    # def test_vulnerability_found(self, process, web, v_type):
    #    self.dba.close_connection()

    def test_get_process_status(self):
        s = self.dba.get_process_status(2, 'prueba')
        self.assertEqual(s, 1)
        self.dba.close_connection()

    def test_get_current_process_status(self):
        p = self.dba.get_current_process_status('prueba')
        self.assertEqual(p[3], 1)
        self.dba.close_connection()

    # def test_update_process(self, process, s_type):
    #    self.dba.close_connection()

if __name__ == '__main__':
    unittest.main()
