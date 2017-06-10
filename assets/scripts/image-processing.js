/*
 validate auto complete data is exist in DB
 */
function checkAutoComplete(input, type) {
    var _token = $('input[name="_token"]').val();
    var group_id = $('#group_id').val();
    var name = input.value;
    var data;

    // For Agency
    if (type == 'agency') {

        data = {
            _token: _token,
            agency_name: name,
            group_id: group_id
        };
    }
    // For UISC
    else if (type == 'UISC') {
        data = {
            _token: _token,
            UISC_name: name
        };
    }

    // to validate auto-complete data
    $.ajax({
        url: base_url + '/users/validateAutoCompleteData/' + type,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            // success
            if (response.responseCode == 1) {
                // if entered data is not exist in DB
                if (response.data.exist == 0) {
                    $("#group_id").val('');
                    input.value = '';
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);

        },
        beforeSend: function (xhr) {
            console.log('before send');
        },
        complete: function () {
            console.log('completed');
        }
    });
}

// to render change after image upload
$('body').on('click','.change_btn',function(){
    $(this).parent().find("input[type='file']").show();
    $(this).addClass('hidden');
})

// Read selected Img URL
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#uploaded_pic')
                .attr('src', e.target.result);
            uploadFiles(e.target.result, input, 'uploaded_pic');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// to read auth file URL
function readAuthFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#authorized_file')
                .attr('src', e.target.result);
            uploadFiles(e.target.result, input, 'uploaded_pic');
        };
        reader.readAsDataURL(input.files[0]);
    }
}






