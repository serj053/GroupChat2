package main;

import main.model.Message;
import main.model.MessageRepository;
import main.model.User;
import main.model.UserRepository;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;

import java.time.LocalDateTime;
import java.util.*;

@RestController


public class ChatController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    //TODO: Check session. If found user -> true else false
    //init проверяет авторизацию
    @GetMapping("/init")
    public HashMap<String, Boolean> init() {
        HashMap<String, Boolean> response = new HashMap<>();
        Map<String, Boolean> result = new HashMap<>();
        //берём сессию и по этой сессии в базе находим пользователя
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        //идем в репозиторий и по sessionId находим user
        //Optional<User> userOptional = userRepository.findBySessionId(sessionId);
        ArrayList<User> userList = new ArrayList<>((Collection) userRepository.findAll());
        for (User user : userList) {
            if (Objects.equals(user.getSession(), sessionId)) {
                response.put("result", true);
            } else {
                response.put("result", false);
            }
        }
        //если он существует -isPresent() , значит пользователь авторизован

        return response;
    }

    //auth - создание  пользователя и сессии -session Id
    //сохранить пользователя в базу данных(создать объект User, создать репозиторий)
    @PostMapping("/auth")
    public HashMap<String, Boolean> auth(String name) {
        HashMap<String, Boolean> response = new HashMap<>();
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        User user = new User();
        user.setName(name);
        user.setSession(sessionId);
        userRepository.save(user);
        response.put("result", true);
        return response;
    }
//    public HashMap<String, Boolean> isAuthorized(){
//        Map<String,Boolean> result = new HashMap<>();
//        //берём сессию и по этой сессии в базе находим пользователя
//        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
//        //сервисы снимают часть бизнес логики с контроллеров
//        return null;
//    }

    @PostMapping("/message")//@RequestParam
    public Map<String, Boolean> sendMessage(String message) {
        HashMap<String, Boolean> response = new HashMap<>();
        if (Strings.isEmpty(message)) {
//            response.put("result", false);
//            return response;
            return Map.of("result", false);
        }
        //берем пользователя, что бы поместить его в новое сообщение
        String sessionId = RequestContextHolder.getRequestAttributes().getSessionId();
        //Optional<User> userOptional =  userRepository.findBySessionId(session);
        ArrayList<User> userList = new ArrayList<>((Collection) userRepository.findAll());

        for (User user : userList) {
            if (Objects.equals(user.getSession(), sessionId)) {
                Message msg = new Message();
                msg.setDateTime(LocalDateTime.now());
                msg.setMessage(message);
                msg.setUser(user);
                messageRepository.saveAndFlush(msg);
                response.put("result", true);
            }
        }
        return response;
        //return Map.of("result", true);
    }

    //перечень сообщений
    @GetMapping("/message")
    public List<String> getMessagesList() {
        return new ArrayList<>();
    }

    @GetMapping("/user")
    public HashMap<Integer, String> getUserList() {
        return null;
    }
}







