const express = require('express')
const cors = require('cors')
const sequelize = require('./DB.js')
const app = express()
const multer = require('multer')
const PinCode = require('./models/PinCode.js');
const { Op } = require("sequelize");
require('dotenv').config()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

app.use(cors())

async function initialize() {
    try {
        console.log('Inside Initialize');
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        await sequelize.sync({ force: false,alter:false });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

initialize();

app.get('/searchPincode', async (req, res) => {
    try {

        // const fuseOptionsPinCode = {
        //     keys: ["pincode"],
        // };
        // const allpincode = await PinCode.findOne({ where: { id: 1 } });
        // if (allpincode) {
        //     res.status(200).json({ pinCode: allpincode }); // Use pincode instead of pinCode
        // } else {
        //     res.status(400).json({ message: "Not found" });
        // }
        // const fusePinCode = new Fuse(pinCode, fuseOptionsPinCode);
        const pincode = req.query.pincode;

        const { count, rows } = await PinCode.findAndCountAll({
            where: {
                pincode: {
                    [Op.like]: `%${pincode}%`
                }
            },
            offset: Number(req.query?.skip || 0),
            limit: Number(req.query?.take || 10)
        })

        // const pinCodeResult = await fusePinCode.search(searchPattern);

        // const results = pinCodeResult.slice(req.query?.skip || 0, (Number(req.query?.skip || 0)) + Number(req.query?.take || 10))
        // const pinCodesResult = await Promise.all(results.map(async (result) => {
        //     return result.item
        // }));

        // const responseData = pinCodesResult.slice(req.query?.skip || 0, (Number (req.query?.skip || 0)) + Number (req.query?.take || 10))
        res.status(200).json({ length: rows.length, message: "PinCode successfully found", pinCode: rows });

    } catch (err) {
        res.status(500).json({ length: 0, pinCode: [], message: `${err.message}` });
    }
})

app.get('/searchCity', async (req, res) => {
    try {

        // const fuseOptionsPinCode = {
        //     keys: ["area"],
        // };

        // const fusePinCode = new Fuse(pinCode, fuseOptionsPinCode);
        const query = req.query.city;
        // const pinCodeResult = await fusePinCode.search(searchPattern);
        const { count, rows } = await PinCode.findAndCountAll({
            where: {
                area: {
                    [Op.like]: `%${query}%`
                }
            },
            offset: Number(req.query?.skip || 0),
            limit: Number(req.query?.take || 10)
        })
        // const results = pinCodeResult.slice(req.query?.skip || 0, (Number(req.query?.skip || 0)) + Number(req.query?.take || 10))
        // const pinCodesResult = await Promise.all(results.map(async (result) => {
        //     return result.item
        // }));
        res.status(200).json({ length: rows.length, message: "PinCode found successfully", pinCode: rows });

    } catch (err) {
        res.status(500).json({ length: 0, pinCode: [], message: `${err.message}` });
    }
})

app.post('/addPinCode', upload.single('pinCodes'), async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const jsonString = req.file.buffer.toString('utf8');
        const jsonData = JSON.parse(jsonString);
        for (let data of jsonData) {
            await PinCode.create(data, {
                transaction: transaction
            })
        }
        await transaction.commit();
        res.status(200).json({ message: 'File uploaded and processed successfully.02' });
    } catch (err) {
        console.log(err.message)
        await transaction.rollback()
        res.status(500).json({
            message: err.message,
        })
    }
})
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:4000`);
})