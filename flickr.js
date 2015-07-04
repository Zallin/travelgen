var config = require('./config.json');

exports.Query = function (name){
    this.text = name;
    this.sort = 'interestingness-desc';
    this.tags = config.searchTags;
    this.content_type = 1;
    this.safe_search = 1;
    this.per_page = 6;
    this.page = 1;
}
