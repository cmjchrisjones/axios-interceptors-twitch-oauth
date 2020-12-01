const express = require('express')
const app = express()
const port = 3002
const dotenv = require('dotenv');
const { default: Axios } = require('axios');
dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log(`Twitch Client Id: ${process.env.TWITCH_CLIENT_ID}`)

    // getStuff().then(x => {
    //     console.log(`x is ${x}`)
    // });
    getTwitchProfilePicture(218959968).then(res => {
        // console.log(res.data)
    });
})

let bearerToken;
let getProfileUrl = 'https://api.twitch.tv/helix/users?id='
let getTokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user:read:email`
Axios.interceptors.request.use(
    config => {
        const token = bearerToken;
        console.log(`bearer token is currently ${bearerToken}`)
        if (token) {
            config.headers['Authorization'] = `Bearer ${bearerTokenƒ}`
        }
        return config
    },
    error => {
        Promise.reject(error);
    }
)

Axios.interceptors.response.use((response) => {
    return response
},
    function (error) {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return Axios.post(getTokenUrl, {

            }).then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    bearerToken = res.data.access_token
                    console.log(`setting bearer token to ${res.data.access_token}`)
                    console.log(`bearertoken variable: ${bearerToken}`)

                    Axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`
                    return Axios(originalRequest)
                }
            })
        }
        return Promise.reject(error)
    })

// function getStuff() {
//     console.log("stuff got")
//     return Axios({
//         method: 'get',
//         url: "https://www.foaas.com/shit/the%20holy%20man"
//     })
//         .then(res => {
//             console.log(res.data);
//             return res.data.subtitle;
//         })
// }

function getTwitchProfilePicture(userId) {
    console.log(userId);
    return Axios({
        url: `${getProfileUrl}${userId}`,
        method: 'GET',
    })
        .then(res => {
            console.log(res)
        })
        .catch(er => console.log(er))

}