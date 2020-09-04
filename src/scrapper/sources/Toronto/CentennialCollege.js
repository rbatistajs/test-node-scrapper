const ScrapperSource = require('../base')

module.exports = class CentennialCollegeSource extends ScrapperSource {
    
    async run() {

        console.log('CentennialCollege Scrape =>', 'Start')

        await super.run(
            'https://www.centennialcollege.ca/admissions/tuition-and-fees/tuition-information/'
        )

        const values = await this.page.evaluate(this.evaluate)

        console.log('CentennialCollege Scrape =>', 'Finish', values.length)

        await this.stop()

        return {
            city: 'Toronto',
            values
        }
    }

    evaluate() {

        const label = "international tuition fee"
        const courses = document.querySelectorAll('.subpage_main.subpage_custom > h2')

        return Array.from(courses)
            .slice(2)
            .map((el) => {
                let amount = null
                let current = el

                while(current.nextElementSibling != null) {
                    current = current.nextElementSibling   
                    
                    // break if found other course title
                    if (current.tagName === 'H2') break

                    if (
                        current.tagName === 'H3' && 
                        current.textContent.toLowerCase().trim() === label
                    ) {                     
                        amount = current
                            .nextElementSibling
                            .querySelector('.tbl-row-cont > .tbl-row:nth-child(1) > .data')
                            .textContent
                        break                        
                    }
                } 

                if (!amount) return null
                
                return {
                    name: 'Centennial College',
                    course: el.textContent,
                    amount
                }
            })
            .filter(o=>!!o)        
    }
}