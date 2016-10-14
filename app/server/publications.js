Meteor.publish('files', function(file) {
    console.log('publish', file);
    if (this.userId) {
        return FilesCollection.find({});
    } else {
        return;
    }
});
