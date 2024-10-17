const ProductsModel = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await ProductsModel.find({ price: { $gt: 10, $lt: 100 } }).sort('price').select("name price company")
    res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    // filtering of results based no numeric properties of products data
    if (numericFilters) {
        const operatorsMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        }
        const regEx = /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorsMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [fieldId,operator,value,operator2,value2] = item.split('-');
            if (options.includes(fieldId)){
                queryObject[fieldId] = {[operator]: Number(value)}
            }
        });
    }

    let result = ProductsModel.find(queryObject)
    // sorting
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt') // default sorting for result
    }

    // select fields
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1;
    const dataLimit = Number(req.query.limit) || 10;
    const skipItems = (page - 1) * dataLimit;

    result = result.skip(skipItems).limit(dataLimit)

    const products = await result;
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}