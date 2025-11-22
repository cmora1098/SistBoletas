//Función invocada desde Main.js
function EjecutarScriptDetalle() {
    //Lo que quieras para ejecutar lo perteneciente a esta vista

    //globals.urlWebApi = $("#urlWebApi").val();
    //globals.urlMvc = $("#urlMvc").val();


    //console.log(globals.storage);

   
    //var searchData = {};

    //if ($('#anio_select').val() == 0) {
    //    searchData.vAnio = "2020";
    //} else {
    //    searchData.vAnio = $('#anio_select').val();
    //};
    

    

    var date = new Date().toISOString().substr(0, 19)
    var m = date.substr(5, 2);

    $('#mes_select option[value="' + m + '"]').attr('selected', 'selected');
    $('#mes_select').val(m);

    var searchData = getDataFields();

    if (globals.storage.iCodPerfil == 1 || globals.storage.iCodPerfil == 3) {

        if (globals.storage.iCodPerfil == 3) {
            searchData.vCodArea = globals.storage.vCodArea;
        }

        listarBoletasAdmin(searchData);

        $('#container_admin').show();
        
    } else if (globals.storage.iCodPerfil == 2) {



        listarBoletasUsuario(searchData);

    } else {

        console.log("sapo");

    }

    accionesBoleta();
    checkAll();
    sendMasiveMail();

    $('.js-select').on('change', function () {

        updateTable();

    });

    $('#modalAnular').on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget)
        var b_anio = button.data('anio'),
            b_mes = button.data('mes'),
            b_tipo = button.data('tipo'),
            b_dni = button.data('dni'),
            b_nombres = button.data('nombres'),
            b_apepat = button.data('apepat'),
            b_apemat = button.data('apemat');

        var modal = $(this)
        modal.find('.js-anular-nombres').text(b_nombres + " " + b_apepat + " " + b_apemat);
        modal.find('.js-anular-mes').text(b_mes);
        modal.find('.js-anular-tipo').text(b_tipo);
        modal.find('.js-anular-anio').text(b_anio);
        modal.find('.js-anular-dni').text(b_dni);
        modal.find('#vDni_j').val(b_dni);
        modal.find('#vAnio_j').val(b_anio);
        modal.find('#vMes_j').val(b_mes);
        modal.find('#vTipoBoleta_j').val(b_tipo);
    });

    $('#modalAnular').on('hidden.bs.modal', function (e) {
        var modal = $(this)
        modal.find('.js-anular-nombres').text("");
        modal.find('.js-anular-mes').text("");
        modal.find('.js-anular-tipo').text("");
        modal.find('.js-anular-anio').text("");
        modal.find('.js-anular-dni').text("");
        modal.find('#vDni_j').val("");
        modal.find('#vAnio_j').val("");
        modal.find('#vMes_j').val("");
        modal.find('#vTipoBoleta_j').val("");
        modal.find('#vMotivo').val("");

        

    })

     $('#btnAnular').on('click', function (e) {
         e.preventDefault();

         
            //$('#btn-form-singup').hide();
            //$('#js-spinner').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>');

         var form = $('#formAnular');


         var data = {};

         data.vAnio = $('#vAnio_j').val();
         data.vMes = $('#vMes_j').val();
         data.vDni = $('#vDni_j').val();
         data.vTipoBoleta = $('#vTipoBoleta_j').val();
         data.vMotivoAnulacion = $('#vMotivo').val();
         data.vUsuarioAnulacion = globals.storage.vUsuario;

            if (form.parsley().isValid()) {

                $.ajax({
                    type: "POST",
                    url: globals.urlWebApi + "api/Boleta/AnularBoleta",
                    data: data,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization',
                            "Bearer " + globals.storage.Token);
                    }
                }).done(function (response) {

                    if (response.vMensaje == "Se Anulo la boleta") {

                        $('#modalAnular').modal('hide')
                        updateTable();
                    }
                    

               

                }).fail(function (xhr, status, error) {
                    console.log(xhr, status, error);
                    console.log(error);
                    ;
                });


            } else {
                form.parsley().validate();
            }
        });
        
          
}

