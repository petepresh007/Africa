//africa controllers
const AfricaModel = require("../model/africa");

async function getAllTask(req, res) {
    const page = await AfricaModel.find({ createdBy: req.users.userID });
    if (!page) {
        return res.status(404).json({ msg: "user not found" })
    }
    res.status(200).json({ msg: page })
}

async function getSingleTask(req, res) {
    const { users: { userID }, params: { id: pageID } } = req;
    const page = await AfricaModel.find({
        _id: pageID, createdBy: userID,
    })

    if (!page) {
        return res.status(404).json({ msg: "page not found" })
    }
    res.status(200).json({ msg: page })
}

async function createTask(req, res) {
    req.body.createdBy = req.users.userID;
    const page = await AfricaModel.create(req.body);
    res.status(201).json({ msg: page })
}

async function updateTask(req, res) {
    const { users: { userID }, params: { id: pageID } } = req;
    const page = await AfricaModel.findByIdAndUpdate({
        _id: pageID, createdBy: userID,
    }, req.body,);

    if (!page) {
        return res.status(404).json({ msg: "page not found" })
    }
    res.status(200).json({ msg: page });
}

async function deleteTask(req, res) {
    const { users: { userID }, params: { id: pageID } } = req;
    const page = await AfricaModel.findByIdAndRemove({
        _id: pageID, createdBy: userID,
    })
    if (!page) {
        res.status(404).json({ msg: "page not found" })
    }
    res.status(200).json({ msg: `${pageID} deleted successfully...` })
}


//file upload
async function upload(req, res) {
    const uploadedFile = []
    const files = req.files;
    Object.keys(files).forEach(key => {
        const filePath = join(__dirname, "..", "upload", files[key].name);

        files[key].mv(filePath, (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: err.message })
            }
        })
    })
    uploadedFile.push(Object.keys(files).toString());
    res.status(200).json(uploadedFile);

}


module.exports = { getAllTask, getSingleTask, createTask, updateTask, deleteTask, upload }