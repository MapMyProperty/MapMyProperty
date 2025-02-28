const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');


const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   desc: {
      type: String,
   },
   image: {
      type: String,
   },
   projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
   }],
   isAvailable: {
      type: Boolean,
      default: true
   },
   isImportant: {
      type: Boolean,
      default: false
   },
   
},
   {
      timestamps: true
   })
   categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', categorySchema)