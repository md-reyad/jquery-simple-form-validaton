/**
 * Created by shahin on 5/28/17.
 */
$('body a').click(function(e){

    var action = $(this).text();
    var url = $(this).attr('href');

    if(typeof action === "undefined"){
        action = $(this).attr('id');
        if(typeof action === "undefined"){
            action = $(this).attr('name');
        }
    }

    $.ajax({
        url: 'http://dev-app.eserve.org.bd/api/action/new-job',
        type: 'post',
        data: {
            project: project_name,
            user_id: user_id,
            url: url,
            message: message,
            ip_address:ip_address,
            action:action
        },
        success: function (response) {

        },

    });

});

$('body button').click(function(e){

    var action = $(this).text();
    var url = $(this).attr('href');

    if(typeof action === "undefined"){
        action = $(this).attr('id');
        if(typeof action === "undefined"){
            action = $(this).attr('name');
        }
    }
    $.ajax({
        url: 'http://dev-app.eserve.org.bd/api/action/new-job',
        type: 'post',
        data: {
            project: project_name,
            user_id: user_id,
            url: url,
            message: message,
            ip_address:ip_address,
            action:action
        },
        success: function (response) {

        },

    });

});


$( document ).ready(function() {
    var url      = window.location.href;
    $.ajax({
        url: 'http://dev-app.eserve.org.bd/api/new-job',
        type: 'post',
        async:false,
        crossDomain:true,
        data: {
            project: project_name,
            user_id: user_id,
            url: url,
            message: message,
            ip_address:ip_address
        },
        success: function (response) {
// alert(response);
        },

    });
});
