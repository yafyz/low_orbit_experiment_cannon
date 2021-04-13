const axios = require('axios')

class Account {
    username = ""
    isValid = false
    xcsrf_token = ""
    cookie = ""
    authTicket = "no ticket"

    constructor(c) {
        this.cookie = c
    }

    async getInfo() {
        let res = await axios.request({
            url: "https://www.roblox.com/mobileapi/userinfo",
            headers: {"Cookie": ".ROBLOSECURITY="+this.cookie},
            maxRedirects: 0,
            validateStatus: ()=>true
        })
        if (res.status != 200) {
            console.log(`${res.statusCode} ${res.statusMessage}`)
            console.log("Invalid acc")
            this.isValid = false;
        } else {
            this.isValid = true
            this.username = res.data["UserName"]
        }
    }

    async #getAuthTicket() {
        let res = await axios.request({
            method: "POST",
            url: "https://auth.roblox.com/v1/authentication-ticket/",
            headers: {"Cookie": ".ROBLOSECURITY="+this.cookie,
                      "x-csrf-token": this.xcsrf_token,
                      "Referer": "https://www.roblox.com"},
            maxRedirects: 0,
            validateStatus: ()=>true
        })

        if (res.headers["x-csrf-token"] != undefined)
            this.xcsrf_token = res.headers["x-csrf-token"]
        if (res.headers["rbx-authentication-ticket"])
            this.authTicket = res.headers["rbx-authentication-ticket"]
        return res.status
    }

    async updateAuthTicket() {
        this.authTicket = "no ticket"
        let ret = await this.#getAuthTicket()
        if (ret == 403)
            await this.#getAuthTicket()
        else if (ret != 200)
            console.log(`auth ticket non 200 or 403 status code: ${ret}`)
    }
}

module.exports = Account