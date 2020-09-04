const Scrapper = require('./core/Scrapper')

class TuitionScrapper extends Scrapper {
    
    constructor() {
        super()

        this.promise = null
        
        this.addSources([
            require('./sources/Toronto/CentennialCollege'),
            require('./sources/Toronto/FanshaweCollege'),
            require('./sources/Vancouver/CapilanoUniversity'),
            require('./sources/Vancouver/DouglasCollege')
        ])
    }

    getData() {

        const run = async () => {
            const data = await super.getData()
            const cities = {}

            data.map((item) => {
                if (!cities[item.city]) cities[item.city] = []
                cities[item.city] = [...cities[item.city], ...item.values]
            })

            return { 
                cities: Object.keys(cities).map((name) => ({
                    name,
                    values: cities[name] 
                }))
            }
        }

        if (!this.promise) this.promise = run()

        return this.promise
    }
}


exports.tuitionScrapper = new TuitionScrapper()