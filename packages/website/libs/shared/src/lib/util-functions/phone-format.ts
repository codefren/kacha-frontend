export function orderPhoneNumber( number: string ) {
    
    let prefix: string = `+${ number.slice( 0, 2 ) } `;
    let phone: string = number.slice( 2 );

    console.log( phone );

    for ( let i = 0; i <= phone.length; i++ ) {

      if ( i % 3 === 0 ) {
        prefix += ' ';
      }

      prefix += phone.charAt( i );
    }

    // expected +34 677 777 779
    return prefix;
}