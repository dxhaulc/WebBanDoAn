// Lấy các phần tử DOM
const chamCongVaoBtn = document.querySelector('#chamcongvao');
const chamCongRaBtn = document.querySelector('#chamcongra');

// Thông số phân trang
const recordsPerPage = 8;  // Số bản ghi mỗi trang
let currentPage = 1;  // Trang hiện tại

// Hàm định dạng thời gian
function getFormattedTime() {
    const now = new Date();
    return now.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

// Lưu thông tin chấm công vào Local Storage
function saveToLocalStorage(type, time) {
    const chamCongData = JSON.parse(localStorage.getItem('chamCongData')) || [];
    chamCongData.push({ type, time });
    localStorage.setItem('chamCongData', JSON.stringify(chamCongData));
}

// Lấy danh sách các bản ghi trong phạm vi trang hiện tại
function getPaginatedData() {
    const chamCongData = JSON.parse(localStorage.getItem('chamCongData')) || [];
    const startIndex = (currentPage - 1) * recordsPerPage;
    return chamCongData.slice(startIndex, startIndex + recordsPerPage);
}

// Tính tổng số trang
function getTotalPages() {
    const chamCongData = JSON.parse(localStorage.getItem('chamCongData')) || [];
    return Math.ceil(chamCongData.length / recordsPerPage);
}

// Hiển thị bảng chấm công
function renderChamCongTable() {
    const tableBody = document.querySelector('#chamcongTableBody');
    const chamCongData = getPaginatedData();
    tableBody.innerHTML = '';  // Xóa nội dung cũ
    chamCongData.forEach((record, index) => {
        const row = `
            <tr>
                <td>${(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td>${record.type}</td>
                <td>${record.time}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    renderPagination();
}
  


// Hiển thị phân trang

// Hiển thị phân trang
function renderPagination() {
    const paginationContainer = document.querySelector('#pagination');
    const totalPages = getTotalPages();
    
    let paginationHTML = '';
    
    // Thêm nút Previous nếu không phải trang đầu tiên
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">
            <i class="pagination-item__icon fas fa-angle-left"></i>
        </button>`;
    }
    
    // Hiển thị các nút trang xung quanh trang hiện tại
    const startPage = Math.max(1, currentPage - 1); // Trang bắt đầu sẽ là trang trước hoặc trang 1
    const endPage = Math.min(totalPages, currentPage + 1); // Trang kết thúc sẽ là trang sau hoặc trang cuối cùng
    
    // Chỉ hiển thị các trang gần với trang hiện tại
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';  // Kiểm tra trang hiện tại
        paginationHTML += `<button class="pagination-btn ${isActive}" onclick="changePage(${i})">${i}</button>`;
    }

    // Thêm nút Next nếu không phải trang cuối cùng
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">
            <i class="pagination-item__icon fas fa-angle-right"></i>
        </button>`;
    }

    // Thêm ô input để nhập số trang
    // paginationHTML += `
    //     <input type="number" min="1" max="${totalPages}" id="pageInput" placeholder="Chọn trang" 
    //            style="width: 50px; margin-left: 10px;" onchange="goToPageFromInput()">
    // `;
    
    paginationContainer.innerHTML = paginationHTML;
}



// Thay đổi trang khi người dùng nhấn vào nút số trang
function changePage(page) {
    currentPage = page;
    renderChamCongTable();
}

// Chuyển đến trang từ ô input
function goToPageFromInput() {
    const pageInput = document.getElementById('pageInput').value;
    const totalPages = getTotalPages();
    
    if (pageInput >= 1 && pageInput <= totalPages) {
        currentPage = parseInt(pageInput);
        renderChamCongTable();
    } else {
        alert('Số trang không hợp lệ');
    }
}

// Sự kiện chấm công vào
chamCongVaoBtn.onclick = function() {
    const time = getFormattedTime();
    saveToLocalStorage('Vào', time);
    alert('Chấm công vào thành công: ' + time);
    renderChamCongTable();
};

// Sự kiện chấm công ra
chamCongRaBtn.onclick = function() {
    const time = getFormattedTime();
    saveToLocalStorage('Ra', time);
    alert('Chấm công ra thành công: ' + time);
    renderChamCongTable();
};

// Hiển thị dữ liệu khi tải trang
document.addEventListener('DOMContentLoaded', renderChamCongTable);
