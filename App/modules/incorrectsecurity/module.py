__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import sys

from App.modules.incorrectsecurity.incorrect_security import IncorrectSecurity

def main(url_list):
    incorrect_security = IncorrectSecurity(url_list)
    return incorrect_security.search_security_flaws()

if __name__ == "__main__":
    main(sys.argv[1])
