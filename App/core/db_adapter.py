"""
PostgreSQL adapter.

- Singleton patron: http://stackoverflow.com/questions/31875/is-there-a-simple-elegant-way-to-define-singletons-in-python

- psycopg import error:
    https://gist.github.com/lym/456ec863d3fc3c63cab4
    http://stackoverflow.com/questions/20789063/get-fatal-error-when-install-psycopg2
"""

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import psycopg2

class DBAdapter:
    """
    A non-thread-safe helper class to ease implementing singletons.
    This should be used as a decorator -- not a metaclass -- to the
    class that should be a singleton.

    The decorated class can define one `__init__` function that
    takes only the `self` argument. Other than that, there are
    no restrictions that apply to the decorated class.

    To get the singleton instance, use the `Instance` method. Trying
    to use `__call__` will result in a `TypeError` being raised.

    Limitations: The decorated class cannot be inherited from.

    """

    def __init__(self, decorated):
        self._decorated = decorated
        self.conn = psycopg2.connect(database="pvulpix", user="postgres", password="", host="127.0.0.1", port="5432")

    def Instance(self):
        """
        Returns the singleton instance. Upon its first call, it creates a
        new instance of the decorated class and calls its `__init__` method.
        On all subsequent calls, the already created instance is returned.

        """
        try:
            return self._instance
        except AttributeError:
            self._instance = self._decorated()
            return self._instance

    def __call__(self):
        raise TypeError('Singletons must be accessed through `Instance()`.')

    def __instancecheck__(self, inst):
        return isinstance(inst, self._decorated)

    def new_process(self, url, stype, status):
        cur = self.conn.cursor()
        cur.callproc("new_process", [url, stype, status])
        cur.close()
        self.conn.commit()
        self.conn.close()
