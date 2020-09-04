const puppeteer = require('puppeteer')

module.exports = class ScrapperSource {

    async init() {
        
    }

    async run(url, debug) {
        
        const browser = await puppeteer.launch({ args: ['--disable-setuid-sandbox', '--no-sandbox'] })
        const page = await browser.newPage()

        if (debug) {
            page.on('console', async msg => {
                if (msg._type !== 'info') return;
                const args = await msg.args()
                args.forEach(async (arg) => {
                    const val = await arg.jsonValue()
                    // value is serializable
                    if (JSON.stringify(val) !== JSON.stringify({})) console.log(val)
                    // value is unserializable (or an empty oject)
                    else {
                        const { type, subtype, description } = arg._remoteObject
                        console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
                    }
                })
            })
        }        
        
        await page.goto(url, { waitUntil: 'networkidle0' })

        this.browser = browser
        this.page = page
    }

    async stop() {        
        await this.browser.close()
    }
}