function updateTable() {
    var busqueda = getDataFields();


    $('#datable_1').DataTable().clear();
    $('#datable_1').DataTable().destroy();

    if (globals.storage.iCodPerfil == 1 || globals.storage.iCodPerfil == 3) {
        if (globals.storage.iCodPerfil == 3) {
            busqueda.vCodArea = globals.storage.vCodArea;
        }

        listarBoletasAdmin(busqueda);

    } else if (globals.storage.iCodPerfil == 2) {
        listarBoletasUsuario(busqueda);
    } else {
        console.log("sapo");
    }
}

function getDataFields() {
    var d = {};

    if (!($('#anio_select').val() == "")) {
        d.vAnio = $('#anio_select').val();
    }

    if (!($('body').find('#mes_select').val() == "")) {
        d.vMes = $('body').find('#mes_select').val();
    }

    if (!($('#vTipoBoleta').val() == "")) {
        d.vTipoBoleta = $('#vTipoBoleta').val();
    }

    if (!($('#vTipoTrabajador').val() == "")) {
        d.vTipoTrabajador = $('#vTipoTrabajador').val();
    }


    if (!($('#bVisto').val() == "")) {
        $('#bVisto').val() == "1" ? d.bVisto = true : d.bVisto = false;
        //d.bVisto = parseInt($('#bVisto').val());
    }

    if (!($('#bVistoCorreo').val() == "")) {
        $('#bVistoCorreo').val() == "1" ? d.bVistoCorreo = true : d.bVistoCorreo = false;
        console.log(d.bVistoCorreo);
    }

    if (!($('#bCorreoEnviado').val() == "")) {
        $('#bCorreoEnviado').val() == "1" ? d.bCorreoEnviado = true : d.bCorreoEnviado = false;
    }

    if (!($('#bDescargado').val() == "")) {
        $('#bDescargado').val() == "1" ? d.bDescargado = true : d.bDescargado = false;
    }
    return d;

}


