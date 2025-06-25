export function sliceMediaString( text: string, length: number, mediaQuery: string  ) {

    if ( window.matchMedia( mediaQuery ).matches && text.length > length ) {
        return text.slice( 0, length ) + '...';
    } 

    if ( window.matchMedia( mediaQuery ).matches && text.length <= length ) {
        return text;
    } 

    if ( text.length < 18 ) {
        return text;
    }
  
    return text.slice( 0, 18 ) + '...';
}