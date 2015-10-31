function getDateFormatted(unix_date){
	var t = new Date(unix_date*1000);
	var formatted = (t.getDate()+1) + '/' + (t.getMonth()+1) + '/' + t.getFullYear();
	return formatted;
}
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '-';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}
var Torrent = Backbone.Model.extend({});

var TorrentsCollection = Backbone.Collection.extend({
  url: '/testData/torrents.json',
  model: Torrent
});
var views = {};


views.TorrentItem  = Backbone.View.extend({
	tagName: 'div',
	className: 'col-md-4',
	template: _.template($('#torrentTemplate').html()),
	initialize: function(options){
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},
	render: function(){
		var that = this;
    	this._rendered = true;
		var htmlOutput = this.template(this.model.toJSON());
		jQuery(this.el).append(htmlOutput);
		return this;
	}
});

views.Torrents = Backbone.View.extend({
	el: '#torrentContainer',
	collection: null,

	initialize: function(options){
		this.collection = options.collection;
		_.bindAll(this, 'render');
		this.collection.bind('reset', this.render);
    	this.collection.bind('add', this.render);
    	this.collection.bind('remove', this.render);

	},
	render: function(){
		var element = jQuery(this.el);
		element.empty();
		this.collection.forEach(function(item){
			var torrentView = new views.TorrentItem({
				model: item
			});
			element.append(torrentView.render().el);
		});
		return this;
	}
});

var torrents;
var torrentsCollection = new TorrentsCollection;
var view = new views.Torrents({
    collection: torrentsCollection
});
view.render();
torrentsCollection.fetch({
	success: function(data){
		console.log(data.models[0]);
	}
})
setInterval(function(){
	torrentsCollection.fetch();
	console.log('updated')
}, 10000)