function listarBoletasAdmin(parametros){

    //console.log(parametros);
    var tblBoletas = $("#datable_1")
        .dataTable({
            "language": dataTableLanguage,
            "paging": false,
            "scrollX": true,
            "scrollY": "500px",
            "scrollCollapse": true,
            "sAjaxSource": globals.urlWebApi +'api/Boleta/ListarBoletas',
            "fnServerData": function (url, odata, callback) {
                var data = parametros;
                data.iCodPerfil = globals.storage.iCodPerfil;
                
                $.ajax({
                    "url": url,
                    "dataSrc": "",
                    "data": data,
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader('Authorization',
                            "Bearer " + globals.storage.Token);
                    },
                    "success":

                        function (response) {
                            if (response.length === 0) {
                                callback({
                                    data: response,
                                    recordsTotal: 0,
                                    recordsFiltered: 0
                                });
                            } else {
                                if (response.vMensaje === "NO EXISTEN BOLETAS") {
                                    callback({
                                        data: response,
                                        recordsTotal: 0,
                                        recordsFiltered: 0
                                    });
                                } else {
                                    callback({
                                        data: response,
                                        recordsTotal: response.length,
                                        recordsFiltered: response.length
                                    });
                                }
                            }
                        },
                    "contentType": "application/x-www-form-urlencoded; charset=utf-8",
                    "dataType": "json",
                    "type": "POST",
                    "cache": false,
                    "error": function (xhr, status, error) {
                        console.log(xhr, status, error);
                        console.log("DataTables warning: JSON data from server failed to load or be parsed. " +
                            "This is most likely to be caused by a JSON formatting error.");
                        $('#datable_1').DataTable().clear();
                        $('#datable_1').DataTable().destroy();
                    },
                    "fail": function(xhr, status, error) {
                        console.log(xhr, status, error);
                        console.log(error);

                    }
                });
            },
            "columns": [              
                { "title": "Id", "searchable": true, "data": "iCodBoleta" },
                { "title": "Tipo", "data": "vTipoBoleta" },
                { "title": "Régimen", "data": "vTipoTrabajador" },
                { "title": "Area", "data": "vArea" },
                { "title": "DNI", "searchable": true, "data": "vDni" },
                { "orderable": true, "searchable": true, "title": "A. Paterno", "data": "vApePat" }, 
                { "searchable": true, "title": "A. Materno", "data": "vApeMat" }, 
                { "searchable": true, "title": "Nombres", "data": "vNombres" }, 
                { "searchable": true, "title": "Correo", "data": "vCorreo" }, 
                { "className": "text-center", "title": "Año", "data": "vAnio" }, 
                { "className": "text-center", "title": "Mes", "data": "vMes" },
                {
                    "className": "text-center", "title": "Visto", "data": "bVisto", "target": 5, "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        if (e == 'true') {
                            $(td).html("Si");
                        } else {
                            $(td).html("No");
                        }
                    }
                },
                {
                    "className": "text-center", "title": "Descargado", "data": "bDescargado", "target": 5, "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        if (e == 'true') {
                            $(td).html("Si");
                        } else {
                            $(td).html("No");
                        }
                    }
                },
                {
                    "className": "text-center", "title": "Correo Enviado", "data": "bCorreoEnviado", "target": 5
                    , "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        if (e == 'true') {
                            $(td).html("Si");
                        } else {
                            $(td).html("No");
                        }
                    }
                }, 

                {
                    "className": "text-center", "title": "Visto x Correo", "data": "bVistoCorreo", "target": 5
                    , "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        if (e == 'true') {
                            $(td).html("Si");
                        } else {
                            $(td).html("No");
                        }
                    }
                },                
                {
                    "className": "text-center", "title": "Fecha Anulación", "data": "dFechaAnulacion",
                    "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        if (e == '01/01/1900') {
                            $(td).html("");
                        }

                    }
                },
                { "title": "Usuario Anulación", "data": "vUsuarioAnulacion" },
                { "title": "Motivo Anulación", "data": "vMotivoAnulacion" },
                {
                    "className": "text-center", "title": "Acciones", "data": "vAcciones",

                    "createdCell": function (td, cellData, rowData, row, col) {
                        var e = $(td).html();
                        var r = $(rowData);

                        let vAnio = rowData.vAnio,
                            vDni = rowData.vDni,
                            vMes = rowData.vMes,
                            vNombres = rowData.vNombres,
                            vApePat = rowData.vApePat,
                            vApeMat = rowData.vApeMat,
                            vTipoBoleta = rowData.vTipoBoleta;


                        if (r[0].dFechaAnulacion == '01/01/1900') {
                            
                            $(td).find('.button-list').append('<button class="js-btn-cancel btn btn-icon btn-icon-circle btn-primary btn-icon-style-3" data-mes="' + vMes + '" data-anio="' + vAnio + '" data-dni="' + vDni + '" data-tipo="' + vTipoBoleta + '" data-nombres="' + vNombres + '" data-apepat="' + vApePat + '" data-apemat="' + vApeMat + '" data-toggle="modal" data-target="#modalAnular"><span class="btn-icon-wrap"><i class="fa fa-power-off"></i></span></button>');
                        } else {
                            $(td).find('.js-btn-mail').remove();
                        }

                    }
                },
                {
                    "orderable": false, "className": "text-center", "title": '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="customCheck1"><label class="custom-control-label js-checkbox-all" for="customCheck1">&nbsp;</label></div>', "data": "iCodBoleta", "createdCell": function (td, cellData, rowData, row, col) {

                        let iCodBoleta = rowData.iCodBoleta,
                            vAnio = rowData.vAnio,
                            vApeMat = rowData.vApeMat,
                            vApePat = rowData.vApePat,
                            vCorreo = rowData.vCorreo,
                            vDni = rowData.vDni,
                            vMes = rowData.vMes,
                            vNombres = rowData.vNombres,
                            vTipoBoleta = rowData.vTipoBoleta;

                        var r = $(rowData);
                        if (r[0].dFechaAnulacion == '01/01/1900') {

                            $(td).html('<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input js-sr-checkbox" id="check_' + iCodBoleta + '" data-mail="' + vCorreo + '" data-nombres="' + vNombres + '" data-apepat="' + vApePat + '" data-apemat="' + vApeMat + '" data-mes="' + vMes + '" data-anio="' + vAnio + '" data-dni="' + vDni + '" data-tipo="' + vTipoBoleta + '"><label class="custom-control-label js-checkbox" for="check_' + iCodBoleta + '">&nbsp;</label></div>');
                        } else {
                            $(td).html("");
                        }


                        

                    }
                }

            ]
        });
}

