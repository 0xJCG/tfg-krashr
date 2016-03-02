"""
PostgreSQL adapter.

- Singleton patron: http://stackoverflow.com/questions/31875/is-there-a-simple-elegant-way-to-define-singletons-in-python

- psycopg import error:
    https://gist.github.com/lym/456ec863d3fc3c63cab4
    http://stackoverflow.com/questions/20789063/get-fatal-error-when-install-psycopg2
"""

__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import psycopg2
import psycopg2.extras

class DBAdapter:
    def __init__(self):
        self.conn = psycopg2.connect(database="", user="", password="", host="127.0.0.1", port="5432")

    def close_connection(self):
        self.conn.close()

    def new_process(self, url, user, s_type, status):
        cur = self.conn.cursor()
        cur.callproc("new_process", [url, user, s_type, status])
        aux = self.conn.cursor('new_process')
        process = aux.fetchone()
        cur.close()
        self.conn.commit()
        return process[0]

    def vulnerability_found(self, process, web, v_type):
        cur = self.conn.cursor()
        cur.callproc("vulnerability_found", [process, v_type, web])
        cur.close()
        self.conn.commit()

    def get_process_status(self, process, user):
        cur = self.conn.cursor()
        cur.callproc("get_process_status", [process, user])
        aux = self.conn.cursor('process_status')
        status = aux.fetchone()
        cur.close()
        self.conn.commit()
        return status[0]

    def get_current_process_status(self, user):
        cur = self.conn.cursor()
        cur.callproc("get_current_process_status", [user])
        aux = self.conn.cursor('current_process_status')
        process = aux.fetchone()
        cur.close()
        self.conn.commit()
        return process

    def update_process(self, process, s_type):
        cur = self.conn.cursor()
        cur.callproc("update_process", [process, s_type])
        cur.close()
        self.conn.commit()
