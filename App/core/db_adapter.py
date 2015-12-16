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
    def __init__(self):
        self.conn = psycopg2.connect(database="pvulpix", user="postgres", password="", host="127.0.0.1", port="5432")

    def close_connection(self):
        self.conn.close()

    def new_process(self, url, s_type, status):
        cur = self.conn.cursor()
        process = cur.callproc("new_process", [url, s_type, status])
        cur.close()
        self.conn.commit()
        return process

    def vulnerability_found(self, process, web, v_type):
        cur = self.conn.cursor()
        cur.callproc("vulnerability_found", [process, web, v_type])
        cur.close()
        self.conn.commit()

    def get_process_status(self, process, user):
        cur = self.conn.cursor()
        status = cur.callproc("get_process_status", [process, user])
        cur.close()
        self.conn.commit()
        return status

    def get_last_process(self, user):
        cur = self.conn.cursor()
        status = cur.callproc("get_last_process", [user])
        cur.close()
        self.conn.commit()
        return status

    def update_process(self, process, s_type):
        cur = self.conn.cursor()
        cur.callproc("update_process", [process, s_type])
        cur.close()
        self.conn.commit()
