const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const BOT_TOKEN = '7359613838:AAGfjsrIa734DgccKiANvM-pQA5HFw_EjOw';


const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log('Бот запущен и готов принимать сообщения!');


const app = express();
app.use(express.json());


const messageStorage = [];


bot.on('message', (msg) => {

  messageStorage.push({
    from: msg.from.username || msg.from.first_name || 'Неизвестный пользователь',
    text: msg.text,
    date: new Date(),
  });

  let ad = msg.chat.id;
  bot.sendMessage(msg.chat.id, `Ваше сообщение сохранено!${msg.chat.id}`);
});

bot.onText(/\/show_messages/, (msg) => {
  const chatId = msg.chat.id;

  if (messageStorage.length === 0) {
    return bot.sendMessage(chatId, 'Нет сохранённых сообщений.');
  }


  let messages = 'Сохранённые сообщения:\n';
  messageStorage.forEach((message, index) => {
    messages += `${index + 1}. ${message.from} написал: "${message.text}" в ${message.date}\n`;
  });


  bot.sendMessage(chatId, messages);
});

app.get('/messages', (req, res) => {
  res.status(200).json(messageStorage);
});

app.post('/send-message', (req, res) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).send('Параметр "message" обязателен.');
    }
  
    messageStorage.push({
      from: 'Администратор',
      text: message,
      date: new Date(),
    });
  
    const chatId = -4651283631; //1327778297  
  
    bot.sendMessage(chatId, `${message}`)
      .then(() => res.status(200).send('Сообщение сохранено и отправлено!'))
      .catch((err) => {
        console.error('Ошибка при отправке сообщения в Telegram:', err);
        res.status(500).send('Не удалось отправить сообщение.');
      });
  });
  
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
