// const {CreateTable} = require('./createDB')
// const {save} = require('./save')
// const {getUserByName} = require('./getUser')

import {CreateTable} from './createDB'
import {save} from './save'
import {getUserByName} from './getUser'
import {createNewChatDB}from './createChat'
import {saveMsg} from './saveMsg'
import {JoinChatDB} from './joinChat'
import {getUsersFromChat} from './getUserFromChat'
export   {CreateTable,createNewChatDB,save,getUserByName,saveMsg,JoinChatDB,getUsersFromChat}