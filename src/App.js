import React from 'react';
import './App.css';
import app from 'firebase/app';
import * as firebase from 'firebase';
import { Widget, addResponseMessage, addUserMessage, toggleWidget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const firebaseConfig = {
  apiKey: "AIzaSyAsIHuK7Ch5nIKJ_FvSO1wDx9duVVmD-Ak",
  authDomain: "competitionchat.firebaseapp.com",
  databaseURL: "https://competitionchat.firebaseio.com",
  projectId: "competitionchat",
  storageBucket: "competitionchat.appspot.com",
  messagingSenderId: "750085230345",
  appId: "1:750085230345:web:7b37022d91cb776e268dd8"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    app.initializeApp(firebaseConfig);
    this.store = firebase.firestore().collection("messages");
  }



  state = {
    userName: sessionStorage.getItem("userName") || "",
    uid: sessionStorage.getItem("uid"),
    messageIsFetched: false
  };

  async componentDidMount() {
    const { uid } = this.state;
    await firebase.auth().signInAnonymously();

    this.store
      .orderBy("timestamp", "asc")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach(change => {
          const message = change.doc.data();
          if (message && message.uid === uid && !this.state.messageIsFetched) {
            addUserMessage(message.text);
          }
          if (message && message.uid !== uid) {
            addResponseMessage(`(${message.userName}):  ${message.text}`);
          }
        });
        this.setState({ messageIsFetched: true });
      }, (error) => {
        console.log(error)
      })
  }

  handleNewUserMessage = (message) => {
    const { userName } = this.state;

    if (!userName) {
      this.setUserName(message);
    } else {
      this.sendMessageToServer(message);
    }
  };

  setUserName = (userName) => {
    const uid =  `${userName}_${Math.random()}_${Date.now()}`;
    this.setState({ userName, uid });
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("uid", uid)
  };

  sendMessageToServer = (message) => {
    const { userName, uid } = this.state;
    this.store.add({
      uid,
      userName,
      text: message,
      timestamp: Date.now()
    });
  };

  render () {
    const { userName } = this.state;
    return (
      <div className='container'>
        <Widget
          subtitle={'Competition chat'}
          senderPlaceHolder={userName ? `${userName}: Type a message...` : "Your Name" }
          handleNewUserMessage={this.handleNewUserMessage}
        />

        <div className='header'>
          <a href="https://t.me/ArmwrestlingGroup" target="_blank">Telegram channel </a>
          <a href="https://www.youtube.com/channel/UCONba2gMK9iHfvJ2cCKstDw" target="_blank">YT channel</a>
          <button onClick={toggleWidget} target="_blank">Online chat</button>
          <a href="http://www.waf-armwrestling.com/event/worlds2019/" target="_blank">SСHEDULE</a>
          <a>Mail: sergomen153@gmail.com</a>
        </div>
        <div className="row">
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
        </div>

        <div className="row">
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
          <Youtube
            youtubeId={"rMT6gx5HvL4"}
          />
        </div>
      </div>
    );
  }

}
const getYouTubeLing = (id) => (`https://www.youtube.com/embed/${id}?autoplay1=1&allow=autoplay1`);
const Youtube = ({ youtubeId }) => {
  return (
    <div className="block">
      <div>
        <iframe
          src={getYouTubeLing(youtubeId)}
          frameBorder="0"
          allow="autoplay1; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default App;
