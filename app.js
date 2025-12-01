const express = require('express');
const sql = require('mssql');
const path = require('path');
const bodyParser = require('body-parser'); // Thêm body-parser để lấy dữ liệu từ request body
const app = express();
const PORT = 3000;

// Cấu hình body-parser để đọc dữ liệu JSON từ client
app.use(bodyParser.json());

// Cấu hình kết nối SQL Server
const dbConfig = {
    user: 'sa', // tài khoản SQL Server
    password: '123456', // mật khẩu của tài khoản
    server: '127.0.0.1', // tên server của bạn
    database: 'QuanlyCuaHangBanDoUong', // tên database bạn muốn kết nối
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Kết nối với SQL Server
sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log("Connected to SQL Server");
    }
}).catch(err => console.error("Database connection failed: ", err));

// Sử dụng middleware express.static để phục vụ file tĩnh từ các thư mục
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ index.html
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Phục vụ assets, bao gồm css và img
  
// Định nghĩa các endpoint cho từng bảng
app.get('/ca-lam-viec', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM CaLamViec`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying CaLamViec: ", err);
        res.status(500).send("Error querying CaLamViec");
    }
});

app.get('/cham-cong', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM ChamCong`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying ChamCong: ", err);
        res.status(500).send("Error querying ChamCong");
    }
});
// -----------------------------------------------------------------------------------------------------------------
// Nhân viên
app.get('/nhan-vien', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM NhanVien`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying NhanVien: ", err);
        res.status(500).send("Error querying NhanVien");
    }
});

app.post('/nhan-vien', async (req, res) => {
    const { id, name, birthday, title, salary, phonenumber, account_name } = req.body;
    try {
        await sql.query`INSERT INTO NhanVien (IDNV, HoTen, NgaySinh, ChucVu, Luong, SDT, TaiKhoanNV) 
                        VALUES (${id}, ${name}, ${birthday}, ${title}, ${salary}, ${phonenumber}, ${account_name})`;
        res.status(201).send("Thêm nhân viên thành công");
    } catch (err) {
        console.error("Error adding employee: ", err);
        res.status(500).send("Error adding employee");
    }
});

app.put('/nhan-vien/:id', async (req, res) => {
    const { id } = req.params;
    const { name, birthday, title, salary, phonenumber, account_name } = req.body;
    try {
        await sql.query`UPDATE NhanVien SET HoTen = ${name}, NgaySinh = ${birthday}, ChucVu = ${title}, Luong = ${salary}, SDT = ${phonenumber}, TaiKhoanNV = ${account_name} WHERE IDNV = ${id}`;
        res.send("Cập nhật nhân viên thành công");
    } catch (err) {
        console.error("Error updating employee: ", err);
        res.status(500).send("Error updating employee");
    }
});

// Xóa
app.delete('/nhan-vien/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM NhanVien WHERE IDNV = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.status(200).send("Xóa nhân viên thành công");
        } else {
            res.status(404).send("Không tìm thấy nhân viên để xóa");
        }
    } catch (err) {
        console.error("Error deleting NhanVien:", err);
        res.status(500).send("Lỗi xóa nhân viên");
    }
});

app.get('/nhan-vien/search', async (req, res) => {
    const { id, name, title, salary, phone, account_name } = req.query;

    try {
        let query = `SELECT * FROM NhanVien WHERE 1=1`;

        // Search by IDNV
        if (id) {
            query += ` AND IDNV LIKE N'%${id}%'`;
        }

        // Search by HoTen
        if (name) {
            query += ` AND HoTen LIKE N'%${name}%'`;
        }

        // Search by ChucVu
        if (title) {
            query += ` AND ChucVu LIKE N'%${title}%'`;
        }

        // Search by SDT
        if (phone) {
            query += ` AND SDT LIKE N'%${phone}%'`;
        }

        // Sort by Luong
        if (salary === 'asc') {
            query += ` ORDER BY Luong ASC`;
        } else if (salary === 'desc') {
            query += ` ORDER BY Luong DESC`;
        }

        if (account_name) {
            query += ` AND TaiKhoanNV LIKE N'%${account_name}%'`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching NhanVien:", err);
        res.status(500).send("Error searching NhanVien");
    }
});


// -----------------------------------------------------------------------------------------------------------------

app.get('/tai-khoan', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM TaiKhoan`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying TaiKhoan: ", err);
        res.status(500).send("Error querying TaiKhoan");
    }
});


app.post('/tai-khoan', async (req, res) => {
    const { account_name, password} = req.body;
    try {
        await sql.query`INSERT INTO TaiKhoan (TenDangNhap, MatKhau) 
                        VALUES (${account_name}, ${password})`;
        res.status(201).send("Thêm tài khoản thành công");
    } catch (err) {
        console.error("Error adding employee_account: ", err);
        res.status(500).send("Error adding employee_account");
    }
});

