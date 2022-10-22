
module.exports = class BaseService{
 
async findAll(){

    return this.model.find()//
}

async add(item){
     return this.model.create(item) 
}

async del(itemId){
    return this.model.remove({_id: itemId}) //INFO:delete the item with the id, it's a query you can pass multiple values.
}

async saveModel(){
  return this.model.save()
}


  //default id is 1.
  async find(itemId = 1) {
    return  this.model.findById(itemId)
  }
 
}