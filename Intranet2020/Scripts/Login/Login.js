//var $ = require('jquery');
//let redirect = require('jquery.redirect');
let globals = {
    urlWebApi: "",
    urlMvc: "",
    urlWebApiSeguridad: ""
}

$(document).ready(function () {
    globals.urlWebApi = $("#urlWebApi").val();
    globals.urlMvc = $("#urlMvc").val();
    $("#vUsuario").focus();
          

    $('#btn-form-singup').on('click', function (e) {
        e.preventDefault();
        $('#btn-form-singup').hide();
        $('#js-spinner').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>');

        var form = $('#form-singup'),
            a = document.getElementById('form-singup');
        if (form.parsley().isValid()) {
            var Usuario = $("#vUsuario").val();
            var Password = $("#vContrasena").val();

            var obj = {
                vUsuario: Usuario,
                vContrasena: Password
            };
            //console.log(obj);
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "api/Intranet/authenticate",
                data: obj
            }).done(function (aData) {
                if (aData.vMensaje === "OK") {
                    var ObjetoLogin = {
                        Dominio: aData.bDominio,
                        Opcion: aData.iOpcion,
                        APaterno: aData.dsc_paterno,
                        AMaterno: aData.dsc_materno,
                        Nombres: aData.dsc_nombres,
                        dni: aData.num_documento,
                        Token: aData.token,
                        iCodPerfil: aData.iCodPerfil,
                        vUsuario: obj.vUsuario,
                        vCodArea: aData.cod_area
                    };
                    localStorage.setItem("usuario", JSON.stringify(ObjetoLogin));
                    location.href = globals.urlMvc + 'home/index/?tk=';

                    //$.ajax({
                    //    type: "POST",
                    //    url: "https://intranet.agrorural.gob.pe/comechat/AgroLogin.php",
                    //    data: { 'dni': ObjetoLogin.dni}
                    //}).done(function (aData) {
                    //    if (aData > 0) {
                    //        //localStorage.setItem("chatId", aData);
                    //        document.cookie = "CookieChat=" + aData + ";";   
                    //        location.href = globals.urlMvc + 'home/index/?tk=' + aData;
                    //    }

                    //}).fail(function (xhr, status, error) {
                    //    console.log(xhr, status, error);
                    //    console.log(error);
                    //});                    

                } else {
                    localStorage.removeItem('usuario');
                    resetForm(form);
                    $("#vUsuario").focus();
                    form.parsley().validate();
                    form.prepend('<div class="alert alert-danger alert-wth-icon alert-dismissible fade show" role="alert">< span class= "alert-icon-wrap" > <i class="fa fa-meh-o" aria-hidden="true"></i></span >Revisar sus credenciales< button type = "button" class= "close" data - dismiss="alert" aria - label="Close" ><span aria-hidden="true">&times;</span></button ></div>');
                    $('#btn-form-singup').show();
                    $('#js-spinner').html(' ');

                }
            }).fail(function (xhr, status, error) {
                console.log(xhr, status, error);
                console.log(error);  
                resetForm(a);
                $("#vUsuario").focus();
                form.parsley().validate();

                form.prepend('<div class="alert alert-danger alert-wth-icon alert-dismissible fade show" role="alert"><span class="alert-icon-wrap"> <i class="fa fa-meh-o" aria-hidden="true"></i></span>Revisar sus credenciales<button type = "button" class= "close" data-dismiss="alert" aria-label="Close" ><span aria-hidden="true">&times;</span></button></div>');
                $('#btn-form-singup').show();
                $('#js-spinner').html(' ');
            });

        } else {
            form.parsley().validate();

            form.prepend('<div class="alert alert-danger alert-wth-icon alert-dismissible fade show" role="alert"><span class="alert-icon-wrap"> <i class="fa fa-meh-o" aria-hidden="true"></i></span>Revisar sus credenciales<button type = "button" class= "close" data-dismiss="alert" aria-label="Close" ><span aria-hidden="true">&times;</span></button></div>');
            $('#btn-form-singup').show();
            $('#js-spinner').html(' ');

        }
    });

    
});