app.put('/tai-khoan/:account_name', async (req, res) => {
    const { account_name } = req.params;
    const { password } = req.body;
    try {
        await sql.query`UPDATE TaiKhoan SET MatKhau = ${password} WHERE TenDangNhap = ${account_name}`;
        res.send("Cập nhật tài khoản thành công");
    } catch (err) {
        console.error("Error updating employee_account: ", err);
        res.status(500).send("Error updating employee_account");
    }
});

// Xóa
app.delete('/tai-khoan/:account_name', async (req, res) => {
    const { account_name } = req.params;
    try {
        const result = await sql.query`DELETE FROM TaiKhoan WHERE TenDangNhap = ${account_name}`;
        if (result.rowsAffected[0] > 0) {
            res.status(200).send("Xóa tài khoản thành công");
        } else {
            res.status(404).send("Không tìm thấy tài khoản để xóa");
        }
    } catch (err) {
        console.error("Error deleting TaiKhoan:", err);
        res.status(500).send("Lỗi xóa tài khoản");
    }
});

app.get('/tai-khoan/search', async (req, res) => {
    const { account_name } = req.query;

    try {
        let query = `SELECT * FROM TaiKhoan WHERE 1=1`;

        // Search by IDNV
        if (account_name) {
            query += ` AND TenDangNhap LIKE N'%${account_name}%'`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching NhanVien:", err);
        res.status(500).send("Error searching NhanVien");
    }
});

// ------------------------------------------------------------------------------
app.post('/login', async (req, res) => {
    const { TenDangNhap, MatKhau } = req.body;
    try {
        // Kiểm tra tài khoản và mật khẩu trong bảng TaiKhoan, loại bỏ khoảng trắng
        const result = await sql.query`
            SELECT * FROM TaiKhoan
            WHERE LTRIM(RTRIM(TenDangNhap)) = ${TenDangNhap} AND LTRIM(RTRIM(MatKhau)) = ${MatKhau}`;

        if (result.recordset.length > 0) {
            // Đăng nhập thành công, tiếp tục truy vấn thông tin nhân viên
            const nhanVienResult = await sql.query`
                SELECT * FROM NhanVien
                WHERE LTRIM(RTRIM(TaiKhoanNV)) = ${TenDangNhap}`;

            // Nếu tìm thấy nhân viên, kiểm tra chức vụ
            if (nhanVienResult.recordset.length > 0) {
                const nhanVien = nhanVienResult.recordset[0];
                let message = "Đăng nhập thành công";
                let role;

                if (nhanVien.ChucVu.trim() === "Quản lý") {
                    // Nếu chức vụ là Quản lý
                    role = "Quản lý";
                    message += " - Chào mừng Quản lý!";
                    // Thực hiện các thao tác dành riêng cho Quản lý ở đây, ví dụ:
                    // res.redirect('/trang-quan-ly');
                } else if (nhanVien.ChucVu.trim() === "Nhân viên") {
                    // Nếu chức vụ là Nhân viên
                    role = "Nhân viên";
                    message += " - Chào mừng Nhân viên!";
                    // Thực hiện các thao tác dành riêng cho Nhân viên ở đây, ví dụ:
                    // res.redirect('/trang-nhan-vien');
                }

                res.json({
                    success: true,
                    message,
                    role,
                    nhanVien
                });
            } else {
                res.json({ success: true, message: "Đăng nhập thành công nhưng không tìm thấy thông tin nhân viên" });
            }
        } else {
            res.json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }
    } catch (err) {
        console.error("Error logging in: ", err);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi trong quá trình đăng nhập" });
    }
});

app.get('/chuc-nang', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM ChucNang`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying ChucNang: ", err);
        res.status(500).send("Error querying ChucNang");
    }
});

app.get('/tai-khoan-co-chuc-nang', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM TaiKhoanCoChucNang`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying TaiKhoanCoChucNang: ", err);
        res.status(500).send("Error querying TaiKhoanCoChucNang");
    }
});


// ========================================================================================================================

