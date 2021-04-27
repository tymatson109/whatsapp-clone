import React, {useState} from 'react';
import './SideBar.css';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Avatar, IconButton, makeStyles } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import { useStateValue } from './StateProvider';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import axios from 'axios';
import { actionTypes } from './Reducer';

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
      height: '230px',

    },
  }));

const SideBar = ({ chat }) => {
    const [{user, chatList}, dispatch] = useStateValue()
    const [settingsOpen, setSettingsOpen] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const [profileImage, setProfileImage] = useState('')
    const [chatInputName, setChatInputName] = useState('')
    const [chatInputImage, setChatInputImage] = useState('')
    const [chatInputMember, setChatInputMember] = useState('')
    const classes = useStyles();

    // //Chat data
    // const [chatsList, setChatsList] = useState('Loading...')

    // useEffect(() => {
    //     setChatsList(chat)
    // }, [chat])

    function isOpen() {
        if (settingsOpen) {
            return true;
        }
        return false;
    };

    const openModal = () => {
        setSettingsOpen(null)
        setModalOpen(true)
    }

    const openImageModal = () => {
        setSettingsOpen(null)
        setImageModal(true)
    }

    const addChat = (e) => {
        e.preventDefault();

        axios.post('/chats/new', {
            name: chatInputName,
            image: chatInputImage,
            members: {
                memberOne: user.username,
                memberTwo: chatInputMember
            }
        })

        setModalOpen(false)
        setChatInputImage('')
        setChatInputName('')
        setChatInputMember('')
    }

    const addProfileImage = (e) => {
        e.preventDefault();

        axios.post('/users/update', {
            image: profileImage,
            username: user.username
        })

        dispatch({
            type: actionTypes.SET_USER,
            user: {
                username: user.username,
                email: user.email,
                password: user.password,
                image: profileImage
            }
        })

        setImageModal(false)
        setProfileImage('')
    }

    const logOut = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: {
                username: null,
                email: null,
                password: null,
                image: null
            }
        })
    }

    return (
        <div className="sidebar">
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={imageModal}
                onClose={() => setImageModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <div className={`sidebar__modal ${classes.paper}`}>
                    <h1>Set profile image!</h1>
                    <form>
                        <div className="sidebar__modalInput">
                            <h4>Image: </h4>
                            <input value={profileImage} onChange={e => setProfileImage(e.currentTarget.value)}/>
                        </div>
                        <button type="submit" onClick={addProfileImage} style={{display: 'none'}} />
                    </form>
                </div>
            </Modal>
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
                <div className={`sidebar__modal ${classes.paper}`}>
                    <h1>Create a chat!</h1>
                    <form>
                        <div className="sidebar__modalInput">
                            <h4>Chat_Name: </h4>
                            <input value={chatInputName} onChange={e => setChatInputName(e.currentTarget.value)}/>
                        </div>
                        <div className="sidebar__modalInput">
                            <h4>Image: </h4>
                            <input value={chatInputImage} onChange={e => setChatInputImage(e.currentTarget.value)}/>
                        </div>
                        <div className="sidebar__modalInput">
                            <h4>To:</h4>
                            <input value={chatInputMember} onChange={e => setChatInputMember(e.currentTarget.value)} />
                        </div>
                        <button type="submit" onClick={addChat} style={{display: 'none'}} />
                    </form>
                </div>
            </Modal>
            <div className="sidebar__header">
                <Avatar src={user.image}/>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon className="sidebar__headerIcon" />
                    </IconButton>
                    <IconButton>
                        <ChatIcon className="sidebar__headerIcon"/>
                    </IconButton>
                    <IconButton onClick={(e) => setSettingsOpen(e.currentTarget)}>
                        <MoreVertIcon className="sidebar__headerIcon"/>
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
                        <MenuItem onClick={openModal}>Create chat</MenuItem>
                        <MenuItem onClick={openImageModal}>Change profile pic</MenuItem>
                        <MenuItem onClick={logOut}>Log out</MenuItem>
                    </Popover>
                </div>
            </div>
            <div className="sidebar__chat">
                {chatList[0]?.name
                    ? chatList.filter(chat => 
                        chat.members.memberOne === user.username || 
                        chat.members.memberTwo === user.username)
                        .map(({name, image, _id}) => {
                        return (
                            <SidebarChat id={_id} key={_id} roomname={name} image={image}/>
                        )
                    })
                    : null
                }
            </div>
        </div>
    )
}

export default SideBar
