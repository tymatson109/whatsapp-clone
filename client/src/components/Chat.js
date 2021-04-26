import './Chat.css';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { useState, useEffect } from 'react';
import axios from '../axios';
import { useStateValue } from './StateProvider';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { actionTypes } from './Reducer';
import DehazeIcon from '@material-ui/icons/Dehaze';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: 'lightgray',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: 'none',
      width: '300px',
      height: '100px',

    },
  }));

const Chat = ({ message, tablet }) => {
    const [input, setInput] = useState('')

    const [roomName, setRoomName] = useState('')
    const [avatarSrc, setAvatarSrc] = useState('')

    const [{user, chat, chatZero}, dispatch] = useStateValue()
    const [settingsOpen, setSettingsOpen] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [avatarModalOpen, setAvatarModalOpen] = useState(false)

    const classes = useStyles();

    useEffect(() => {
        dispatch({
            type: actionTypes.SET_CHAT,
            chat: chatZero
        })
    }, [])

    const sendMessage = (e) => {
        e.preventDefault()

        axios.post('/messages/new', {
            message: input,
            name: user.username,
            image: user.image,
            id: chat.id || chatZero._id
        })

        setInput('')
    };

    const setChatName = (e) => {
        e.preventDefault()

        axios.post('/chats/update', {
            name: roomName,
            id: chat.id || chatZero._id
        })
        dispatch({
            type: actionTypes.SET_CHAT,
            chat: {
                name: roomName,
                image: chat.image,
                id: chat.id,
            }
        })

        setRoomName('')
        setModalOpen(false)
    }

    const setAvatarImage = (e) => {
        e.preventDefault()

        axios.post('/chats/update', {
            image: avatarSrc,
            id: chat.id || chatZero._id
        })
        dispatch({
            type: actionTypes.SET_CHAT,
            chat: {
                name: chat.name,
                image: avatarSrc,
                id: chat.id,
            }
        })

        setAvatarSrc('')
        setAvatarModalOpen(false)
    }

    function isOpen() {
        if (settingsOpen) {
            return true;
        }
        return false;
    };

    const editChatName = () => {
        setSettingsOpen(null)

        setModalOpen(true)
    };

    const editChatAvatar = () => {
        setSettingsOpen(null)

        setAvatarModalOpen(true)
    }

    const deleteChat = () => {
        axios.post('/chats/delete', {
            id: chat.id || chatZero._id
        })

        axios.post('/messages/delete', {
            id: chat.id || chatZero._id
        })

        if (!chatZero) {
            dispatch({
                type: actionTypes.SET_CHAT,
                chat: {
                    name: 'Create a Chat!',
                    image: '',
                    id: ''
                }
            })
        }
        if (chatZero) {
            dispatch({
                type: actionTypes.SET_CHAT,
                chat: chatZero
            })
        }

        setSettingsOpen(null)
    }

    function getChatId() {
        var chatId
        if (chat.id) {
            chatId = chat.id
            return chatId
        }
        chatId = chatZero?._id
        return chatId
    }

    const toSideBar = () => {
        dispatch({
            type: actionTypes.SET_CHAT,
            chat: {
                name: null,
                image: null,
                id: null,
            }
        })
    }

    function sendButton() {
        if (input && tablet) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className="chat"> 
            <div className="chat__modal">
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    className={classes.modal}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <div className={`chat__modal ${classes.paper}`}>
                        <h1>Change room name: </h1>
                        <form>
                            <input value={roomName} onChange={(e) => setRoomName(e.currentTarget.value)} className="chat__modalInput" placeholder="room name..."/>
                            <button onClick={setChatName} type="submit" style={{display: "none"}}/>
                        </form>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    className={classes.modal}
                    open={avatarModalOpen}
                    onClose={() => setAvatarModalOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <div className={`chat__modal ${classes.paper}`}>
                        <h1>Set room avatar: </h1>
                        <form>
                            <input value={avatarSrc} onChange={(e) => setAvatarSrc(e.currentTarget.value)} className="chat__modalInput" placeholder="Avatar url..."/>
                            <button onClick={setAvatarImage} type="submit" style={{display: "none"}}/>
                        </form>
                    </div>
                </Modal>
            </div>
            <div className="chat__header">
                <div className="chat__returnButton">
                    <IconButton onClick={() => toSideBar()} >
                        <DehazeIcon />
                    </IconButton>
                </div>
                <Avatar src={chat?.image ||'https://i.pinimg.com/originals/e8/82/67/e88267a222de3b152d6aced055fc84a7.jpg'}/>
                <div className="chat__headerInfo">
                    <h3>{chat?.name || chatZero?.name || 'Create a Chat!'}</h3>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton onClick={(e) => setSettingsOpen(e.currentTarget)}>
                        <MoreVert />
                    </IconButton>
                    <Popover 
                        anchorEl={settingsOpen}
                        open={isOpen()}
                        onClose={() => setSettingsOpen(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem onClick={() => editChatName()}>Edit chat name</MenuItem>
                        <MenuItem onClick={() => deleteChat()}>Delete chat</MenuItem>
                        <MenuItem>Save chat</MenuItem>
                        <MenuItem onClick={() => editChatAvatar()}>Set chat avatar</MenuItem>
                    </Popover>
                </div>
            </div>
            <div className="chat__body">
                {message?.filter(message => message.id === getChatId()).map((content) => {            
                    return (
                        <div key={content._id} className={`chat__message ${user.username === content.name ? 'chat__receiver' : null}`}>
                            {content.name !== user.username && <Avatar className="chat__avatarLeft" src={content.image}/>}
                            <span className="chat__name">{content.name || "Bot"}</span>
                            {content.message}   
                            {content.name === user.username && <Avatar className="chat__avatarRight" src={content.image}/>}
                        </div>
                    )
                })}
                <div className="chat__bodyBottom"/>
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                {chatZero
                ? <form>
                    <input 
                        value={input}
                        onChange={e => setInput(e.currentTarget.value)}
                        placeholder="Type a message..."
                        type="text"
                    />
                    {sendButton() === true
                    ? (
                        <IconButton type="submit" onClick={sendMessage}>
                            <ArrowUpwardIcon />
                        </IconButton>
                    )
                    : <button style={{display: 'none'}} type="submit" onClick={sendMessage}/>
                    }
                </form>
                : <h1>Create a chat to send a message!</h1>
                }
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