app.get('/khach-hang', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM KhachHang`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying KhachHang: ", err);
        res.status(500).send("Error querying KhachHang");
    }
});

app.post('/khach-hang', async (req, res) => {
    const { name, sdt, dtl} = req.body;
    try {
        await sql.query`INSERT INTO KhachHang (SDT, HoTen, DTL) 
                        VALUES (${sdt}, ${name}, ${dtl})`;
        res.status(201).send("Thêm khách hàng thành công");
    } catch (err) {
        console.error("Error adding khách hàng: ", err);
        res.status(500).send("Error adding khách hàng");
    }
});

app.put('/khach-hang/:sdt', async (req, res) => {
    const { sdt } = req.params;
    const { name, dtl} = req.body;
    try {
        await sql.query`UPDATE KhachHang SET HoTen = ${name}, DTL = ${dtl} WHERE SDT = ${sdt}`;
        res.send("Cập nhật khách hàng thành công");
    } catch (err) {
        console.error("Error updating khách hàng: ", err);
        res.status(500).send("Error updating khách hàng");
    }
});

app.delete('/khach-hang/:sdt', async (req, res) => {
    const { sdt } = req.params;
    try {
        const result = await sql.query`DELETE FROM KhachHang WHERE SDT = ${sdt}`;
        if (result.rowsAffected[0] > 0) {
            res.status(200).send("Xóa khách hàng thành công");
        } else {
            res.status(404).send("Không tìm thấy khách hàng để xóa");
        }
    } catch (err) {
        console.error("Error deleting KhachHang:", err);
        res.status(500).send("Lỗi xóa khách hàng");
    }
});

app.get('/khach-hang/search', async (req, res) => {
    const { name, sdt, dtlOrder } = req.query;

    try {
        let query = `SELECT * FROM KhachHang WHERE 1=1`;

        // Search by HoTen
        if (name) {
            query += ` AND HoTen LIKE N'%${name}%'`;
        }

        // Search by SDT
        if (sdt) {
            query += ` AND SDT LIKE N'%${sdt}%'`;
        }

        // Sort by DTL
        if (dtlOrder === 'asc') {
            query += ` ORDER BY DTL ASC`;
        } else if (dtlOrder === 'desc') {
            query += ` ORDER BY DTL DESC`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching KhachHang:", err);
        res.status(500).send("Error searching KhachHang");
    }
});


// ========================================================================================================================


app.get('/do-uong', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM DoUong`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying DoUong: ", err);
        res.status(500).send("Error querying DoUong");
    }
});

app.post('/do-uong', async (req, res) => {
    const { id, name, type, url, price} = req.body;
    try {
        await sql.query`INSERT INTO DoUong (IDDoUong, Ten, Loai, ImageURL, Gia) 
                        VALUES (${id}, ${name}, ${type}, ${url}, ${price})`;
        res.status(201).send("Thêm đô uống thành công");
    } catch (err) {
        console.error("Error adding đô uống: ", err);
        res.status(500).send("Error adding đô uống");
    }
});

app.put('/do-uong/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, url, price} = req.body;
    try {
        await sql.query`UPDATE DoUong SET Ten = ${name}, Loai = ${type}, ImageURL = ${url}, Gia = ${price} WHERE IDDoUong = ${id}`;
        res.send("Cập nhật đô uống thành công");
    } catch (err) {
        console.error("Error updating đô uống: ", err);
        res.status(500).send("Error updating đô uống");
    }
});

app.delete('/do-uong/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM DoUong WHERE IDDoUong = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.status(200).send("Xóa đô uống thành công");
        } else {
            res.status(404).send("Không tìm thấy đô uống để xóa");
        }
    } catch (err) {
        console.error("Error deleting DoUong:", err);
        res.status(500).send("Lỗi xóa đô uống");
    }
});


app.get('/do-uong/search', async (req, res) => {
    const { name, type, priceOrder } = req.query;

    try {
        let query = `SELECT * FROM DoUong WHERE 1=1`;

        // Tìm kiếm theo tên
        if (name) {
            query += ` AND Ten LIKE N'%${name}%'`;
        }

        // Lọc theo loại
        if (type) {
            query += ` AND Loai = N'${type}'`;
        }

        // Sắp xếp theo giá
        if (priceOrder === 'asc') {
            query += ` ORDER BY Gia ASC`;
        } else if (priceOrder === 'desc') {
            query += ` ORDER BY Gia DESC`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching drinks:", err);
        res.status(500).send("Error searching drinks");
    }
});





// ========================================================================================================================

app.get('/voucher', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Voucher`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying Voucher: ", err);
        res.status(500).send("Error querying Voucher");
    }
});

app.post('/voucher', async (req, res) => {
    const { id, name, start, end, content } = req.body;
    try {
        await sql.query`INSERT INTO Voucher (IDVoucher, Ten, NgayBatDau, NgayKetThuc, NoiDung) 
                        VALUES (${id}, ${name}, ${start}, ${end}, ${content})`;
        res.status(201).send("Thêm voucher thành công");
    } catch (err) {
        console.error("Error adding voucher: ", err);
        res.status(500).send("Error adding voucher");
    }
});

app.put('/voucher/:id', async (req, res) => {
    const { id } = req.params;
    const { name, start, end, content } = req.body;
    try {
        await sql.query`UPDATE Voucher SET Ten = ${name}, NgayBatDau = ${start}, NgayKetThuc = ${end}, NoiDung = ${content} WHERE IDVoucher = ${id}`;
        res.send("Cập nhật voucher thành công");
    } catch (err) {
        console.error("Error updating voucher: ", err);
        res.status(500).send("Error updating voucher");
    }
});

app.delete('/voucher/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM Voucher WHERE IDVoucher = ${id}`;
        if (result.rowsAffected[0] > 0) {
            res.status(200).send("Xóa voucher thành công");
        } else {
            res.status(404).send("Không tìm thấy voucher để xóa");
        }
    } catch (err) {
        console.error("Error deleting Voucher:", err);
        res.status(500).send("Lỗi xóa voucher");
    }
});

