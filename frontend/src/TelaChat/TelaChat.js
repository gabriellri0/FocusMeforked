import React from 'react';
import ChatInterface from '../componentes/ChatInterface/ChatInterface';
import styles from './TelaChat.module.css';
import { Link } from 'react-router-dom';

function TelaChat() {
  return (
    <div className={styles.telaChatWrapper}>

      <div className={styles.chatHeader}>
        <Link to="/" className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
          </svg>
        </Link>
        <h2 className={styles.chatTitle}>Chat</h2>
      </div>

      <div className={styles.chatWindow}>
        <ChatInterface />
      </div>

    </div>

  );
}

export default TelaChat;