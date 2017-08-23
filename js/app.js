/**
 * Created by qiyq on 2017/8/16.
 */
var baseUrl = 'http://localhost:666/';
var token = window.sessionStorage.getItem("token");
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
function showTip(status) {
    if (status == "success") {
        $(".tipDiv").append('<div class="alert alert-success alert-styled-left alert-arrow-left alert-bordered"> <button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button><span class="text-semibold">操作成功！</span></div>');
    } else {
        $(".tipDiv").append(' <div class="alert alert-danger alert-styled-left alert-bordered"><button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button><span class="text-semibold">操作失败！</span></div>');
    }
    setTimeout(function () {
        $(".tipDiv").empty();
    }, 2000);
}
function editEvent(id) {
}
function deleteEvent(id) {
}
function getData(page) {
    $(".table_list tbody").empty();
    var parm = {
        page: page || 1,
        artname: $("#artname").val(),
        arttype: $("#arttype").selectpicker("val")
    };
    $.ajax({
        url: baseUrl + 'list',
        type: 'GET',
        dataType: 'json',
        data: parm,
        headers: {
            'x-access-token': token
        },
        success: function (data) {
            if (data.status == "success") {
                $('.pagination').bootpag({
                    total: data.totalPage,
                    page: data.currentPage,
                    maxVisible: 10,
                    leaps: true,
                    firstLastUse: true,
                    first: '首页',
                    last: '尾页',
                    wrapClass: 'pagination',
                    activeClass: 'active',
                    disabledClass: 'disabled',
                    nextClass: 'next',
                    prevClass: 'prev',
                    lastClass: 'last',
                    firstClass: 'first'
                });

                if (data.data.length == 0) {

                    $(".table_list tbody").append('<td colspan="5">没有文章</td>');
                } else {
                    for (var i in data.data) {
                        var html = ' <tr> <td>' + data.data[i].artid + '</td><td>' + data.data[i].arttype + '</td> <td>' + data.data[i].arttime + '</td> <td>' + data.data[i].artname + '</td> <td> <button type="button" class="btn btn-primary btn-labeled" onclick="editEvent(' + data.data[i].artid + ')"><b><i class="fa fa-envira"></i></b> 编辑 </button> <button type="button" class=" btn btn-danger btn-labeled"><b><i class="fa fa-drupal" onclick="deleteEvent(' + data.data[i].artid + ')"></i></b> 删除 </button></td> </tr>';

                        $(".table_list tbody").append(html);
                    }
                }


            }
        },
        error: function (data) {
            console.log(data.msg);
        }
    });
}
$(function () {
    $("select").selectpicker();
    //获取数据
    getData(1);
    //search event
    $(".search").click(function () {
        getData(1);
    });
    $('.pagination').on("page", function (event, num) {
        getData(num);
    });
    // Full featured editor
    var editor = new Simditor({
        textarea: $('#editor-full'),
        pasteImage: true,
        toolbar: ['title'
            , 'bold', 'italic', 'underline', 'fontScale',
            'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment', 'html'],
        upload: {
            url: '/PublicInfoManage/Notice/SavePic', //文件上传的接口地址
            params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
            fileKey: 'fileDataFileName', //服务器端获取文件数据的参数名
            connectionCount: 3,
            leaveConfirm: '正在上传文件'
        }
    });
    //登录


    $('#myModal').on('show.bs.modal', function (e) {
        var d = new Date();
        var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        //内容保存
        $(".contentSave").click(function () {

            if (!validateForm($(".art"))) return;
            var dataModal = {
                artname: $(".artname").val(),
                arttype: $(".arttype").selectpicker("val"),
                arttime: str,
                artcontent: editor.getValue()
            };
            //登录
            $.ajax({
                url: baseUrl + 'content',
                type: 'POST',
                data: dataModal,
                headers: {
                    'x-access-token': token
                },
                dataType: 'json',
                success: function (data) {
                    if (data.status == "success") {
                        $('#myModal').modal('hide');
                        showTip("success");
                        getData(1);
                    } else {
                        showTip("fail");
                    }
                },
                error: function (data) {
                    showTip("fail");
                }
            });
        })
    });

});
