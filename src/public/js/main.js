
(function() {
  $('#exampleModalCenter').modal({backdrop: 'static', keyboard: false})
  $('#exampleModalCenter').modal('show');
  const socket =  io();
  var claerResizeScroll, conf, insertI, lol,idUser;
  conf = {
    cursorcolor: "#696c75",
    cursorwidth: "4px",
    cursorborder: "none"
  };
  lol = {
    cursorcolor: "#cdd2d6",
    cursorwidth: "4px",
    cursorborder: "none"
  };


  $(".list-friends").niceScroll(conf);
  
  $(".messages").niceScroll(lol);

  claerResizeScroll = function() {
    $("#texxt").val("");
    $(".messages").getNiceScroll(0).resize();
    return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
  };
  
  $("#texxt").keypress(function(e) {
    if (e.keyCode === 13) {
      insertI();
    }
  });
  
  $(".send").click(function() {
    insertI();
  });

  $("#nickname").keypress(function() {
    var value =  $("#nickname").val();
    if (value.length >= 2) {
      $("#save").removeClass("disabled");
      $('#save').prop("disabled", false);
    }else{

      $('#save').prop("disabled", true);
      $("#save").addClass("disabled");
    }
  }); 

  function messageLeft(d,private){
    $('.messages').append(`
      <li class="friend-with-a-SVAGina">
        <div class="head">
          <span class="name">${d.nick}</span>
          <span class="time">
            ${new Date().getHours()}:${new Date().getMinutes()} AM, Today
          </span>
        </div>
        <div class="message ${private}">${d.msg}</div>
      </li>`);  
  }

  function messageRight(d,private){
    $('.messages').append(`
      <li class="i">
        <div class="head">
        <span class="time">
          ${new Date().getHours()}:${new Date().getMinutes()} AM, Today
        </span>
        <span class="name">${d.nick}</span>
        </div>
        <div class="message ${private}">${d.msg}</div>
      </li>`);
  }

  function addMassage(data,type='',list=false){
    var private=type;
    if (list) {
      for (var i =0; i < data.length; i++) {
        (idUser != data[i].nick)? messageLeft(data[i],private) : messageRight(data[i],private);
      }
    }else{
      (idUser != data.nick)? messageLeft(data,private) : messageRight(data,private);
    }
    claerResizeScroll();
  }


  /*------------------*/
  /* GUARDAR NICKNAME */
  /*------------------*/
  $("#save").click(function() {
    socket.emit('new user',$("#nickname").val(), data => {
      if (data) {
        idUser = $("#nickname").val();
        $('#exampleModalCenter').modal('hide');
      }else{
        $("#nickname").val("");
        $('.alert-danger').removeClass('d-none');
      }
    });
  });


  /*------------------*/
  /* ENVIO DE MENSAJE */
  /*------------------*/
  function insertI(){
    var innerText;
    innerText = $.trim($("#texxt").val());
    socket.emit('send message',innerText, data =>{
      $(".messages").append(`
        <li class="i">
          <div class="head">
          <span class="time">
            ${new Date().getHours()}:${new Date().getMinutes()} AM, Today
          </span>
          <span class="name"></span>
          </div>
          <div class="message message-p">${data}</div>
        </li>`
      );
    });
  };


  /*------------------------------------*/
  /* RECIBIENDO LOS USUARIOS CONECTADOS */
  /*------------------------------------*/
  socket.on('usernames', data =>{
    let html="";
    $.each(data, function( k, name ) {
      html += `
        <li>
          <img width="50" height="50" src="img/2.jpg">
          <div class="info">
            <div class="user">${name}</div>
            <div class="status on"> online</div>
          </div>
        </li>`;
    });
    $('.list-friends').html(html);
  });


  /*--------------------*/
  /* RECIBIENDO MENSAJE */
  /*--------------------*/
  socket.on('new message', data =>{
    addMassage(data);
  });

  socket.on('whisper', data =>{
    addMassage(data,'message-p');
  });

  socket.on('load old msgs', data =>{
    addMassage(data,' ',true);
  });

}).call(this);