app.get('/voucher/search', async (req, res) => {
    const { name, startDate, endDate } = req.query;

    try {
        let query = `SELECT * FROM Voucher WHERE 1=1`;

        // Search by TenVoucher
        if (name) {
            query += ` AND Ten LIKE N'%${name}%'`;
        }

        // Search by start date
        if (startDate) {
            query += ` AND NgayBatDau >= '${startDate}'`;
        }

        // Search by end date
        if (endDate) {
            query += ` AND NgayKetThuc <= '${endDate}'`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching voucher:", err);
        res.status(500).send("Error searching voucher");
    }
});



// ========================================================================================================================

app.get('/hoa-don', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM HoaDon`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying HoaDon: ", err);
        res.status(500).send("Error querying HoaDon");
    }
});

app.get('/maxid-hoa-don', async (req, res) => {
    try {
        const result = await sql.query`SELECT MAX(IDHoaDon) AS GiaTriLonNhat FROM HoaDon`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying HoaDon: ", err);
        res.status(500).send("Error querying HoaDon")
    }
});

app.post('/hoa-don', async (req, res) => {
    const { idhd, date, idnv, tongtien} = req.body;
    try {
        await sql.query`INSERT INTO HoaDon (IDHoaDon, ThoiDiemLap, IDNV, TongTien)
                        VALUES (${idhd}, ${date}, ${idnv}, ${tongtien})`;
        res.status(201).send("Thêm hóa đơn thành công");
    } catch (err) {
        console.error("Error adding hóa đơn: ", err);
        res.status(500).send("Error adding hóa đơn");
    }
});

app.get('/hoa-don/search', async (req, res) => {
    const { idnv, startDate, endDate, priceOrder } = req.query;

    try {
        let query = `SELECT * FROM HoaDon WHERE 1=1`;

        // Search by IDNV
        if (idnv) { 
            query += ` AND IDNV LIKE N'%${idnv}%'`;
            
        }

        // Filter by ThoiDiemLap (time range)
        if (startDate && endDate) {
            query += ` AND ThoiDiemLap BETWEEN '${startDate}' AND '${endDate}'`;
        }

        // Sort by TongTien
        if (priceOrder === 'asc') {
            query += ` ORDER BY TongTien ASC`;
        } else if (priceOrder === 'desc') {
            query += ` ORDER BY TongTien DESC`;
        }

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error searching HoaDon:", err);
        res.status(500).send("Error searching HoaDon");
    }
});

// ========================================================================================================================
app.get('/hoa-don-co-do-uong', async (req, res) => {
    try {
        
        const result = await sql.query`SELECT * FROM HoaDonCoDoUong`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying HoaDonCoDoUong: ", err);
        res.status(500).send("Error querying HoaDonCoDoUong");
    }
});


app.get('/hoa-don-co-do-uong/:idhd', async (req, res) => {
    const { idhd } = req.params;
    try {
        const result = await sql.query`
            SELECT hd.IDHoaDon, du.IDDoUong, du.Ten AS TenDoUong, hdd.SoLuong, du.Gia, hd.ThoiDiemLap, nv.HoTen, nv.IDNV, hd.TongTien
            FROM HoaDonCoDoUong hdd
            JOIN DoUong du ON hdd.IDDoUong = du.IDDoUong
            JOIN HoaDon hd ON hdd.IDHoaDon = hd.IDHoaDon
			JOIN NhanVien nv on hd.IDNV = nv.IDNV
            WHERE hd.IDHoaDon = ${idhd}`;
        res.json(result.recordset);
    } catch (err) {
        console.error("Error querying HoaDonCoDoUong:", err);
        res.status(500).send("Error querying HoaDonCoDoUong");
    }
});


app.post('/hoa-don-co-do-uong', async (req, res) => {
    const { idhd, iddu, qnt } = req.body;
    try {
        await sql.query`INSERT INTO HoaDonCoDoUong (IDHoaDon, IDDoUong, SoLuong) 
                        VALUES (${idhd}, ${iddu}, ${qnt})`;
        res.status(201).send("Thêm đô uống vào hóa đơn thành công");
    } catch (err) {
        console.error("Error adding drink to menus: ", err);
        res.status(500).send("Error adding drink to menu");
    }
});

// ---------------------------------------------------------------------------------------------

// Thiết lập server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







