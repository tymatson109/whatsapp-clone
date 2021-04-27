import { Avatar } from '@material-ui/core';
import React from 'react';
import { actionTypes } from './Reducer';
import './SidebarChat.css';
import { useStateValue } from './StateProvider';

const SidebarChat = ({roomname, image, id}) => {
    const [{chat, chatZero}, dispatch] = useStateValue()

    const setActiveChat = () => {
        dispatch({
            type: actionTypes.SET_CHAT,
            chat: {
                name: roomname,
                image: image,
                id: id,
            }
        })

    }

    function getChatId() {
        var chatId
        if (chat?.id) {
            chatId = chat.id
            return chatId
        }
        chatId = chatZero?._id
        return chatId
    }
    return (
        <div onClick={setActiveChat} className={`sidebarChat ${getChatId() === id ? 'active' : null}`}>
            <Avatar src={image || 'https://i.pinimg.com/originals/e8/82/67/e88267a222de3b152d6aced055fc84a7.jpg'}/>
            <div className="sidebarChat__info">
                <h2>{roomname}</h2>
            </div>
        </div>
    )
}

export default SidebarChat;
