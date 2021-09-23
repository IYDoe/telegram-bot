const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');
const token = '2022668463:AAGmmGymzeGoOfg3BWlroVN-qoGw36lD9EA';
const bot = new TelegramApi(token, {polling: true});
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId,  'Сейчас я загадаю цифру от 0 до 9, а ты отгадывай!');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {

  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие'},
    { command: '/info', description: 'Информация'},
    { command: '/game', description: 'Начать игру'},
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      // Стикер приветствия
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/1.webp')
      // Текст приветствия
      return bot.sendMessage(chatId, "Добро пожаловать в игру угадай число!")
    }
  
    if (text === '/info') {
      return bot.sendMessage(chatId, `Я знаю только как тебя зовут ${msg.from.first_name}`)
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю. Попробуй еще раз!)')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/29.webp')
      return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/23.webp')
      return await bot.sendMessage(chatId, `К сожалению ты не угадал, я загадал цифру ${chats[chatId]}`, againOptions)
    }
    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
  })
  
}

start();

