const ScrapperSource = require('../base')

module.exports = class FanshaweCollegeSource extends ScrapperSource {
    
    async run() {

        console.log('FanshaweCollege Scrape =>', 'Start')

        await super.run(
            'https://www.fanshawec.ca/paying-college/tuition-fees/tuition-fees'
        )

        const values = await this.page.evaluate(this.evaluate)

        await this.stop()

        console.log('FanshaweCollege Scrape =>', 'Finish', values.length)

        return {
            city: 'Toronto',
            values
        }
    }

    evaluate() {

        const label = 'international students'

        const el = Array.from(
            document.querySelectorAll(
                '.layout > .layout__region > .block > .field > .highlight-box'
            )
        ).find(o=> o.querySelector('strong').textContent.toLowerCase().trim() === label)

        const amount = el.textContent.match(/(\$[0-9,]+(\.[0-9]{1,2})?)/gm)[0]
        
        return [
            {
                name: 'Fanshawe College',
                course: 'Fanshawe College - International',
                amount
            }
        ]        
    }
}