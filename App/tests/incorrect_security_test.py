__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import unittest
from ..modules.incorrectsecurity.module import main

class TestUM(unittest.TestCase):

    def setUp(self):
        pass

    def test_x(self):
        self.assertEqual(1 == 1, True)

if __name__ == '__main__':
    unittest.main()
