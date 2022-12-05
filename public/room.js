$(function() {
    /*登入*/
    /*$('.login-btn').click(function() {
            $('.control1').show('slow');
            $('.control2').show('slow');
            $('.chat-wrap').show('slow');
            $('.screen').show('slow');
            $('.stream').hide('slow');
            $('.clsstream').show('slow');
            $('.login-wrap').hide('slow');
        })*/
    /*關聊天室 放大畫面*/
    $('.clschat').click(function() {
            $('.control1').hide('slow');
            $('.control2').show('slow');
            $('.chat-wrap').hide('slow');
        })
        /*開聊天室 縮小畫面*/

    /*開聊天室 縮小畫面*/
    $('.openchat').click(function() {
            $('.control1').show('slow');
            $('.control2').hide('slow');
            $('.chat-wrap').show('slow');
        })
        /*離開*/
    $('.leaveBtn').click(function() {
        let leave = confirm('Are you sure you want to leave?')
        if (leave) {
            /*觸發 logout 事件*/
            checkOut()
        }
    })

    function checkOut() {
        $('.control1').hide('slow');
        $('.control2').hide('slow');
        $('.chat-wrap').hide('slow');
        $('.screen').hide('slow');
        $('.stream').hide('slow');
        $('.login-wrap').show('slow');
    }
    /*按下Enter&按鈕 發送訊息*/
    $('#chat-send').click(function() {
        sendMessage()
    });
    $(document).keydown(function(evt) {
        if (evt.keyCode == 13) {
            sendMessage()
        }
    })

})