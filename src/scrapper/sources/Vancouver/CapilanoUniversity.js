const ScrapperSource = require('../base')

module.exports = class CapilanoUniversitySource extends ScrapperSource {
    
    async run() {

        console.log('CapilanoUniversity Scrape =>', 'Start')
        
        await super.run(
            'https://www.capilanou.ca/admissions/fees--finances/tuition--fees/tuition--fee-estimator/', true
        )

        const options = await this.page.evaluate(this.evaluateSelectCourses)
            
        const values = []

        for (let i = 0; i < options.length; i++) {
            const value = options[i].value
            const text = options[i].text

            console.log('CapilanoUniversity Load =>', text)

            await this.page.waitForSelector('form > .page-alert select[name="code"]')

            await this.page.select('form > .page-alert select[name="code"]', value)
            await this.page.select('form > .page-alert select[name="residency"]', 'International')
            await this.page.click('form > .page-alert #submit')
            
            await this.page.waitForNavigation()
            await this.page.waitForSelector(
                '.main-content > div > h3 + div > .responsive-table > table > tbody > tr:nth-child(2) > td:nth-child(2)'
            )

            values.push(
                await this.page.evaluate(this.evaluate)
            )
        }

        await this.stop()

        console.log('CapilanoUniversity Scrape =>', 'Finish', values.length)

        return {
            city: 'Vancouver',
            values
        }
    }

    evaluateSelectCourses() {
        return Array
            .from(document.querySelectorAll('form > .page-alert select[name="code"] option'))
            .map((el) => ({ value: el.value, text: el.text }))
            .filter(el=>el.value!='')
    }

    evaluate() {

        const select = document.querySelector('form > .page-alert select[name=code]')

        return {
            name: 'Capilano University',
            course: select.options[select.selectedIndex].text,
            amount: document.querySelector(
                '.main-content > div > h3 + div > .responsive-table > table > tbody > tr:nth-child(2) > td:nth-child(2)'
            ).textContent
        }
    }
}