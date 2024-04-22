const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
      const doc = await order.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
};

exports.deleteOrder = async (req, res) => {
  const {id} = req.params;
  try {
    const order = await Order.findByIdAndDelete(id,  {
        returnDocument : "before",
      });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {

    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        returnDocument : "after"
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
};


exports.fetchAllOrders = async(req, res) => {
   // sort = {_sort : "price"}
   // pagination = {_page : 4 , _per_page : 15} // _page=4&_per_page=15

    let query = Order.find({deleted : {$ne : true}});
    let totalOrdersQuery  = Order.find({deleted : {$ne : true}});

      if(req.query._sort){
        console.log(req.query._sort);
        query = query.sort( `${req.query._sort}`);
      }

      const totalDocs = await totalOrdersQuery.countDocuments();
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
