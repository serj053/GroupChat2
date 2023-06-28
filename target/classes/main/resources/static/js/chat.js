$(function () {

  let getMessageElement = function (message) {
    let item = $('<div class="message-item"></div>');
    let header = $('<div class="message-header"></div>');
    header.append($('<div class="datetime">' + message.datetime + '</div>'));
    header.append($('div class="user-name">' + message.username + '</div>'));
    let textElement = $('<div class="message-text"></div>');
    textElement.text(message.text);
    item.append(header, text);
    return item; 
  }

  let updateMessage = function () {
    //очищаем лист
    $('.message-list').html('<i>Сообщений нет</i>');
    //понять в каком виде придет ответ
    $.get('/messsage', {}, function (response) {
      //если нет сообщений
      if (response.length == 0) {
        return;
      }
      //если пришло сообщение то для него очищаем поле
      $('.message-list').html('');
      //проийдемся по ответу
      for (i in response) {
          let element=getMessageElement(response[i]);
          $('.message-list').append(element);
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
        alert(message);
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
     // setInterval(updateMessage, 1000);
  });