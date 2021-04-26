//import 
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import Messages from './dbMessages.js';
import Chats from './dbChats.js';
import cors from 'cors';
import Users from './dbUsers.js'

//app config
const app = express()
const PORT = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1190873",
    key: "8019a7ed72d7c9adc99c",
    secret: "1d01f94b719fa2eb9950",
    cluster: "us3",
    useTLS: true
  });

//middlewares
app.use(express.json());
app.use(cors())

//DB config
const connection_url = 'mongodb+srv://admin:6vmfnK3f2g2EfAZ@cluster0.6wkzi.mongodb.net/whatsapp-clone?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static('/client/build'))

    import path from 'path';
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const db = mongoose.connection

db.once('open', () => {
    console.log('DB Connected')
    
    const msgConnection = db.collection("messagecontents");
    const changeStreamMessage = msgConnection.watch();

    changeStreamMessage.on('change', (change) =>  {

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                image: messageDetails.image,
                id: messageDetails.id,
                message: messageDetails.message
            });
        } else if (change.operationType === 'delete') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'deleted', {
                message: 'hey'
            })
        } else {
            console.log('error triggering pusher')
        }
    })

    const chatConnection = db.collection("chatnames");
    const changeStreamChat = chatConnection.watch();

    changeStreamChat.on('change', (change) =>  {
        if (change.operationType === 'update') {
            const messageDetails = change.updateDescription;
            pusher.trigger('chats', 'updated', {
                name: messageDetails.updatedFields.name,
            })
        } else if (change.operationType === 'delete') {
            pusher.trigger('chats', 'deleted', {
                message: 'hi'
            })
        } else if (change.operationType === 'insert') {
            pusher.trigger('chats', 'inserted', {
                id: change.fullDocument._id,
                name: change.fullDocument.name,
                image: change.fullDocument.image
            })
        }
    })

    const userConnection = db.collection('users');
    const changeStreamUsers = userConnection.watch();

    changeStreamUsers.on('change', (change) => {
        if (change.operationType === 'update') {
            pusher.trigger('users', 'updated', {
                message: 'hi'
            })
        }
    })
})

//messages
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        err 
        ? res.status(500).send(err) 
        : res.status(200).send(data)
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        err 
        ? res.status(500).send(err) 
        : res.status(201).send(data)
    })
})

app.post('/messages/delete', (req, res) => {
    const dbMessages = req.body;
    Messages.deleteMany({"id": dbMessages.id}, (err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    })
})


//chats
app.get('/chats/sync', (req, res) => {
    Chats.find((err, data) => {
        err 
        ? res.status(500).send(err) 
        : res.status(200).send(data)
    })
})

app.post('/chats/update', (req, res) => {
    const item = req.body
    const id = item.id
    Chats.updateOne({"_id": mongoose.Types.ObjectId(id)}, item, (err, data) => {
        err 
        ? res.status(500).send(err) 
        : res.status(201).send(data)
    })
})

app.post('/chats/delete', (req, res) => {
    const item = req.body
    const id = item.id
    Chats.deleteOne({"_id": mongoose.Types.ObjectId(id)}, (err, data) => {
        err 
        ? res.status(500).send(err) 
        : res.status(201).send(data)
    })
})

app.post('/chats/new', (req, res) => {
    const item = req.body
    Chats.create(item, (err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    })
})

//Users
app.get('/users/sync', (req, res) => {
    Users.find((err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    });
});

app.get('/users/find', (req, res) => {
    const dbUser = req.query
    Users.findOne({"username": dbUser.username}, (err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    })
})

app.post('/users/new', (req, res) => {
    const dbUser = req.body
    Users.create(dbUser, (err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    })
})

app.post('/users/update', (req, res) => {
    const dbUser = req.body
    const image = dbUser.image
    const username = dbUser.username
    Users.updateOne({"username": username}, {"image": image}, (err, data) => {
        err
        ? res.status(500).send(err)
        : res.status(201).send(data)
    })
})

//listener
app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))