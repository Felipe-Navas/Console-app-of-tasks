require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
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
                const desc = await leerInput( 'Descripción:' );
                tareas.crearTarea( desc );
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
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar( '¿Está seguro?' );
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log( 'Tarea borrada' );
                    };
                };
            break;
        };

        guardarDB( tareas.listadoArr );

        await pausa();

    } while( option !== '0' );

    // pausa();
};

main();
