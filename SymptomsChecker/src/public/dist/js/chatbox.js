
$(document).ready(function() {

    var msg_AutoReplyTemp = '<div class="direct-chat-msg"><div class="direct-chat-text"></div></div>';
    var msg_sendMsgTemp = '<div class="direct-chat-msg right"><div class="direct-chat-text right"></div></div>';
    var name='';
    var age='';
    var sex='';
    //var evidence=[];

     sendmsg('symptom', '✋ Hi! I am an automatic symptom checker', false, true)
     sendmsg('symptom','This service is for informational purposes and is not a qualified medical opinion.',false,true)
     sendmsg('symptom','In case of health emergency, call your local emergency number immediately.',false,true)
     
    $('.input-group-btn button').click(function() {
      // debugger;
        var input = $(this).parents("span").siblings('input[type=text]');
        if (input.val() != '') {
            sendmsg(name,  input.val(), true);
        }
    });

    $('.input-group input').keypress(function(e) {
        if (e.which == 13) {
            if ($(this).val() != '') {
                sendmsg('You',  $(this).val(), true);
            }
        }
    });

    var i = 0;

    function sendmsg(name, msg, clear, r) {
        debugger;
        i = i + 1;

        var inner = $('#chat-messages-inner');
        var time = moment().format('DD MMM hh:mm a');
        var id = 'msg-' + i;
        var idname = name.replace(' ', '-').toLowerCase();
        if (r) {
            inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
        } else {
            inner.append('<div id="' + id + '" class="direct-chat-msg right"><div class="direct-chat-text right">' + msg + '</div></div><br>');
        }
         
       // $('#' + id).hide().fadeIn(800);

             if(i==1){
                 i = i + 1;
                msg='What is your name?';
                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                $('#' + id).hide().fadeIn(800);
            }
           else if(i==3){
                name=msg;
                //alert(name);
                 i = i + 1;
                msg= 'Hi ' + name + ' What is your age?';
                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                $('#' + id).hide().fadeIn(800);
            }
           else if(i==5){
                age=msg;
                //alert(age);
                 i = i + 1;
                msg='What is your sex?';
                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                $('#' + id).hide().fadeIn(800);
            }


            else if(i==7)
            {
                sex=msg;
                i = i + 1;
                msg='What concerns you most about your health? Please describe your symptoms.';
                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                $('#' + id).hide().fadeIn(800);
            } 
            else if(i==9){
                //ajax call
                console.log('getting symptoms');
                console.log(msg);

                if(symptoms!=[])
                {
                $.ajax('http://localhost:9081/symptoms', {
                    type: 'POST',  // http method
                    dataType: 'json',
                    data: { symptom: msg },  // data to submit
                    success: function (data, status, xhr) {
                        symptom=data;
                        msg='';
                        $.each(symptom, function () {
                            msg=msg+this.name+'<br/>';
                        });
                        inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                    },
                    error: function (jqXhr, textStatus, errorMessage) {
                        console.log('Error' + errorMessage);
                    }
                });

                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">Please confirm any of the above</div></div><br>');
            } 
            /*elseif(symptoms=[])
            {
                $.ajax('http://localhost:9081/diagonosis', {
                    type: 'POST',  // http method
                    dataType: 'json',
                    data: { symptom: msg },  // data to submit
                    success: function (data, status, xhr) {
                        symptom=data;
                        msg='';
                        $.each(symptom, function () {
                            msg=msg+this.name+'<br/>';
                        });
                        inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                    },
                    error: function (jqXhr, textStatus, errorMessage) {
                        console.log('Error' + errorMessage);
                    }
                });

                inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">Please confirm any of the above</div></div><br>');
            } */
            }

           // else if(i==9 && msg== 'fever' || msg== 'cough' || msg== 'shortness of breath')
            //{

                //before api call
                //var arr=[];
                
                //inside api response
               //object={
                 //   'id':'s_98'
                   // 'question':'Do you have a sore throat?'
               //}
               //arr.push(object)

               //symptoms=msg;
                 //   i = i + 1;
                   // msg='I have Noted ' + msg;
                    //inner.append('<div id="' + id + '" class="direct-chat-msg"><div class="direct-chat-text">' + msg + '</div></div><br>');
                     //$('#' + id).hide().fadeIn(800); 

            //}


        if (clear) {
            $('.input-group input').val('').focus();
        }
        //$('#chat-messages').animate({
          //  scrollTop: inner.height()
        //}, 1000);
    }
    // TOTO:customerService AutoReply
   // setTimeout(function() {
     //   sendmsg('Sarah', 'Hi!  What can I help you?', false, true)
    //}, '600');
});



