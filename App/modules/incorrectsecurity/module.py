from .incorrect_security import IncorrectSecurity
import sys

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

def main(url):
    incorrect_security = IncorrectSecurity(url)
    return incorrect_security.search_security_flaws()

if __name__ == "__main__":
    main(sys.argv[1])

