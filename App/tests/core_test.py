__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest

from App.core.core import Core

# The Core private methods must be put public.

valid_call = {
    "user": "Jonathan",
    "url": "http://pvulpix.hol.es",
    "search_options": [{
        "number": 1,
        "module": "crawler"
    }]
}

valid_call2 = {
    "user": "prueba"
}

invalid_call = {
    "user": "Jonathan",
    "url": "http://pvulpix.hol.es",
    "search_options": {
        "number": 1,
    }
}

class CoreTest(unittest.TestCase):
    def setUp(self):
        self.core = Core()
        self.core.url = "http://pvulpix.hol.es"

    # def test_is_valid_url(self):
        # Must comment the else part to pass the test.
    #    self.assertEqual(self.core.is_valid_url(), True)

    # def test_check_modules(self):
    #    self.core.check_modules()
    #    self.assertEqual(self.core.modules["crawler"], True)
    #    self.assertEqual(self.core.modules["incorrectsecurity"], True)
    #    self.assertEqual(self.core.modules["sqlinjection"], True)

    def test_check_call(self):
        self.assertEqual(self.core.check_call(valid_call2), 2)
    #    self.assertEqual(self.core.check_call(invalid_call), False)

if __name__ == '__main__':
    unittest.main()
