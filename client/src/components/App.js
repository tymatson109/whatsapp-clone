import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import SideBar from './SideBar';
import Pusher from 'pusher-js';
import axios from '../axios';
import Login from './Login';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';
import LoginPage from './LoginPage';

const App = () => {
    const [{user}, dispatch] = useStateValue()
    const [messages, setMessages] = useState([])
    const [chats, setChats] = useState([])
    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        const requestData = async () => {
            await axios.get('/messages/sync')
                .then(response => {
                    setMessages(response.data)
                })
        }
        requestData()

        const requestChats = async () => {
            await axios.get('/chats/sync')
                .then(response => {
                    setChats(response.data)
                    dispatch({
                        type: actionTypes.SET_CHATZERO,
                        chatZero: response.data[0]
                    })
                })
        }
        requestChats()
    }, [trigger, dispatch])

    useEffect(() => {
        const pusher = new Pusher('8019a7ed72d7c9adc99c', {
            cluster: 'us3'
        });
      
        const channel = pusher.subscribe('messages');
        channel.bind('inserted', function(newMessage) {
            setTrigger(!trigger)
            setMessages([...messages, newMessage])
        });
        channel.bind('deleted', () => {
            setTrigger(!trigger);
        })

        const channelOne = pusher.subscribe('chats');
        channelOne.bind('updated', () => {
            setTrigger(!trigger)
        })
        channelOne.bind('deleted', () => {
            setTrigger(!trigger)
        })
        channelOne.bind('inserted', (data) => {
            setTrigger(!trigger)
            dispatch({
                type: actionTypes.SET_CHAT,
                chat: {
                    name: data.name,
                    id: data.id,
                    image: data.image
                }
            })
        })
        const channelTwo = pusher.subscribe('users');
        channelTwo.bind('updated', () => {
            setTrigger(!trigger)
        })

        return () => {
            channel.unbind()
            channelOne.unbind()
            channel.unsubscribe()
            channelOne.unsubscribe()
        }

    }, [messages, trigger, dispatch])

    return (
        <div className="app">
            {user.username 
            ? <div className="app__body">
                <SideBar chat={chats} />
                <Chat message={messages} />
            </div>
            : <LoginPage />
            }
        </div>
    )
}

export default App
