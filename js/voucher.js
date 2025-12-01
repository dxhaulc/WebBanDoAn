
let manages = [];
let editingManage = null;

document.addEventListener('DOMContentLoaded', function() {
    // document.querySelector('.header__navbar-item-link-manage').onclick = function () {
        // document.querySelector('.grid-app').style.display = 'none';
        fetch('http://localhost:3000/voucher')
            .then(response => response.json())
            .then(data => {
                manages = data.map(manage => ({
                    id: manage.IDVoucher,
                    name: manage.Ten,
                    start: manage.NgayBatDau,
                    end: manage.NgayKetThuc,
                    content: manage.NoiDung
                }));
                paginateManage(manages, 1, 8);

                document.getElementById("btn-search").onclick = function () {
                    const name = document.getElementById("search-name").value.trim();
                    const startDate = document.getElementById("startDate").value;
                    const endDate = document.getElementById("endDate").value;
                  
                    // Gửi yêu cầu tìm kiếm tới backend
                    const query = new URLSearchParams({
                        name,
                        startDate,
                        endDate,
                    }).toString();
                
                    fetch(`http://localhost:3000/voucher/search?${query}`)
                        .then(response => response.json())
                        .then(data => {
                            manages = data.map(manage => ({
                                id: manage.IDVoucher,
                                name: manage.Ten,
                                start: manage.NgayBatDau,
                                end: manage.NgayKetThuc,
                                content: manage.NoiDung
                            }));
                            paginateManage(manages, 1, 8); // Render dữ liệu sau tìm kiếm
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
            <th>Mã voucher</th>
            <th>Tên voucher</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Nội dung</th>
            <th><button>Thêm voucher</button></th>
        </tr>`;

    document.querySelector('.menu-form__list-manage button').onclick = () => {
        openManageForm();
    };

    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(manage => {
        const row = listing_table.insertRow(-1);
        row.insertCell(0).innerHTML = manage.id;
        row.insertCell(1).innerHTML = manage.name;
        row.insertCell(2).innerHTML = new Date(manage.start).toISOString().split("T")[0];
        row.insertCell(3).innerHTML = new Date(manage.end).toISOString().split("T")[0];
        row.insertCell(4).innerHTML = manage.content;
        row.insertCell(5).innerHTML = `
            <div class="manager-app-modify">
                <button class="btn manage-app-change btn-active">Sửa</button>
                <button class="btn manage-app-delete btn-active">Xóa</button>
            </div>`;
    });

    function userRoleBtn(btn) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === "Nhân viên") {
            // btn.disabled = true;
            // btn.style.backgroundColor = "gray";
            // btn.style.cursor = "default";
            btn.style.display = "none";
        } else if (userRole === "Quản lý") {
            // btn.disabled = false;
            btn.style.display = "inline-flex";
        }
    }
    userRoleBtn(document.querySelector('.menu-form__list-manage button'));

    // Gán sự kiện cho các nút "Sửa" và "Xóa"
    document.querySelectorAll('.manage-app-change').forEach((btn, index) => {
        btn.onclick = () => openManageForm(manages[start + index]);
        userRoleBtn(btn)
    });

    document.querySelectorAll('.manage-app-delete').forEach((btn, index) => {
        btn.onclick = () => deleteManage(manages[start + index].id);
        userRoleBtn(btn)
    });

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
function openManageForm(manage = null) {
    editingManage = manage;
    document.getElementById('form-title').innerText = manage ? "Sửa Voucher" : "Thêm Voucher";
    document.getElementById('manage-form').style.display = 'block';

    document.getElementById('manage-id').value = manage ? manage.id : '';
    document.getElementById('manage-name').value = manage ? manage.name : '';
    document.getElementById('manage-start').value = manage ? manage.start : '';
    document.getElementById('manage-end').value = manage ? manage.end : '';
    document.getElementById('manage-content').value = manage ? manage.content : '';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save-manage-btn').onclick = function() {
        const manageData = {
            id: document.getElementById('manage-id').value,
            name: document.getElementById('manage-name').value,
            start: document.getElementById('manage-start').value,
            end: document.getElementById('manage-end').value,
            content: document.getElementById('manage-content').value,
        };

        if (editingManage) {
            fetch(`http://localhost:3000/voucher/${editingManage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(manageData)
            }).then(() => location.reload());
        } else {
            fetch('http://localhost:3000/voucher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(manageData)
            }).then(() => location.reload());
        }
    };

    // Đảm bảo sự kiện nút "Hủy" cũng đóng form
    document.getElementById('cancel-btn').onclick = function() {
        document.getElementById('manage-form').style.display = 'none';
    };
});

function deleteManage(id) {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
        fetch(`http://localhost:3000/voucher/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Voucher đã được xóa thành công.");
                location.reload(); // Tải lại trang để cập nhật danh sách nhân viên
            } else {
                alert("Lỗi xóa voucher.");
            }
        })
        .catch(error => console.error("Error deleting manage:", error));
    }
}
