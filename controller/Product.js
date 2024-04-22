const { Product } = require("../model/product");


exports.createProduct = async(req, res) => {
    // this product we have to get from API body
    const product = new Product(req.body);
    try{
        const doc = await product.save();
        res.status(201).json(doc);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.fetchAllProducts = async(req, res) => {
    // here we need all query string

    // filter = {"category" :["smartphones"]}
   // sort = {_sort : "price"}
   // pagination = {_page : 4 , _per_page : 15} // _page=4&_per_page=15
   // we have to try multiple categories and brands after change in front-end
   let condition = {};
   if(!req.query.admin){
      condition.deleted = {$ne : true} ;
   }

    let query = Product.find(condition);
    let totalProductsQuery  = Product.find(condition);

      if(req.query.category){
          query = query.find({ category : req.query.category });
          totalProductsQuery = totalProductsQuery.find({ category : req.query.category });
      }

      if(req.query.brand){
         query = query.find({ brand : req.query.brand });
         totalProductsQuery = totalProductsQuery.find({ brand : req.query.brand });;
      }

      // TODO : how to get sort on discounted price.....
      if(req.query._sort){
        query = query.sort( `${req.query._sort}`);
      }

      const totalDocs = await totalProductsQuery.countDocuments();
      console.log({totalDocs});

      if(req.query._page && req.query._per_page){
        const pageSize = req.query._per_page;
        const page = req.query._page;
        query = query.skip(pageSize * (page -1)).limit(pageSize);
     }

    try{
        const docs = await query;
       // console.log(docs);
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.fetchProductById = async(req, res) => {
    const {id} = req.params;

    try{
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.updateProduct = async(req, res) => {
    const {id} = req.params;

    try{
        const product = await Product.findByIdAndUpdate(id, req.body, { returnDocument : "after"});
        res.status(200).json(product);
    }
    catch(err){
        res.status(400).json(err);
    }
}