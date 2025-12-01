
let manages = [];
let editingManage = null;

document.addEventListener('DOMContentLoaded', function() {
    // document.querySelector('.header__navbar-item-link-manage').onclick = function () {
        // document.querySelector('.grid-app').style.display = 'none';
        fetch('http://localhost:3000/hoa-don')
            .then(response => response.json())
            .then(data => {
                manages = data.map(manage => ({
                    idhd: manage.IDHoaDon,
                    date: manage.ThoiDiemLap,
                    idnv: manage.IDNV,
                    tongtien: manage.TongTien,
                }));
                paginateManage(manages, 1, 8);


            document.getElementById("btn-search").onclick = function () {
                const idnv = document.getElementById("search-idnv").value.trim();
                const startDate = document.getElementById("startDate").value;
                const endDate = document.getElementById("endDate").value;
                const priceOrder = document.getElementById("search-price").value;
                
                // Gửi yêu cầu tìm kiếm tới backend
                const query = new URLSearchParams({
                    idnv,
                    startDate,
                    endDate,
                    priceOrder
                }).toString();
            
                fetch(`http://localhost:3000/hoa-don/search?${query}`)
                    .then(response => response.json())
                    .then(data => {
                        manages = data.map(manage => ({
                            idhd: manage.IDHoaDon,
                            date: manage.ThoiDiemLap,
                            idnv: manage.IDNV,
                            tongtien: manage.TongTien,
                        }));
                        paginateManage(manages, 1, 8);
                    })
                    .catch(error => console.error("Error searching data:", error));
            };



            })
            .catch(error => console.error("Error fetching data:", error));
    // };
});


function paginateManage(data, page = 1, recordsPerPage = 2) {
    const btn_next = document.querySelector("#btn_next-manage");
    const btn_prev = document.querySelector("#btn_prev-manage");
    const paginationPages = document.querySelector("#pagination-pages");
    const listing_table = document.querySelector(".menu-form__list-manage");

    // Xác định số lượng trang
    const totalPages = Math.ceil(data.length / recordsPerPage);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    listing_table.innerHTML = `
        <tr>
            <th>ID hóa đơn</th>
            <th>Thời điểm lập</th>
            <th>ID nhân viên</th>
            <th>Tổng tiền</th>
            <th></th>
        </tr>`;

    // document.querySelector('.menu-form__list-manage button').onclick = () => {
    //     openManageForm();
    // };

    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(manage => {
        const row = listing_table.insertRow(-1);
        row.insertCell(0).innerHTML = manage.idhd;
        row.insertCell(1).innerHTML = (new Date(manage.date)).toLocaleString('vi-VN', { hour12: false });
        row.insertCell(2).innerHTML = manage.idnv;
        row.insertCell(3).innerHTML = manage.tongtien;
        row.insertCell(4).innerHTML = `
            <div class="manager-app-modify">
                <button class="btn manage-app-watch btn-active">Xem</button>
                <button class="btn manage-app-change btn-active">Sửa</button>
                <button class="btn manage-app-delete btn-active">Xóa</button>
            </div>`;


    });

    function userRoleBtn(btn) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === "Nhân viên") {
            btn.style.display = "none";

        } else if (userRole === "Quản lý") {
            btn.style.display = "inline-flex";
        }
    }

// --------------------------------------------------------------------------------------------------------
// Xem