function listarBoletasUsuario(parametros) {

    var tblBoletas = $("#datable_1")
        .dataTable({
            "bLengthChange": true,
            "bFilter": false,
            "processing": true,
            "language": dataTableLanguage,
            "paging": false,
            "bServerSide": true,
            "scrollX": true,
            "sAjaxSource": globals.urlWebApi + 'api/Boleta/ListarBoletas',
            "fnServerData": function (url, odata, callback) {
                var data = parametros;
                data.vDni = globals.storage.dni;
                data.vMes = "";
                data.iCodPerfil = globals.storage.iCodPerfil;
                $.ajax({
                    "url": url,
                    "dataSrc": "",
                    "data": data,
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader('Authorization',
                            "Bearer " + globals.storage.Token);
                    },
                    "success":

                        function (response) {

                            if (response.length === 0) {
                                callback({
                                    data: response,
                                    recordsTotal: 0,
                                    recordsFiltered: 0
                                });
                            } else {
                                if (response.vMensaje === "NO EXISTEN BOLETAS") {
                                    callback({
                                        data: response,
                                        recordsTotal: 0,
                                        recordsFiltered: 0
                                    });
                                } else {
                                    callback({
                                        data: response,
                                        recordsTotal: response.length,
                                        recordsFiltered: response.length
                                    });
                                }
                            }

                        },
                    "contentType": "application/x-www-form-urlencoded; charset=utf-8",
                    "dataType": "json",
                    "type": "POST",
                    "cache": false,
                    "error": function (xhr, status, error) {
                        console.log(xhr, status, error);
                        alert("DataTables warning: JSON data from server failed to load or be parsed. " +
                            "This is most likely to be caused by a JSON formatting error.");
                    },
                    "fail": function (xhr, status, error) {
                        console.log(xhr, status, error);
                        console.log(error);

                    }
                });
            },
            "columns": [

                { "title": "Id", "searchable": false, "data": "iCodBoleta" },
                { "title": "Año", "data": "vAnio" },
                { "title": "Mes", "data": "vMes" },
                { "title": "Acciones", "data": "vAcciones" }
            ]
        });
}

