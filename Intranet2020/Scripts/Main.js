let globals = {
    urlWebApi: "",
    urlMvc: ""
};

$(document).ready(function () {

    globals.urlWebApi = $("#urlWebApi").val();
    globals.urlMvc = $("#urlMvc").val();
    
    
    if (CheckSession()) {
        $.redirect(globals.urlMvc + "Login/Index", null);
    } else {
        globals.storage = JSON.parse(localStorage.usuario);
        // Obtenemos los datos y los almacenamos en variables
      
        //console.log(`Hola, mi nombre es ${globals.objStorage.Nombres} ${globals.objStorage.APaterno}`);
    }
      


    $('#btn-logout').click(function () {

        localStorage.clear();
        $.redirect(globals.urlMvc + "Login/Index", null);
    });

    EjecutarScriptDetalle();

    $('#user_name').prepend(globals.storage.Nombres + ' ' + globals.storage.APaterno);


                
});

function CheckSession() {       

    if ((localStorage.getItem("usuario") === null) || (JSON.parse(localStorage.getItem("usuario")).persona === null)) {
        //console.log("no");
        return true;
    } else {
        return false;
    }
    
    
}