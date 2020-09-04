
module.exports = class Scrapper {

    constructor() {
        this.sources = []
    }
    
    addSources(sources) {
        this.sources = sources.map(Source=>new Source)
    }

    async getData() {
        
        return Promise
            .all(this.sources.map(source=>{
                try {
                    return source.run()
                } catch(e) {
                    console.log(e)
                }
            }))
    }
}
