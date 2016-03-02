"""
    http://insiderattack.blogspot.com.es/2013/07/hacker-python-3-multi-threaded-tcp-echo.html
    http://stackoverflow.com/questions/17667903/python-socket-receive-large-amount-of-data
"""

__version__ = "0.5.0"
__license__ = "GPL v2.0"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import socketserver

from backend.core.core import Core

class Service(socketserver.BaseRequestHandler):
    def handle(self):
        print("[+] Client " + str(self.client_address[0]) + ":" + str(self.client_address[1]) + " connected.")

        data = self.request.recv(1024).decode('UTF-8')  # The data received is like 11#{"foo":"bar"}.
        head, sep, tail = data.partition('#')  # Getting the data after the # character.
        data = json.loads(tail)  # That data is a JSON and have to be loaded.

        core = Core()
        response = core.start(data)

        if isinstance(response, dict):
            if "response" not in response:
                d = str(response['date'])
                response['date'] = d
            # return response
            # http://stackoverflow.com/questions/23876608/how-to-send-the-content-of-a-dictionary-properly-over-sockets-in-python3x
            self.request.sendall(json.dumps(response).encode('utf-8'))

        print("[-] Client " + str(self.client_address[0]) + ":" + str(self.client_address[1]) + " disconnected.")
        self.request.close()

class ThreadedTCPServer(socketserver.ForkingMixIn, socketserver.TCPServer):
    pass

print("Listening for incoming connections...")

t = ThreadedTCPServer(('localhost', 9999), Service)
t.serve_forever()
