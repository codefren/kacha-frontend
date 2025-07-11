// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    //apiUrl: 'https://dev.api.optimroute.com',
    apiUrl: 'https://api.kachadigitalbcn.com/api/',
    jobsUrl: 'wss://dev.jobs.optimroute.com',
    geolocationWss: {
        pusher_key: 'key_JdwDDV9sWV7kEhXgFGbEKtfjrkPdFeyc',
        cluster: 'mt1',
        wsHost: 'localhost',
        wssPort: 6001,
        wsPort: 6001,
        // wsPort: 6001,
        httpHost: 'localhost:6001',
        httpPort: 6001,
        enableStats: true,
        enabledTransports: ['ws'],
        forceTLS: false,
        authEndpoint: 'https://api.kachadigitalbcn.com/api/broadcasting/auth',
    },
    name: 'local-dev',
    sessionTimeOut: 1,
    sentryEnabled: false,
    version: require('../../../../package.json').version,
    loadDefaultRoutes: false,
    refresh_datatable_assigned: 240000,
    stripePublicKey: "pk_test_CXnsXulMSsQW3WzXLWA0LUGB00VRUUrZm0",
    Recaptcha: {
        'name': 'local',
        'siteKey': '6LeF8lUUAAAAAK4kS1_sjg9fx0wV_RkcBitKZWhF'
    },
    DataTableEspaniol: {
        emptyTable: 'No hay datos disponibles en esta tabla',
        /* info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros', */
        /* infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros', */
        info: 'Mostrando _END_ registros de _TOTAL_',
        infoEmpty: 'Mostrando 0 registros de 0',
        infoFiltered: '(filtrado de un total de _MAX_ registros)',
        infoPostFix: '',
        infoThousands: ',',
        loadingRecords: 'Cargando...',
        lengthMenu: 'Mostrar _MENU_',
        processing: 'Cargando...',
        search: 'Buscar:',
        url: '',
        zeroRecords: 'No hay datos disponibles en esta tabla',
        paginate: {
            first: '&laquo;&laquo;',
            previous: '&laquo;',
            next: '&raquo;',
            last: '&raquo;&raquo;',
        },
        aria: {
            sortAscending: ': Activar para ordenar la columna de manera ascendente',
            sortDescending: ': Activar para ordenar la columna de manera descendente',
        },
    },
    URL_TERMS_CONDITIONS: 'https://www.polpoo.com',
    URL_PRIVACY_TERMS: 'https://www.polpoo.com',
    MONEY_SYMBOL: '€'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will
 * have a negative impact on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
