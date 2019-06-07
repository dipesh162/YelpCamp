var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
 text : String,
 author : {
			 	id  : {
			 		    type : mongoose.Schema.Types.ObjectId,
			 		    ref : "User" // ref is the file which we are referring
			 	       },
					 	username : String
          }
});


module.exports = mongoose.model("Comment", commentSchema);