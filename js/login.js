/**
 * Created by qiyq on 2017/8/16.
 */
function validateForm(form) {
    return form.validate({
        messages: {
            username: "用户名不可为空！",
            password: "密码不可为空！",
            arttype: '类型不能为空!',
            artname: '名称不能为空!'
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-error").removeClass("has-success");
            $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parent().addClass("has-success").removeClass("has-error");
            $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        }
    }).form();
}
$(function () {
    var isLogin = false;
    var baseUrl = 'http://localhost:666/';
    var $input = $(".login_form input");

    $(".login").click(function () {
        if (!validateForm($(".login_form"))) return;
        var dataModal = {
            username: $(".username").val(),
            password: $(".password").val()
        };

        //登录
        $.ajax({
            url: baseUrl + 'login',
            type: 'POST',
            data: dataModal,
            dataType: 'json',
            success: function (data) {
                if (data.status == "success") {
                    isLogin = true;
                    window.location.href = 'content.html';
                    window.sessionStorage.setItem("token", data.token)
                } else {
                    $(".tip").text(data.msg);

                }
            },
            error: function (data) {
                $(".tip").text(data.msg);
            }
        });
    });
    $input.focus(function () {
        $(".tip").text('');
    });

});