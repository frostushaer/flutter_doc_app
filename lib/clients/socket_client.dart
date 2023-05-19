import 'package:flutter_docs_app/constants.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketClient {
  io.Socket? socket;
  static SocketClient? _instance;

  SocketClient._internal() {
    socket = io.io(host, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    socket!.connect;
  }

  static SocketClient get instance {
    _instance ??= SocketClient._internal(); //if not present then create
    return _instance!;
  }
}