function accionesBoleta() {

    //$('.table-boleta').on('click', '.js-btn-cancel', function () {

    //    let $this = $(this);

    //    let obj = {};

    //    obj.vDni = $this.data("dni");
    //    obj.vAnio = $this.data("anio");
    //    obj.vMes = $this.data("mes");
    //    obj.iCodPerfil = 2;
    //    obj.vTipoBoleta = $this.data("tipo");

    //    if (globals.storage.iCodPerfil == 1) {
    //        obj.bDescargado = false;
    //    } else if ((globals.storage.iCodPerfil == 2)) {
    //        obj.bDescargado = true;
    //    } else {
    //        console.log("sapo");
    //    }

    //    let opcion = "descarga";
    //    getData(obj, opcion);


    //});



    $('.table-boleta').on('click', '.js-btn-download', function () {

        let $this = $(this);

        let obj = {};

        obj.vDni = $this.data("dni");
        obj.vAnio = $this.data("anio");
        obj.vMes = $this.data("mes");
        obj.iCodPerfil = 2;
        obj.vTipoBoleta = $this.data("tipo");

            if (globals.storage.iCodPerfil == 1) {
                obj.bDescargado = false;
            } else if ((globals.storage.iCodPerfil == 2) ){
                obj.bDescargado = true;
            } else {
                console.log("sapo");
            }
        
        let opcion = "descarga";
        getData(obj, opcion);


    });


    $('.table-boleta').on('click', '.js-btn-watch', function () {
        
        let $this = $(this);
        let obj = {};

        obj.vDni = $this.data("dni");
        obj.vAnio = $this.data("anio");
        obj.vMes = $this.data("mes");
        obj.iCodPerfil = globals.storage.iCodPerfil;
        obj.vTipoBoleta = $this.data("tipo");


        ////aqui se envía el visto en true o false dependiendo del tipo de usuario
        //if (globals.storage.iCodPerfil == 1) {
        //    obj.bVisto = false;
        //} else if ((globals.storage.iCodPerfil == 2)) {
        //    obj.bVisto = true;
        //} else {
        //    console.log("sapo");
        //}

        let opcion = "visto";

        getData(obj, opcion);

    });


    $('.table-boleta').on('click', '.js-btn-mail', function () {

        let $this = $(this);

        let objeto = {};
        objeto.vDni = $this.data("dni");
        objeto.vAnio = $this.data("anio");
        objeto.vMes = $this.data("mes");
        objeto.vTipoBoleta = $this.data("tipo");
        objeto.vNombres = $this.data("nombres");
        objeto.vApepat = $this.data("apepat");
        objeto.vApemat = $this.data("apemat");
        objeto.vCorreo = $this.data("mail");
        objeto.iCodPerfil = globals.storage.iCodPerfil;

        if (objeto.vCorreo.length !== 0 ) {

            $this.find('.btn-icon-wrap').html('<i class="fa fa-refresh fa-spin fa-1x fa-fw"></i><span class="sr-only"> Loading...</span >');
            
            $.ajax({
                type: "POST",
                url: globals.urlWebApi + "/api/Boleta/EnviarCorreo",
                data: objeto,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization',
                        "Bearer " + globals.storage.Token);
                }
            })
                .done(function (aData) {
                            //console.log(aData.vMensaje);

                    if (aData.vMensaje == "Mail enviado") {

                            $this.find('.btn-icon-wrap').html('<i class="fa fa-envelope-o" aria-hidden="true"></i>');
                            msgSuccess();

                    }

                }).fail(function (xhr, status, error) {
                    console.log(xhr, status, error);
                    console.log(error);
                    $this.find('.btn-icon-wrap').html('<i class="fa fa-envelope-o" aria-hidden="true"></i>');
                    msgAlert();
                });
        } else {
            $this.find('.btn-icon-wrap').addClass('animate');
            console.log('no tiene correo');
            msgAlert();
        }

    });


}

function getData(data, opcion) {

    console.log(data);
    console.log(opcion);
    $.ajax({
        type: "POST",
        url: globals.urlWebApi + "api/Boleta/VerBoleta",
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',
                "Bearer " + globals.storage.Token);
        }
    }).done(function (response) {


        if (response.vBoletaBase64.length > 0) {
            var ObjResponse = {
                pdf: response.vBoletaBase64
            };

            let pdf_ = "data:application/pdf;base64," + ObjResponse.pdf;
            

            if (opcion === "visto") {
                let iframe = '<iframe style="min-height:1200px;width: 100%;" src="' + pdf_+ '"></iframe>';
                
                $('#modalPdfModal .modal-body').html(iframe);

                $('#modalPdfModal').modal('show');
            } 

            if (opcion ==="descarga") {
                let dlnk = document.getElementById('dwnlink');
                dlnk.href = pdf_;

                dlnk.click();

            } 

            if (opcion === "mail") {

                console.log("mail");
            }           


        }

    }).fail(function (xhr, status, error) {
        console.log(xhr, status, error);
        console.log(error);
        ;
    });
}


