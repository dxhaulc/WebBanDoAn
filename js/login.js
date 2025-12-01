// Thực hiện chức năng đăng nhập
var btnLogin = document.querySelector('#btn-login');
var username = document.querySelector('#input-username');
var password = document.querySelector('#input-password');

btnLogin.addEventListener('click', function() {
    const data = {
        TenDangNhap: username.value.trim(),
        MatKhau: password.value.trim()
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // hideLoginModal();
            alert(result.message); // Thông báo đăng nhập thành công
         
            if (result.role === "Quản lý") {
                // Thực hiện thao tác cho Quản lý, ví dụ:
                console.log("Đã đăng nhập với vai trò Quản lý");
                // window.location.href = '/trang-quan-ly';
            } else if (result.role === "Nhân viên") {
                // Thực hiện thao tác cho Nhân viên, ví dụ:
                console.log("Đã đăng nhập với vai trò Nhân viên");
                // window.location.href = '/trang-nhan-vien';
            }

            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(result.nhanVien));
            localStorage.setItem('userRole', result.role);
            window.location.href = '/index.html';

            // window.location.reload();
            // Hiển thị thông tin nhân viên nếu có
            if (result.nhanVien) {
                displayInfoAccount({
                    name: result.nhanVien.HoTen,
                    id: result.nhanVien.IDNV,
                    chucVu: result.nhanVien.ChucVu
                });
            } else {
                alert("Không tìm thấy thông tin nhân viên.");
            }
        } else {
            alert(result.message); // Hiển thị thông báo lỗi
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập.");
    });
});

//-----------------------------------------------------------------------------------------------------------------
// render ra thông tin khi đăng nhập thành công

var header__navbar_user = document.querySelector('.header__navbar-user');
function displayInfoAccount(account) {
    if (header__navbar_user) {
        header__navbar_user.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới
        hideLoginBtn();
        showInfoUser();

        header__navbar_user.innerHTML = `
            <img class="header__navbar-user-img" src="../assets/img/60111.jpg" alt="User Image">
            <span class="header__navbar-user-name">${account.name}</span>
            <span> _ </span>
            <span class="header__navbar-user-id">${account.id}</span>
            
            <ul class="header__navbar-user-menu">
                <li class="header__navbar-user-item">
                    <a href="#">Tài khoản của tôi</a>
                </li>
                <li class="header__navbar-user-item header__navbar-user-item--separate">
                    <a href="#" id="logout">Đăng xuất</a>
                </li>
            </ul>`;

        // Gán sự kiện click cho nút "Đăng xuất"
        document.querySelector('#logout').addEventListener('click', logout);
    } else {
        console.error("Element .header__navbar-user không tồn tại trong DOM");
    }
}

// Hàm logout
function logout(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    
    // Xóa thông tin trong localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userRole');

    // Xóa thông tin tài khoản, có thể cần thêm code để xóa session hoặc token nếu dùng
    showLoginBtn();
    hideInfoUser();
    
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = '/login.html';
}

// hide Login button
var header__user = document.querySelector('.header__user')
function hideLoginBtn() {
    header__user.style.display = 'none';
}

// show Login button
function showLoginBtn() {
    header__user.style.display = 'flex';
}

// hide user
function hideInfoUser() {
    header__navbar_user.style.display = 'none';
}

// show user
function showInfoUser() {
    header__navbar_user.style.display = 'flex';
}


document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    // let userRole = localStorage.getItem('userRole');
    const currentPath = window.location.pathname;

    // Nếu không có thông tin đăng nhập và không phải đang ở trang index.html
    if (!loggedInUser && currentPath !== '/login.html') {
        console.log("Chưa có người dùng nào đăng nhập. Chuyển hướng về trang đăng nhập.");
        alert("Bạn phải đăng nhập để thực hiện chức năng này")
        window.location.href = '/login.html'; // Chuyển hướng về trang đăng nhập
    } else if (loggedInUser) {
        displayInfoAccount({
            name: loggedInUser.HoTen,
            id: loggedInUser.IDNV,
            chucVu: loggedInUser.ChucVu
        });

        console.log("Người dùng đã đăng nhập.");
    }
});

// phân quyên nhân viên và quản lý 
function userRoleBtn() {
    const employee_page = document.querySelector('.header__navbar-item-link[href="employee.html"]');
    const account_page = document.querySelector('.header__navbar-item-link[href="employeeaccount.html"]');
    const reportrevenue = document.querySelector('.header__navbar-item-link[href="reportrevenue.html"]');
    const chamcong_page = document.querySelector('.header__navbar-item-link[href="chamcong.html"]')



    const userRole = localStorage.getItem('userRole');
    if (userRole === "Nhân viên") {
        employee_page.style.display = "none";
        account_page.style.display = "none";
        reportrevenue.style.display = "none";
        chamcong_page.style.display = "inline-flex";
        

    } else if (userRole === "Quản lý") {
        chamcong_page.style.display = "none";
        employee_page.style.display = "inline-flex";
        account_page.style.display = "inline-flex";
        reportrevenue.style.display = "inline-flex";
    }
}
userRoleBtn()