// to save uploaded files in DB
function uploadFiles(base64_img, input, target) {

    $(input).parent().find('.upload_flags').val(0);
    var data, nid, err='';
    var _token = $('input[name="_token"]').val();
    var type = $(input).data("type");
    var ref_id = $(input).data("ref");

    //getting image properties
    var size = input.files[0].size/1024;

    var mime_type = input.files[0].type;

    // validating mime type
    if (mime_type != 'image/jpeg' && mime_type != 'image/png') {
        err = "Please select JPEG, PNG file<br/>";
    }

    // creating image object
    var img = new Image();
    var width = img.width;
    var height = img.height;
    // getting image source(base64)
    img.src = base64_img;
    // validation for user and profile_pic_tmp type
    if (type == 'user' || type == 'profile_pic_tmp') {
        if (!(size >=IMAGE_MIN_SIZE && size <=IMAGE_MAX_SIZE)) {
            err += "File size should between ("+IMAGE_MIN_SIZE+' to '+IMAGE_MAX_SIZE+")KB<br/>";
        }
        if (width != 0 || height != 0) {
            if (!(width >= IMAGE_MIN_WIDTH && width <= IMAGE_MAX_WIDTH ) || !(height >= IMAGE_MIN_HEIGHT && height <= IMAGE_MAX_HEIGHT )) {
                err += "Image width  between ("+IMAGE_MIN_WIDTH+"-"+IMAGE_MAX_WIDTH+")px <br/> & height  between ("+IMAGE_MIN_HEIGHT+"-"+IMAGE_MAX_HEIGHT+")px required.<br/>";
            }
        }
    }
    // validation for pilgrim and pilgrim_pic_tmp type
    if (type == 'pilgrim' || type == 'pilgrim_pic_tmp') {
        if (!(size >=IMAGE_MIN_SIZE && size <=IMAGE_MAX_SIZE)) {
            err += "File size should between ("+IMAGE_MIN_SIZE+' to '+IMAGE_MAX_SIZE+")KB<br/>";
        }
        if (width != 0 || height != 0) {
            if (!(width >= IMAGE_MIN_WIDTH && width <= IMAGE_MAX_WIDTH ) || !(height >= IMAGE_MIN_HEIGHT && height <= IMAGE_MAX_HEIGHT )) {
                err += "Image width  between ("+IMAGE_MIN_WIDTH+"-"+IMAGE_MAX_WIDTH+")px <br/> & height  between ("+IMAGE_MIN_HEIGHT+"-"+IMAGE_MAX_HEIGHT+")px required.<br/>";
            }
        }
    }
    // validation for auth_file, auth_file_tmp, birth_crt_tmp, pilgrim_nrb_tmp
    if (type == 'auth_file' || type == 'auth_file_tmp' || type == 'birth_crt_tmp' || type == 'pilgrim_nrb_tmp') {
        if (!(size >=DOC_MIN_SIZE && size <=DOC_MAX_SIZE)) {
            err += "File size should between ("+DOC_MIN_SIZE+' to '+DOC_MAX_SIZE+")KB<br/>";
        }
        if (width != 0 || height != 0) {
            if (!(width >= DOC_MIN_WIDTH && width <= DOC_MAX_WIDTH ) || !(height >= DOC_MIN_HEIGHT && height <= DOC_MAX_HEIGHT )) {
                err += "File width  between ("+DOC_MIN_WIDTH+"-"+DOC_MAX_WIDTH+")px <br/> & height  between ("+DOC_MIN_HEIGHT+"-"+DOC_MAX_HEIGHT+")px required.<br/>";
            }
        }
        if ($("#user_nid").val()=='') {
            err += "Please enter your NID at first.";
        }
    }
    if (err.length > 0) {
        // when error exist
        $("#" + type + "_err").html(err);
        $('button[type="submit"]').addClass('disabled');
        err = '';
        return;
    } else {
        // no validation error
        $("#" + type + "_err").html("");
        $('button[type="submit"]').removeClass('disabled');
    }
    /*
     for user, auth_file, birth_crt, birth_crt_tmp, profile_pic_tmp, pilgrim_pic_tmp, pilgrim_nrb_tmp
     */
    if (type == 'user' || type == 'auth_file' || type == 'birth_crt' || type == 'birth_crt_tmp' || type == 'profile_pic_tmp' || type == 'pilgrim_pic_tmp' || type == 'pilgrim_nrb_tmp') {
        data = {
            base64_img: base64_img,
            ref_id: ref_id
        };
    }
    else if (type == 'pilgrim') {
        data = {
            base64_img: base64_img,
            ref_id: ref_id,
            tracking_no: $(input).data("track_no")
        };
    }
    else if (type == 'auth_file_tmp') {
        nid = $("#user_nid").val();
        if (nid == '') {
            return;
        }
        data = {
            base64_img: base64_img,
            ref_id: nid
        };
    }

    //adding token
    data._token = _token;

    $("#upload_progress").removeClass('hidden');

    //$('button[type="submit"]').addClass('disabled');
//for file or image request
    $.ajax({
        url: base_url + '/files/store/' + type,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            // success

            if (response.responseCode == 1) {
                
                console.log('done');
                $(input).parent().find('.upload_flags').val(1);
                console.log("upload done");
                $("#" + target).removeClass('hidden');
                input.value = '';
                $(input).parent().find('.change_btn').removeClass('hidden');
                $(input).hide();
            } else {
                $("#" + type + "_err").html(response.data);
                $('button[type="submit"]').addClass('disabled');
                $(input).parent().find('.upload_flags').val(0);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);

        },
        beforeSend: function (xhr) {
            console.log('before send');
        },
        complete: function () {
            $("#upload_progress").addClass('hidden');
        }
    });
}




