__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import sys

from App.modules.sqlinjection.sql_injection import SQLInjection

def main(url):
    sql_injection = SQLInjection(url)
    return sql_injection.search_injections()

if __name__ == "__main__":
    main(sys.argv[1])
