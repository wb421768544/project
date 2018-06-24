function parseCookie( cookie ) {
    var cookies = {};
    if( !cookie ){
        return cookies;
    }
    var list = cookie.split( ";" );
    for( let i = 0, len = list.length; i < len; i ++ ){
        let pair = list[i].split("=");
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
}

module.exports = parseCookie;