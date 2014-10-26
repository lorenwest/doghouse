var fs=require('fs');
fs.readFile('/a/b/c', function(err) {
    console.error(err);
});
