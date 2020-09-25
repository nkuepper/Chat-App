import React, { useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB2-3e2Mhw0lAHraaohjGRefQa8DWIog30",
  authDomain: "domainchat-79722.firebaseapp.com",
  databaseURL: "https://domainchat-79722.firebaseio.com",
  projectId: "domainchat-79722",
  storageBucket: "domainchat-79722.appspot.com",
  messagingSenderId: "807765447880",
  appId: "1:807765447880:web:ba28b07f8bcaa4758781fd",
  measurementId: "G-R1VWE6MX6Y"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <h1><span role='img' aria-label='sendEmoji'>DomainChat🚩</span></h1>
        <signOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in With Google</button>
  )
}

// eslint-disable-next-line no-unused-vars
function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit" disabled={!formValue}><span role='img' aria-label='sendEmoji'>🕊️</span></button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className = {`message ${messageClass}`}>
      <img src={photoURL} alt='userImg'/>
      <p>{text}</p>
    </div>
  )
}

export default App;