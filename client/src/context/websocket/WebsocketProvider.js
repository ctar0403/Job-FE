import React, { useState, useEffect, useContext } from 'react';
import authContext from '../auth/authContext';
import SocketContext from './socketContext';
import io from 'socket.io-client';
import {
  DISCONNECT,
  FETCH_LOBBY_INFO,
  PLAYERS_UPDATED,
  RECEIVE_LOBBY_INFO,
  TABLES_UPDATED,
} from '../../pokergame/actions';
import globalContext from '../global/globalContext';
import config from '../../clientConfig';

const WebSocketProvider = ({ children }) => {
  const { isLoggedIn } = useContext(authContext);
  const { setTables, setPlayers } = useContext(globalContext);

  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeunload', cleanUp);
    window.addEventListener('beforeclose', cleanUp);
    return () => cleanUp();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Always attempt to establish socket connection on mount for guests and logged users
    if (!socket) {
      const s = connect();
      // Ask server for current lobby info for guests as well
      const token = localStorage.token;
      s && s.emit(FETCH_LOBBY_INFO, token);
    }
    return () => {};
    // eslint-disable-next-line
  }, []);

  // When login state changes, request lobby info if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.token;
      window.socket && token && window.socket.emit(FETCH_LOBBY_INFO, token);
    } else {
      // For guests, we keep the socket connection but clear user-specific data
      setPlayers(null);
      setTables(null);
      // Also request lobby info as a guest when user logs out
      window.socket && window.socket.emit(FETCH_LOBBY_INFO, null);
    }
  }, [isLoggedIn]);

  function cleanUp() {
    window.socket && window.socket.emit(DISCONNECT);
    window.socket && window.socket.close();
    setSocket(null);
    setSocketId(null);
    setPlayers(null);
    setTables(null);
  }

  function connect() {
    // If serverURI is empty use same-origin connection (io() without URL). Otherwise pass the configured URI.
    const url = config.serverURI || undefined;
    const socket = io(url, {
      transports: ['websocket'],
      upgrade: false,
    });
    registerCallbacks(socket);
    setSocket(socket);
    window.socket = socket;
    return socket;
  }

  function registerCallbacks(socket) {
    socket.on(RECEIVE_LOBBY_INFO, ({ tables, players, socketId }) => {
      console.log(RECEIVE_LOBBY_INFO, tables, players, socketId);
      setSocketId(socketId);
      setTables(tables);
      setPlayers(players);
    });

    socket.on(PLAYERS_UPDATED, (players) => {
      console.log(PLAYERS_UPDATED, players);
      setPlayers(players);
    });

    socket.on(TABLES_UPDATED, (tables) => {
      console.log(TABLES_UPDATED, tables);
      setTables(tables);
    });
  }

  return (
    <SocketContext.Provider value={{ socket, socketId, cleanUp }}>
      {children}
    </SocketContext.Provider>
  );
};

export default WebSocketProvider;
