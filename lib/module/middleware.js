module.exports = function(schema) {
    
    /* PogChamp Initalized PogChamp */
    schema.pre('init', function(init) {
        console.log('pre init');
        this.start = Date.now();
        init();
    });

    schema.post('init', function() {
        console.log('post init');
        console.log('init() took ' + (Date.now() - this.start) + ' ms.');
    });
    
    /* PogChamp Validated PogChamp */
    schema.pre('validate', function(next) { // first
        console.log('pre validate');
        this.start = Date.now();
        next();
    });

    schema.post('validate', function(result) { // second
        console.log('post validate');
        console.log('validate() took ' + (Date.now() - this.start) + ' ms.');
    });

    /* PogChamp SAVED PogChamp */
    schema.pre('save', function(next) { // third
        console.log('pre save');
        this.start = Date.now();
        next();
    });

    schema.post('save', function() { // fourth
        console.log('post save');
        console.log('save() took ' + (Date.now() - this.start) + ' ms.');
    });

    /* PogChamp REMOVED PogChamp */
    schema.pre('remove', function(next) {
        console.log('pre remove');
        this.start = Date.now();
        next();
    });

    schema.post('remove', function() {
        console.log('post remove');
        console.log('remove() took ' + (Date.now() - this.start) + ' ms.');
    });
}