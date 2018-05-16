const firebase = require("firebase");
const mfrc522 = require("mfrc522-rpi");

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDG0X9HFUksao0tKgxYrez45pAvIEuOh9s",
    authDomain: "rfid-music-jukebox.firebaseapp.com",
    databaseURL: "https://rfid-music-jukebox.firebaseio.com",
    projectId: "rfid-music-jukebox",
    storageBucket: "rfid-music-jukebox.appspot.com",
    messagingSenderId: "284548597468"
};
firebase.initializeApp(config);
// RFID array firebase
const dbRefRFID = firebase.database().ref().child("rfid");
// Active RFID firebase
const dbRefActiveRFID = firebase.database().ref();

mfrc522.initWiringPi(0);

function rfid() {
    let tagTime = setInterval(function () {
        //# reset card
        mfrc522.reset();

        //# Scan for cards
        let response = mfrc522.findCard();
        if (!response.status) {
            console.log("Please Scan The Card");
            return;
        }
        console.log("Card detected, CardType: " + response.bitSize);

        //# Get the UID of the card
        response = mfrc522.getUid();
        if (!response.status) {
            console.log("UID Scan Error");
            return;
        }

        // If we have the UID, continue
        let uid = response.data;
        uid = uid.join("");
        dbRefActiveRFID.update({
            active: uid
        });
        console.log(uid);

        // io.emit("tagid", uid);
        // db.set('activetag', uid).write();

        // Reset scanning card
        stop(uid);
    }, 500);

    function stop(uid) {
        clearInterval(tagTime);
        rfid();
    }
}
rfid();