require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareas,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

const main = async() => {
    let option = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if ( tareasDB ) { // Cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    };

    do {
        // Imprimir el menú
        option = await inquirerMenu();

        switch (option) {
            case '1': // Crear tarea
                const desc = await leerInput( 'Descripción (Ingresar 0 para volver):' );
                
                // Si ingresa '0' no guarda la tarea y vuelve al menu anterior
                if ( desc !== '0') {
                    tareas.crearTarea( desc );
                };
            break;

            case '2': // Listar todas las tareas
                tareas.listadoCompleto();
            break;
            
            case '3': // Listar tareas completadas
                tareas.listarPendientesCompletadas( true );
            break;

            case '4': // Listar tareas pendientes
                tareas.listarPendientesCompletadas( false );
            break;

            case '5': // Marcar tarea como completada o pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;
                       
            case '6': // Borrar Tarea
                const id = await listadoTareas( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar( '¿Está seguro?' );
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log( 'Tarea borrada' );
                    };
                };
            break;
            
            case '7': // Modificar Tarea
                const idModif = await listadoTareas( tareas.listadoArr );

                // Si ingresa '0' vuelve al menu anterior
                if ( idModif == '0') {
                    break;
                };
                const descModif = await leerInput( 'Descripción (Ingresar 0 para volver):' );
                
                // Si ingresa '0' no guarda la tarea y vuelve al menu anterior
                if ( descModif !== '0') {
                    tareas.modificarTarea( idModif, descModif );
                };
                break;
        };

        guardarDB( tareas.listadoArr );

        await pausa();

    } while( option !== '0' );

    // pausa();
};

main();
