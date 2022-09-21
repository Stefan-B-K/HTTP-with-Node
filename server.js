import http from 'http'
// import https from 'https'
import { parse, fileURLToPath } from 'url'
import { dirname } from 'path'
import formidable from 'formidable'
import * as fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import jsonBody from 'body/json.js'
import { fetchImageMetadata, createUser } from './services.js'

const server = http.createServer()
// const server = https.createServer({                      //  https
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem')
// })
server.on('request', (request, response) => {
    request.on('error', err => { console.log('REQUEST ERROR', err) })
    response.on('error', err => { console.log('RESPONSE ERROR', err) })

    const parsedUrl = parse(request.url, true)

    if (request.method === 'GET' && parsedUrl.pathname === '/metadata') {
        const { id } = parsedUrl.query
        const metadata = fetchImageMetadata(id)
        const serializedJSON = JSON.stringify(metadata)
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.write(serializedJSON)
        response.end()

    } else if (request.method === 'POST' && parsedUrl.pathname === '/users') {
        jsonBody(request, response, (err, body) => {
            if (err) {
                console.log('ERROR: \n', err)
            } else {
                console.log(body)
                createUser(body['userName'])
            }
        })

    } else if (request.method === 'GET') {
        fs.createReadStream('./index.html').pipe(response)

    } else if (request.method === 'POST' && parsedUrl.pathname === '/upload') {
        const form = new formidable.IncomingForm({
            uploadDir: __dirname,
            keepExtensions: true,
            multiples: true,
            maxFileSize: 20 * 1024 * 1024,
            encoding: 'utf-8',
            maxFields: 20
        })

        // form.parse(request, (err, fields, files) => {                    //      Callback
        //     if (err) {
        //         console.log(err)
        //         response.statusCode = 500
        //         response.end('Error uploading')
        //     }
        //     response.statusCode = 200
        //     response.end('Success!')
        // })

        form.parse(request)                                                         //      Events / Streams
            .on('fileBegin', (name, file) => {
                console.log('UPLOAD STARTED...')
            })
            .on('file', (name, file) => {
                console.log('File (and Filed) received')
            })
            .on('field', (name, value) => {
                console.log('Field received')
                console.log(name, value)
            })
            .on('progress', (bytesReceived, bytesExpected) => {
                console.log(bytesReceived + ' / ' + bytesExpected)
            })
            .on('error', err => {
                console.error(err)
                request.resume()
            })
            .on('aborted', () => {
                console.log('Request aborted by user!')
            })
            .on('end', () => {
                console.log('DONE - request fully received')
                response.end('SUCCESS!!!')
            })

    } else {
        // response.statusCode = 404
        // response.setHeader('XXX-Powered-By', 'Node')
        response.writeHead(404, { 'XXX-Powered-By': 'Node' })
        response.end()
    }

})

server.listen(8080)
console.log('Http server running on port 8080...')
// server.listen(443)