document.querySelectorAll('.manage-app-watch').forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const row = event.target.closest('tr');
        const idhd = row.cells[0].innerText;

        try {
            const response = await fetch(`http://localhost:3000/hoa-don-co-do-uong/${idhd}`);
            const drinks = await response.json();

            console.log(drinks)
            document.querySelector('.auth-form__body_id-value').innerHTML = drinks[0].IDHoaDon;
            document.querySelector('.auth-form__body_time-value').innerHTML =  drinks[0].ThoiDiemLap;
            document.querySelector('.auth-form__body_name-value').innerHTML = (drinks[0].HoTen +  " - " + drinks[0].IDNV)
        
            
            var bill__list_drink = document.querySelector('.bill__list-drink');
            // Xóa các dòng cũ nếu đã có để không trùng lặp khi render lại
            bill__list_drink.innerHTML = '';
        
            bill__list_drink.innerHTML = `
                    <tr>
                    <th>ID đồ uống</th>
                    <th>Tên đồ uống</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                </tr>`
            drinks.forEach(drink => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${drink.IDDoUong}</td>
                    <td>${drink.TenDoUong}</td>
                    <td>${drink.SoLuong}</td>
                    <td>${drink.Gia}đ</td>
                    <td>${drink.SoLuong * drink.Gia}đ</td>`;
                    bill__list_drink.appendChild(row);
            });

            document.querySelector('.bill__list-totalmoney').innerHTML = drinks[0].TongTien + 'đ';
        
        
            modal_bill.style.display = 'flex';

        } catch (err) {
            console.error("Error fetching bill details:", err);
            alert("Lỗi khi lấy chi tiết hóa đơn!");
        }
    });
});

// Hiển thị modal thanh toán
var modal_bill = document.querySelector('.modal-bill');



function hideBillModal() {
    modal_bill.style.display = 'none';
}

var modal_bill_container = document.querySelector('.modal-bill');
var modal_bill_body = document.querySelector('.modal-bill .modal__body');

modal_bill_container.addEventListener('click', hideBillModal);

modal_bill_body.addEventListener('click', function(event) {
    event.stopPropagation();
});


// --------------------------------------------------------------------------------------------------------
    // Gán sự kiện cho các nút "Sửa" và "Xóa"
    // document.querySelectorAll('.manage-app-watch').forEach((btn, index) => {
    //     btn.onclick = () => openManageForm(manages[start + index]);
    //     userRoleBtn(btn)
    // });
    // Gán sự kiện cho các nút "Sửa" và "Xóa"
    document.querySelectorAll('.manage-app-change').forEach((btn, index) => {
        btn.onclick = () => openManageForm(manages[start + index]);
        userRoleBtn(btn)
    });

    document.querySelectorAll('.manage-app-delete').forEach((btn, index) => {
        btn.onclick = () => deleteManage(manages[start + index].idhd);
        userRoleBtn(btn)
    });

    

// --------------------------------------------------------------------------------------------------------

    // Hiển thị phân trang (rút gọn nếu > 20 trang)
    paginationPages.innerHTML = "";
    if (totalPages <= 20) {
        // Hiển thị tất cả các trang nếu tổng số trang <= 20
        for (let i = 1; i <= totalPages; i++) {
            appendPageButton(paginationPages, i, page, data, recordsPerPage);
        }
    } else {
        // Hiển thị rút gọn nếu tổng số trang > 20
        appendPageButton(paginationPages, 1, page, data, recordsPerPage); // Trang đầu
        appendPageButton(paginationPages, 2, page, data, recordsPerPage); // Trang thứ 2

        if (page > 4) {
            const ellipsis = document.createElement("span");
            ellipsis.innerText = "...";
            paginationPages.appendChild(ellipsis);
        }

        // Hiển thị các trang xung quanh trang hiện tại
        for (let i = Math.max(3, page - 2); i <= Math.min(totalPages - 2, page + 2); i++) {
            appendPageButton(paginationPages, i, page, data, recordsPerPage);
        }

        if (page < totalPages - 3) {
            const ellipsis = document.createElement("span");
            ellipsis.innerText = "...";
            paginationPages.appendChild(ellipsis);
        }

        appendPageButton(paginationPages, totalPages - 1, page, data, recordsPerPage); // Trang kế cuối
        appendPageButton(paginationPages, totalPages, page, data, recordsPerPage);   // Trang cuối
    }

    // Kiểm tra hiển thị các nút "prev" và "next"
    btn_prev.style.visibility = page === 1 ? "hidden" : "visible";
    btn_next.style.visibility = page === totalPages ? "hidden" : "visible";

    btn_prev.onclick = () => paginateManage(data, page - 1, recordsPerPage);
    btn_next.onclick = () => paginateManage(data, page + 1, recordsPerPage);
}

// Hàm tiện ích thêm nút trang
function appendPageButton(container, pageNum, currentPage, data, recordsPerPage) {
    const pageBtn = document.createElement("li");
    pageBtn.className = `pagination-item ${pageNum === currentPage ? 'pagination-item--active' : ''}`;
    pageBtn.innerHTML = `<a class="pagination-item__link page" href="javascript:void(0)">${pageNum}</a>`;
    pageBtn.onclick = () => paginateManage(data, pageNum, recordsPerPage);
    container.appendChild(pageBtn);
}
// -----------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------

// function openManageForm(manage = null) {
//     editingManage = manage;
//     document.getElementById('form-title').innerText = manage ? "Sửa Nhân Viên" : "Thêm Nhân Viên";
//     document.getElementById('manage-form').style.display = 'block';

//     document.getElementById('manage-id').value = manage ? manage.id : '';
//     document.getElementById('manage-name').value = manage ? manage.name : '';
//     document.getElementById('manage-birthday').value = manage ? manage.birthday : '';
//     document.getElementById('manage-title').value = manage ? manage.title : '';
//     document.getElementById('manage-address').value = manage ? manage.address : '';
//     document.getElementById('manage-phonenumber').value = manage ? manage.phonenumber : '';
// }

// document.addEventListener('DOMContentLoaded', function() {

//     document.getElementById('save-manage-btn').onclick = function() {
//         const manageData = {
//             id: document.getElementById('manage-id').value,
//             name: document.getElementById('manage-name').value,
//             birthday: document.getElementById('manage-birthday').value,
//             title: document.getElementById('manage-title').value,
//             address: document.getElementById('manage-address').value,
//             phonenumber: document.getElementById('manage-phonenumber').value,
//         };
    
//         console.log("Data to send:", manageData);  // Kiểm tra dữ liệu truyền lên
    
//         if (editingManage) {
//             fetch(`http://localhost:3000/hoa-don/${editingManage.id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(manageData)
//             })
//             .then(response => {
//                 if (response.ok) {
//                     location.reload();
//                 } else {
//                     console.error("Update failed:", response);
//                 }
//             })
//             .catch(error => console.error("Error updating manage:", error));
//         } else {
//             fetch('http://localhost:3000/hoa-don', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(manageData)
//             })
//             .then(() => location.reload());
//         }
//     };
    

//     // Đảm bảo sự kiện nút "Hủy" cũng đóng form
//     document.getElementById('cancel-btn').onclick = function() {
//         document.getElementById('manage-form').style.display = 'none';
//     };
// });

// function deleteManage(id) {
//     if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
//         fetch(`http://localhost:3000/hoa-don/${id}`, {
//             method: 'DELETE'
//         })
//         .then(response => {
//             if (response.ok) {
//                 alert("Nhân viên đã được xóa thành công.");
//                 location.reload(); // Tải lại trang để cập nhật danh sách nhân viên
//             } else {
//                 alert("Lỗi xóa nhân viên.");
//             }
//         })
//         .catch(error => console.error("Error deleting manage:", error));
//     }
// }
