const ScrapperSource = require('../base')

module.exports = class DouglasCollegeSource extends ScrapperSource {
    
    async run() {

        console.log('DouglasCollege Scrape =>', 'Start')

        await super.run(
            'https://www.douglascollege.ca/international-students/prospective-students/tuition-and-fees'
        )

        const values = await this.page.evaluate(this.evaluate)

        await this.stop()
        console.log('DouglasCollege Scrape =>', 'Finish', values.length)

        return {
            city: 'Toronto',
            values
        }
    }

    evaluate() {

        const el = document.querySelector(
            '#block-douglas-content > article .field > p:nth-child(3)'
        )

        const amount = el.textContent.match(/(\$[0-9,]+(\.[0-9]{1,2})?)/gm)[1]
        
        return [
            {
                name: 'Douglas College',
                course: 'Douglas College - International',
                amount
            }
        ]        
    }
}