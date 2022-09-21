import https from 'https'
import http from 'http'

//      GET
const getRequest = http.get(                            //  no Auth     -->     no need for https
    'http://www.google.com' ,
    response => {
        console.log('statusCode: ' + response.statusCode)
        console.log(response.headers)

        response.on('data', chunk => {
            console.log('\n *************** THIS IS A CHUNK ***************  \n')
            console.log(chunk.toString())
        })
    }
)

getRequest.on('error', err => {
    console.log(err)
})

//      POST, PUT, DELETE, GET
const data = JSON.stringify({ userName: 'stef007'})
const options = {
    hostname: 'localhost',
    port: 443,                          // 8080 for http
    path: '/users',
    method: 'POST',                 // PUT, DELETE, GET
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': Buffer.from('myUsername' + ':' + 'myPassword').toString('base64')
    }
}

const request = https.request(
    options,
    response => {
        console.log('statusCode: ' + response.statusCode)
        console.log(response.headers)

        response.on('data', chunk => {
            console.log('\n *************** THIS IS A CHUNK ***************  \n')
            console.log(chunk.toString())
        })
    }
)

request.on('error', err => {
    console.log(err)
})

request.write(data)                         // not with GET ! ! !

request.end()