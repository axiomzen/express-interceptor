app.use(interceptRes(function(req,res){
  return {
    // when returning `true` we'll buffer this request
    initerceptPredicate: function(){

    },
    // ability to transform a chunk before it's cast to a string and buffered
    //   if this is used the cb(err,string) must be called
    // transformChunk: function(chunk, encoding, cb) {
    // },
    // here we can transform the body, it's a properly encoded String, 
    //   done(err,string) must be called with a body
    //   may omit secrets, erase words, append stuff, etc.
    send: function(body, done) {

    },
    // useful for caching, keeping cache, stats, etc.
    afterSend: function(body) {

    }
  };
}));