//to read the pdf file
function readURLpdf(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#uploaded_pic')
                .attr('src', e.target.result);
            uploadFilesPdf(e.target.result, input, 'uploaded_pic');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
// to save uploaded files in DB pdf
function uploadFilesPdf(base64_img, input, target) {
    $(input).parent().find('.upload_flags').val(0);
    var data, nid, err='', err1 = '';
    var _token = $('input[name="_token"]').val();
    var type = $(input).data("type");
    var ref_id = $(input).data("ref");

    //getting image properties
    var size = input.files[0].size/1024;
    var mime_type = input.files[0].type;
    // validating mime type
    if (mime_type != 'application/pdf') {
        err = "Invalid file! Please select PDF file<br/>";
        err1 = "Invalid file! Please select PDF file<br/>";
    }

    // creating image object
    var img = new Image();
    var width = img.width;
    var height = img.height;
    // getting image source(base64)
    img.src = base64_img;
    // validation for user and profile_pic_tmp type
    if (type == 'user' || type == 'profile_pic_tmp') {
        if (!(size >=IMAGE_MIN_SIZE && size <=IMAGE_MAX_SIZE)) {
            err1 += "File size should between ("+IMAGE_MIN_SIZE+' to '+IMAGE_MAX_SIZE+")KB<br/>";
        }
    }

    // validation for auth_file, auth_file_tmp, birth_crt_tmp, pilgrim_nrb_tmp
    if (type == 'auth_file' || type == 'auth_file_tmp') {
        if (!(size >=DOC_MIN_SIZE && size <=DOC_MAX_SIZE)) {
            err += "File size should between ("+DOC_MIN_SIZE+' to '+DOC_MAX_SIZE+")KB<br/>";
        }
        if (width != 0 || height != 0) {
            if (!(width >= DOC_MIN_WIDTH && width <= DOC_MAX_WIDTH ) || !(height >= DOC_MIN_HEIGHT && height <= DOC_MAX_HEIGHT )) {
                err += "File width  between ("+DOC_MIN_WIDTH+"-"+DOC_MAX_WIDTH+")px <br/> & height  between ("+DOC_MIN_HEIGHT+"-"+DOC_MAX_HEIGHT+")px required.<br/>";
            }
        }
    }


    if (err1.length > 0) {
        // when error exist
        $("#" + type + "_err").html(err1);
        $('button[type="submit"]').addClass('disabled');
        err1 = '';
        return;
    } else {
        // no validation error
        $("#" + type + "_err").html("");
        $('button[type="submit"]').removeClass('disabled');
    }

    /*
     for user, auth_file, birth_crt, birth_crt_tmp, profile_pic_tmp, pilgrim_pic_tmp, pilgrim_nrb_tmp
     */
    if (type == 'user' || type == 'auth_file'|| type == 'profile_pic_tmp') {
        data = {
            base64_img: base64_img,
            ref_id: ref_id
        };
    }
    //adding token
    data._token = _token;

    $("#upload_progress").removeClass('hidden');

    //$('button[type="submit"]').addClass('disabled');
//for file or image request
    $.ajax({
        url: base_url + '/files/store/' + type,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (response) {
            // success
            if (response.responseCode == 1) {
                //console.log('done');
                $(input).parent().find('.upload_flags').val(1);
                console.log("upload done");
                $("#" + target).removeClass('hidden');
                input.value = '';
                $(input).parent().find('.change_btn').removeClass('hidden');
                $(input).hide();
            } else {
                $("#" + type + "_err").html(response.data);
                $('button[type="submit"]').addClass('disabled');
                $(input).parent().find('.upload_flags').val(0);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);

        },
        beforeSend: function (xhr) {
            console.log('before send');
        },
        complete: function () {
            $("#upload_progress").addClass('hidden');
        }
    });
}






$(document).ready(function(){
    $('.mobile_number_validation').on('blur',function(){
        var mobile_validation_err = '';
        var mobile_number = $(this).val();
        var first_digit = mobile_number.substring(0, 1);
        var first_two_digit = mobile_number.substring(0, 2);
        var first_four_digit = mobile_number.substring(0, 5);
        var regexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        // if first two digit is 01
        if(!mobile_number.match(regexp)){
            mobile_validation_err = 'Mobile number is invalid';
        }else if(mobile_number.length<11){
            mobile_validation_err = 'Mobile number should be minimum 11 digit';
        }else if(first_two_digit=='01'){
            if(mobile_number.length!=11){
                mobile_validation_err = 'Mobile number should be 11 digit';
            }
        }
        // if first two digit is +880
        else if(first_four_digit=='+8801'){
            if(mobile_number.length!=14){
                mobile_validation_err = 'Mobile number should be 14 digit';
            }
        }
        // if first digit is only
        else if(first_digit=='+'){
            // Mobile number will be ok
        } // matching pattern
        else{
            mobile_validation_err = 'Please enter valid Mobile number';
        }

        if(mobile_validation_err.length>0){
            $('.mobile_number_error').html(mobile_validation_err);
        }else{
            $('.mobile_number_error').html('');
        }

    });
});