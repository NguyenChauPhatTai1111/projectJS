const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép truy cập HTML, CSS, JS, JSON...
app.use(express.static(__dirname));


// ======================================
// TRANG CHỦ
// ======================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ======================================
// LOGIN
// ======================================

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});


// ======================================
// DETAIL
// ======================================

app.get("/detail", (req, res) => {
    res.sendFile(path.join(__dirname, "detail.html"));
});


// ======================================
// API USERS
// ======================================

app.get("/api/users", (req, res) => {
    const filePath = path.join(__dirname, "users.json");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "Không tìm thấy users.json"
        });
    }

    res.sendFile(filePath);
});


// ======================================
// API PRODUCTS
// ======================================

app.get("/api/products", (req, res) => {
    const filePath = path.join(__dirname, "product.json");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "Không tìm thấy product.json"
        });
    }

    res.sendFile(filePath);
});


// ======================================
// API COMMENTS
// ======================================

// Lấy comment theo product ID
app.get("/api/comments/:productId", (req, res) => {

    const productId = Number(req.params.productId);

    const filePath = path.join(__dirname, "comments.json");

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "Không tìm thấy comments.json"
        });
    }

    try {

        const comments = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        const productComments = comments.filter(
            comment => Number(comment.productId) === productId
        );

        res.json(productComments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Không thể đọc comments.json"
        });
    }
});


// ======================================
// API THÊM COMMENT
// ======================================

app.post("/api/comments", (req, res) => {

    const {
        productId,
        userId,
        username,
        rating,
        content
    } = req.body;

    // Kiểm tra dữ liệu
    if (!productId || !userId || !username || !content) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin."
        });
    }

    const filePath = path.join(__dirname, "comments.json");

    try {

        let comments = [];

        // Nếu comments.json tồn tại
        if (fs.existsSync(filePath)) {

            comments = JSON.parse(
                fs.readFileSync(filePath, "utf8")
            );

        }

        // Tạo ID mới
        const newId =
            comments.length > 0
                ? Math.max(...comments.map(comment => comment.id)) + 1
                : 1;

        const newComment = {

            id: newId,

            productId: Number(productId),

            userId: Number(userId),

            username: username,

            rating: Number(rating) || 5,

            content: content,

            createdAt: new Date().toISOString()
        };

        // Thêm comment
        comments.push(newComment);

        // Ghi lại comments.json
        fs.writeFileSync(
            filePath,
            JSON.stringify(comments, null, 4),
            "utf8"
        );

        res.status(201).json({

            message: "Bình luận thành công!",

            comment: newComment

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Không thể lưu bình luận."
        });
    }
});


// ======================================
// 404
// ======================================

// PHẢI ĐỂ CUỐI CÙNG
app.use((req, res) => {

    res.status(404).send(`
        <h1>404 - Không tìm thấy trang</h1>

        <p>URL không tồn tại:</p>

        <p>${req.url}</p>

        <a href="/">Về trang chủ</a>
    `);

});


// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 SERVER ĐANG CHẠY");
    console.log("========================================");

    console.log("");
    console.log(`Trang chủ: http://localhost:${PORT}`);
    console.log(`Login:     http://localhost:${PORT}/login`);
    console.log(`Detail:    http://localhost:${PORT}/detail`);

    console.log("");
    console.log("API:");
    console.log(`Products:  http://localhost:${PORT}/api/products`);
    console.log(`Users:     http://localhost:${PORT}/api/users`);
    console.log(`Comments:  http://localhost:${PORT}/api/comments/1`);

    console.log("");
    console.log("========================================");
});