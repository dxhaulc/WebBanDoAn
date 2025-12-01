
let manages = [];
let editingManage = null;

document.addEventListener('DOMContentLoaded', function() {

    fetch('http://localhost:3000/khach-hang')
        .then(response => response.json())
        .then(data => {
            manages = data.map(manage => ({
                name: manage.HoTen,
                sdt: manage.SDT,
                dtl: manage.DTL
            }));
            paginateManage(manages, 1, 8);

            document.getElementById("btn-search").onclick = function () {
                const name = document.getElementById("search-name").value.trim();
                const sdt = document.getElementById("search-sdt").value.trim();
                const dtlOrder = document.getElementById("search-dtl").value;
    
                // Gửi yêu cầu tìm kiếm tới backend
                const query = new URLSearchParams({
                    name,
                    sdt,
                    dtlOrder,
                }).toString();
            
        fetch(`http://localhost:3000/khach-hang/search?${query}`)
            .then(response => response.json())
            .then(data => {
                manages = data.map(manage => ({
                    name: manage.HoTen,
                    sdt: manage.SDT,
                    dtl: manage.DTL
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
            <th>Họ tên</th>
            <th>SDT</th>
            <th>Điểm tích lũy</th>
            <th><button>Thêm khách hàng</button></th>
        </tr>`;

    document.querySelector('.menu-form__list-manage button').onclick = () => {
        openManageForm();
    };

    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(manage => {
        const row = listing_table.insertRow(-1);
        row.insertCell(0).innerHTML = manage.name;
        row.insertCell(1).innerHTML = manage.sdt;
        row.insertCell(2).innerHTML = manage.dtl;
        row.insertCell(3).innerHTML = `
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
        btn.onclick = () => deleteManage(manages[start + index].sdt);
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
    document.getElementById('form-title').innerText = manage ? "Sửa Khách Hàng" : "Thêm Khách Hàng";
    document.getElementById('manage-form').style.display = 'block';

    document.getElementById('manage-name').value = manage ? manage.name : '';
    document.getElementById('manage-sdt').value = manage ? manage.sdt : '';
    document.getElementById('manage-dtl').value = manage ? manage.dtl : '';

}

document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('save-manage-btn').onclick = function() {
        const manageData = {
            name: document.getElementById('manage-name').value,
            sdt: document.getElementById('manage-sdt').value,
            dtl: document.getElementById('manage-dtl').value,
        };

        if (editingManage) {
            fetch(`http://localhost:3000/khach-hang/${editingManage.sdt}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(manageData)
            }).then(() => location.reload());
        } else {
            fetch('http://localhost:3000/khach-hang', {
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

function deleteManage(sdt) {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        fetch(`http://localhost:3000/khach-hang/${sdt}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Khách hàng đã được xóa thành công.");
                location.reload(); // Tải lại trang để cập nhật danh sách khách hàng
            } else {
                alert("Lỗi xóa khách hàng.");
            }
        })
        .catch(error => console.error("Error deleting manage:", error));
    }
}
