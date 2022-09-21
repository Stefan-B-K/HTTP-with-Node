import axios from 'axios'
import * as fs from 'fs'

//      GET
axios.get('http://www.google.com')
    .then(response => {
        console.log(response.data)
    })
    .catch(error => {
        console.error(error)
    })

//      GET     with Streams
axios({
    method: 'get',
    url: 'http://www.google.com',
    responseType: 'stream'
})
    .then(response => {
        response.data.pipe(fs.createWriteStream('google.html'))
    })
    .catch(error => {
        console.error(error)
    })


//      POST    with  data transform prior to posting
axios({
    method: 'post',
    url: 'http://localhost:8080/users',
    data: {
        userName: 'stef007'
    },
    transformRequest: (data, headers) => {
        const newData = { userName: data.userName + '@mail.bg' }
        return JSON.stringify(newData)
    },
    // transformResponse: data => { }
})
    .then(response => {
        response.data.pipe(fs.createWriteStream('google.html'))
    })
    .catch(error => {
        console.error(error)
    })

//      parallel requests
axios.all([
    axios.get('http://localhost:8080/metadata?id=1'),
    axios.get('http://localhost:8080/metadata?id=2')
]).then(responseArray => {
    console.log(responseArray[0].data.description)
    console.log(responseArray[1].data.description)
})
