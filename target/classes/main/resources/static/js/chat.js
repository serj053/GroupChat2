$(function () {
  //создаем динамические элементыи передаем в mressage список
  //объектов с полями datyetime, usernave,text
  let getMessageElement = function (message) {
    //  alert(message.datetime);
    //создаем элементы HTML
    let item = $('<div class="message-item"></div>');
    let header = $('<div class="message-header"></div>');
   // alert("message.datetime 1  " + message.datetime);
    header.append($('<div class="datetime">' + message.datetime + '</div>'));
  //  alert("message.datetime 2  " + message.username);
    header.append($('<div class="username">' + message.username + '</div>'));
 //   alert("message.datetime 3 " + message.datetime);
    let textElement = $('<div class="message-text"></div>');
  //  alert("message.datetime 4 " + message.datetime);
   
    textElement.text(message.text);
    item.append(header, textElement);
    // $('.message-list').append(item);
 //   alert("item " + item.html());
    return item;
  }
  //обращаемся к серверу и выводим все сообщения из базы данных
  let updateMessages = function () {
    //очищаем лист
    $('.messages-list').html('<i>Сообщений нет</i>');
    //понять в каком виде придет ответ
    $.get('/message', {}, function (response) {
      //если нет сообщений
      if (response.length == 0) {
        return;
      }
      //если пришло сообщение то для него очищаем поле
      $('.messages-list').html('');
      //пройдемся по ответу
      for (i in response) {
        let element = getMessageElement(response[i]);
    //    alert("element");
        $('.messages-list').append(element);
      }
    });
  };
  let initApplication = function () {
    $('.messages-and-users').css({ display: 'flex' });
    $('.controls').css({ display: 'flex' });
    //инициализировать поддгрузку списка пользователей и списка сообщений
    $('.send-message').on('click', function () {
      //готовим сообщение
      let message = $('.new-message').val();
      //при нажатии на кнопку будем отправлять ссобщения
      $.post('/message', { message: message }, function (response) {
        if (response.result == true) {
          //значит сообщение переданно, очищаем текстовое поле
          $('.new-message').val('');
        } else {//если ошибка
          alert("Ошибка повторите попытку позже.");
        }
      })
    });
  };

  let registerUser = function (name) {
    $.post('/auth', { name: name }, function (response) {
      if (response.result) {
        initApplication();
      }
    });
  };

  //как только входим в приложение сразу вызываем GET запрос init
  //и дальше проверка авторизации
  $.get('/init', {}, function (response) {
    //alert(response.result);
    if (!response.result) {
      let name = prompt('Введите ваше имя:');
      registerUser(name);
      return;
    }
    initApplication();
  });
  setInterval(updateMessages, 5000);
});