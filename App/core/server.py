"""
    http://insiderattack.blogspot.com.es/2013/07/hacker-python-3-multi-threaded-tcp-echo.html
    http://stackoverflow.com/questions/17667903/python-socket-receive-large-amount-of-data
"""

__version__ = "0.1"
__copyright__ = "CopyRight (C) 2015 by Jonathan Castro"
__license__ = "Proprietary"
__author__ = "Jonathan Castro"
__author_email__ = "Jonathan Castro, jonathancastrogonzalez at gmail dot com"

import json
import socket
import struct
import threading

from App.core.core import Core

class ClientThread(threading.Thread):
    def __init__(self, i, p, cs):
        threading.Thread.__init__(self)
        self.ip = i
        self.port = p
        self.client_socket = cs
        print("[+] New thread started for " + i + ": " + str(p))

    def run(self):
        print("Connection from : " + ip + ": " + str(port))

        # Read message length and unpack it into an integer
        # raw_msg_len = self.__receive_all(4)
        # print(2)
        # if not raw_msg_len:
        #    return None
        # msg_len, = struct.unpack('>I', raw_msg_len)[0]
        # Read the message data
        # data = self.__receive_all(msg_len)
        data = self.client_socket.recv(1024)

        data = json.loads(str(data)[5:-1])

        core = Core()
        response = core.start(data)
        d = str(response['date'])

        response['date'] = d

        print("Client at " + self.ip + " disconnected...")

        # return response
        # http://stackoverflow.com/questions/23876608/how-to-send-the-content-of-a-dictionary-properly-over-sockets-in-python3x
        self.client_socket.sendall(json.dumps(response).encode('utf-8'))
        pass

    def __receive_all(self, n):
        # Helper function to receive n bytes or return None if EOF is hit
        data = ''
        while len(data) < n:
            packet = self.client_socket.recv(n - len(data))
            if not packet:
                return None
            data += packet
        return data

host = "0.0.0.0"
port = 9999

tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# tcp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

tcp_socket.bind((host, port))

while True:
    tcp_socket.listen(4)
    print("Listening for incoming connections...")
    (client_socket, (ip, port)) = tcp_socket.accept()

    #pass clientsock to the ClientThread thread object being created
    new_thread = ClientThread(ip, port, client_socket)
    new_thread.start()