function msgAlert() {

    $.toast().reset('all');
    $("body").removeAttr('class');
    $.toast({
        heading: 'No se pudo enviar',
        text: '<i class="jq-toast-icon fa fa-meh-o fa-1x" aria-hidden="true"></i> El usuario no cuenta con correo electronico.',
        position: 'top-right',
        loaderBg: '#f68daf',
        class: 'jq-has-icon jq-toast-danger',
        hideAfter: 3500,
        stack: 6,
        showHideTransition: 'fade'
    });
}


function msgSuccess() {

    $.toast().reset('all');
    $("body").removeAttr('class');
    $.toast({
        heading: '!Exito!',
        text: '<i class="jq-toast-icon fa fa-smile-o fa-1x"" aria-hidden="true"></i> Se envió el correo a la bandeja indicada.',
        position: 'top-right',
        loaderBg: '#f68daf',
        class: 'jq-has-icon jq-toast-success',
        hideAfter: 3500,
        stack: 6,
        showHideTransition: 'fade'
    });
}


function msgSuccess2(correos) {

    $.toast().reset('all');
    $("body").removeAttr('class');
    $.toast({
        heading: '!Exito!',
        text: '<i class="jq-toast-icon fa fa-smile-o fa-1x"" aria-hidden="true"></i> Se enviaron ' + correos+' correos',
        position: 'top-right',
        loaderBg: '#f68daf',
        class: 'jq-has-icon jq-toast-success',
        hideAfter: 3500,
        stack: 6,
        showHideTransition: 'fade'
    });
}


function checkAll() {

    $(document).on('click', '.js-checkbox-all', function () {
        
        var $box = $('#customCheck1');
        var $boxes = $('#datable_1').find('.js-sr-checkbox');
        
        
        if ($box.is(":checked")) {
            
            $boxes.prop("checked", false);
        } else {
            $boxes.prop("checked", true);

        }






    });
}

var counter;

function sendMasiveMail() {



    $('#send-masive-mails').on('click', function () {



        let $box = $('#customCheck1');
        $boxes = $('#datable_1').find('.js-sr-checkbox:checked');
        
        var arrayboxes = [];

        for (var i = 0; i < $boxes.length; i++) {
                                        
            let ip = $boxes.eq(i),
                
                ml = ip.data('mail');
            //console.log(ip);
            //console.log(ml);

            if (ml.length > 0) {
                arrayboxes.push($boxes.eq(i));
            }                       

        }

        $('.wrap-masive-mails').append('Enviando ' + $boxes.length+' correos, esto puede tardar unos minutos. <i class= "fa fa-refresh fa-spin fa-1x fa-fw" ></i> <span class="sr-only"> Loading...</span>');
        $('#send-masive-mails').hide();

        
        counter = 0;
        recursively_ajax(arrayboxes);
    });
}



function recursively_ajax(arrayObjects) {



    var element = arrayObjects[counter],
        objects = arrayObjects;

    let obj = {};
    obj.vDni = $(element).eq(0).data("dni");
    obj.vAnio = $(element).eq(0).data("anio");
    obj.vMes = $(element).eq(0).data("mes");
    obj.vTipoBoleta = $(element).eq(0).data("tipo");
    obj.vNombres = $(element).eq(0).data("nombres");
    obj.vApepat = $(element).eq(0).data("apepat");
    obj.vApemat = $(element).eq(0).data("apemat");
    obj.vCorreo = $(element).eq(0).data("mail");
    obj.iCodPerfil = globals.storage.iCodPerfil;


    $.ajax({
        type: "POST",
        async: false, // set async false to wait for previous response
        url: globals.urlWebApi + "/api/Boleta/EnviarCorreo",
        dataType: "json",
        data: obj,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization',
                "Bearer " + globals.storage.Token);
        },
        success: function (data) {

            if (data.vMensaje == "Mail enviado") {


            }

            counter++;

            if (counter < objects.length) {

                setTimeout(recursively_ajax(objects), 3000);                
                $('.wrap-masive-mails').html('');
                $('#send-masive-mails').show();
                var a = objects.length
                msgSuccess2(a)
                updateTable();
            }






        },
        fail: function(xhr, status, error) {
            console.log(xhr, status, error);
            console.log(error);
            msgAlert();
        }
    });
}


