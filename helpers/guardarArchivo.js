const fs = require('fs');

const archivo = './db/data.json';

const guardarDB = ( data ) => {
    fs.writeFileSync( archivo, JSON.stringify( data ) );
};

const leerDB = () => {    
    if( !fs.existsSync(archivo) ){
        return null;
    };
    
    const info = fs.readFileSync(archivo, { encoding: 'utf-8' });

    // Controlo si el archivo esta vacio
    if ( !info ) {
        return null;
    };

    return JSON.parse( info );
};

module.exports = {
    guardarDB,
    leerDB
};