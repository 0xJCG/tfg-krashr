__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import sys

from backend.modules.csrf.csrf import CSRF

def main(url_list, process, user):
    csrf = CSRF(url_list, process, user)
    return csrf.search_security_flaws()

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
