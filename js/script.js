
//-----------------------------------------------------------------------------------------------------------------
// render ra giao giện chính
let arr_drink = []; // Đặt biến arr_drink bên ngoài fetch
fetch('http://localhost:3000/do-uong')
    .then(response => response.json())
    .then(data => {
        // Xử lý dữ liệu
        arr_drink = data.map(drink => ({
            id: drink.IDDoUong, // Sửa từ IDDoUong sang id
            name: drink.Ten, // Sửa từ Ten sang name
            price: drink.Gia, // Sửa từ Gia sang price
            size: drink.Size, // Sửa từ Size sang size
            type: drink.Loai, // Sửa từ Loai sang type
            url: drink.ImageURL // Sửa từ ImageURL sang url
        }));

        // Gọi hàm hiển thị đồ uống sau khi arr_drink đã có dữ liệu
        console.log(arr_drink)
        displayDrinks(arr_drink, document.querySelector('.home-product__drink .grid__row'));
        displayDrinks(filterDrinksByType(arr_drink, "Cà phê"), document.querySelector('.home-product__drink-coffee .grid__row'))
        console.log(filterDrinksByType(arr_drink, "Cà phê"))
        displayDrinks(filterDrinksByType(arr_drink, "Trà"), document.querySelector('.home-product__drink-tra .grid__row'))
        console.log(filterDrinksByType(arr_drink, "Trà"))
        displayDrinks(filterDrinksByType(arr_drink, "Sinh tố"), document.querySelector('.home-product__drink-sinhto .grid__row'))
        displayDrinks(filterDrinksByType(arr_drink, "Nước ép"), document.querySelector('.home-product__drink-nuocep .grid__row'))
        displayDrinks(filterDrinksByType(arr_drink, "Đá xay"), document.querySelector('.home-product__drink-daxay .grid__row'))
    })
    .catch(error => console.error("Error fetching data:", error));



// Tạo bản sao chỉ chứa các phần tử có type yêu cầu
function filterDrinksByType(arr_drink, type) {
    return arr_drink.filter(drink => drink.type === type);
}
// Hàm hiển thị đồ uống
function displayDrinks(arr_drink, address) {
    address.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới

    for (let drink of arr_drink) {
        address.innerHTML += `
            <div class="grid__column-9-3">
                <div class="home-product-item">
                    <div style="padding-top: 10px;"></div>
                    <div class="home-product-item__img" style="background-image: url(${drink.url});"></div>
                    <div class="home-product-item__info">
                        <h4 class="home-product-item__name">${drink.name}</h4>
                        <div class="home-product-item__price">${drink.price}đ</div>
                    </div>
                    <button class="btn home-product-item__btn btn-active" onclick="addToCart('${drink.id}', '${drink.name}', '${drink.type}', '${drink.price}', '${drink.url}')">Thêm vào giỏ hàng</button>
                </div>
            </div>`;
    }
}

//


// ẩn đi phần giao diện của menu
function showHideMenu (btn, block){
    btn.addEventListener('click', function() {
        block.classList.toggle('displaynone')
    })
}
showHideMenu(document.querySelector('.home-product__drink .home-product-label'), document.querySelector('.home-product__drink .grid__row'))
showHideMenu(document.querySelector('.home-product__drink-coffee .home-product-label'), document.querySelector('.home-product__drink-coffee .grid__row'))
showHideMenu(document.querySelector('.home-product__drink-tra .home-product-label'), document.querySelector('.home-product__drink-tra .grid__row'))
showHideMenu(document.querySelector('.home-product__drink-sinhto .home-product-label'), document.querySelector('.home-product__drink-sinhto .grid__row'))
showHideMenu(document.querySelector('.home-product__drink-nuocep .home-product-label'), document.querySelector('.home-product__drink-nuocep .grid__row'))
showHideMenu(document.querySelector('.home-product__drink-daxay .home-product-label'), document.querySelector('.home-product__drink-daxay .grid__row'))

//-----------------------------------------------------------------------------------------------------------------
// render ra giỏ hàng
var cart_list_item = document.querySelector('.cart-list-item')
var current_cart = []
function addToCart(id, name, type, price, url) {
    id = id.trim()
    if (!current_cart.includes(id)) {
        cart_list_item.innerHTML += `   <li class="cart-item cart-${id}-item-remove">
                                            <img src="${url}" alt="" class="cart-img">
                                            <div class="cart-item-info">
                                                <div class="cart-item-head">
                                                    <h5 class="cart-item-id cart-item-${id}-id" style="display: none;">${id}</h5>
                                                    <h5 class="cart-item-name cart-item-${id}-name">${name} </h5>
                                                    <div class="cart-item-price-wrap">
                                                        <span class="cart-item-price item-${id}-price">${price}đ</span>
                                                        <span class="cart-item-multify">x</span>

                                                        <span class="cart-item-qnt-wrap">
                                                            <span class="cart-item-qnt item-${id}-qnt">1</span>
                                                            <span class="cart-item-qnt-adj">
                                                                <span class="cart-item-qnt-plus cart-item-${id}-qnt-plus" onclick="changeItemCartQnt('${id}', 1)">+</span>
                                                                <span class="cart-item-qnt-minus cart-item-${id}-qnt-minus" onclick="changeItemCartQnt('${id}', -1)"">-</span>
                                                            </span>
                                                        </span>
                                                        
                                                        
                                                        </div>
                                                </div>
    
                                                <div class="cart-item-body">
                                                    <span class="cart-item-description">
                                                        Phân loại: ${type}
                                                    </span>
                                                    <span class="cart-item-remove cart-item-${id}-remove" onclick="removeFromCart('${id}')">Xóa</span>
                                                </div>
                                            </div>
                                        </li>`
    current_cart.push(id)   
    }
    else {
        var item_id_qnt = document.querySelector(`.item-${id}-qnt`).innerHTML
        document.querySelector(`.item-${id}-qnt`).innerHTML = Number(item_id_qnt) + 1
    }          
    total_cart_money()
}

// xóa đồ uống khỏi giỏ hàng
function removeFromCart(id) {
    // Tìm thẻ <li> có class chứa id
    const itemToRemove = document.querySelector(`.cart-${id}-item-remove`);
    current_cart = current_cart.filter(value => value != id)
    // Kiểm tra xem phần tử có tồn tại không
    if (itemToRemove) {
        itemToRemove.remove(); // Xóa thẻ <li> khỏi DOM
    }
    total_cart_money();
}

// thay đôi số lượng sản phẩm trong giỏ 
function changeItemCartQnt(id, qnt) {
    var quantityElement = document.querySelector(`.item-${id}-qnt`);
    var currentQuantity = Number(quantityElement.innerHTML);
    var newQuantity = currentQuantity + qnt;
    if (newQuantity > 0) {
        quantityElement.innerHTML = newQuantity; // Cập nhật số lượng hiển thị
    }
    else if (newQuantity == 0){
        removeFromCart(id)
    }
    total_cart_money();
    
}

// cập nhật tổng tiền của giỏ hàng 
var cart_total_number = document.querySelector('.cart-total-number')
function total_cart_money() {
    let sum = 0
    if (!current_cart) 
        cart_total_number.innerHTML = 0 + ' đ' 
    else {
        for (let item of current_cart) {
            var item_id_qnt = document.querySelector(`.item-${item}-qnt`).innerHTML
            var item_id_price = document.querySelector(`.item-${item}-price`).innerHTML
            item_id_price = item_id_price.slice(0, -1)
            sum += item_id_qnt * item_id_price
        }
        cart_total_number.innerHTML = sum + 'đ' 
    }
    return sum;
}

//----------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------
// render ra bill
// Hàm hiển thị hóa đơn
function displayBill(arr_drink) {
    if (arr_drink.length == 0) {
        alert('Giỏ hàng đang trống');
        return;
    }
    // IDhóa đơn
    var idHoaDon;
    fetch('http://localhost:3000/maxid-hoa-don')
        .then(response => response.json())
        .then(data => {
            // Lấy giá trị `GiaTriLonNhat` từ mảng và đối tượng đầu tiên
            let maxId = data[0]?.GiaTriLonNhat?.trim();
            
            if (maxId) {
                // Thực hiện cắt chuỗi và chuyển đổi như bạn mong muốn
                idHoaDon = maxId.slice(0, 2) + String(Number(maxId.slice(2)) + 1);
                document.querySelector('.auth-form__body_id-value').innerHTML = idHoaDon;
            } else {
                console.error("No max ID found.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
    

    // Giờ lập
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    // console.log(now.toLocaleString('vi-VN')); // Kết quả: "dd/mm/yyyy hh:mm:ss"
    // document.querySelector('.auth-form__body_time-value').innerHTML = now.toLocaleString('vi-VN')
    document.querySelector('.auth-form__body_time-value').innerHTML =  vietnamTime.toISOString().slice(0, 19).replace('T', ' ');
    // nhân viên lập
    let name = document.querySelector('.header__navbar-user-name')
    let idnv = document.querySelector('.header__navbar-user-id')
    if (!name){
        alert("Bạn chưa đăng nhập");
        return;
    }
    document.querySelector('.auth-form__body_name-value').innerHTML = (name.innerHTML +  " - " + idnv.innerHTML)// Nhân viên lập

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

    for (let id of arr_drink) {
        let qnt = parseInt(document.querySelector(`.item-${id}-qnt`).innerHTML);
        let value = document.querySelector(`.item-${id}-price`).innerHTML;
        
        // Loại bỏ ký tự "đ" cuối để chuyển thành số nguyên
        value = parseInt(value.slice(0, -1));
        
        // Tạo hàng mới và chèn các giá trị tương ứng
        const row = bill__list_drink.insertRow(-1);
        row.insertCell(0).innerHTML = document.querySelector(`.cart-item-${id}-id`).innerHTML; // Tên đồ uống
        row.insertCell(1).innerHTML = document.querySelector(`.cart-item-${id}-name`).innerHTML; // Tên đồ uống
        row.insertCell(2).innerHTML = qnt; // Số lượng
        row.insertCell(3).innerHTML = `${value}đ`; // Đơn giá
        row.insertCell(4).innerHTML = `${qnt * value}đ`; // Thành tiền
    }
    document.querySelector('.bill__list-totalmoney').innerHTML = total_cart_money() + 'đ';


    const inputMoney = document.querySelector('.paymethod-bycash-input');
    
    inputMoney.addEventListener('blur', function() {
        document.querySelector('.paymethod-bycash-output').innerHTML = Number(inputMoney.value) - total_cart_money() + 'đ';
    });

    document.querySelector('.btn-bill-print').onclick = function() {
        // Lấy giá trị ngày và chuyển đổi thành định dạng ISO

        fetch('http://localhost:3000/hoa-don', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idhd: document.querySelector('.auth-form__body_id-value').innerHTML,
                date:document.querySelector('.auth-form__body_time-value').innerHTML,
                idnv: document.querySelector('.header__navbar-user-id').innerHTML,
                tongtien: total_cart_money(),
            })
        });


        const tbody = document.querySelector(".bill__list-drink tbody");
        const rows = tbody.rows; // Lấy tất cả các <tr> trong <tbody>
        
        for (let i = 1; i < rows.length; i++) {
            let idhd = document.querySelector('.auth-form__body_id-value');
            let iddu = rows[i].cells[0];
            let qnt = rows[i].cells[2];
            console.log(`Row ${i + 1}:`, idhd.innerHTML, iddu.innerHTML, qnt.innerHTML);
            
            fetch('http://localhost:3000/hoa-don-co-do-uong', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idhd: idhd.innerHTML,
                    iddu:iddu.innerHTML,
                    qnt: qnt.innerHTML,
                })
            });
        }
        window.location.reload()
    }

    modal_bill.style.display = 'flex';
}



//-----------------------------------------------------------------------------------------------------------------
// Hiển thị modal đăng nhập
var btn_login = document.querySelector('.header__user-login__btn');
var modal_login = document.querySelector('.modal-login');

btn_login.onclick = function() {
    modal_login.style.display = 'flex';
};

function hideLoginModal() {
    modal_login.style.display = 'none';
}

var modal_login_container = document.querySelector('.modal-login');
var modal_login_body = document.querySelector('.modal-login .modal__body');

modal_login_container.addEventListener('click', hideLoginModal);

modal_login_body.addEventListener('click', function(event) {
    event.stopPropagation();
});

var modal_login_btn_back = document.querySelector('.auth-form__control-back');
modal_login_btn_back.onclick = hideLoginModal;

// -----------------------------------------------------------------------------------------------------------------
// Hiển thị modal thanh toán
var btn_paybill = document.querySelector('.cart-total-pay');
var modal_bill = document.querySelector('.modal-bill');

btn_paybill.onclick = function() {
    displayBill(current_cart)
};


function hideBillModal() {
    modal_bill.style.display = 'none';
}

var modal_bill_container = document.querySelector('.modal-bill');
var modal_bill_body = document.querySelector('.modal-bill .modal__body');

modal_bill_container.addEventListener('click', hideBillModal);

modal_bill_body.addEventListener('click', function(event) {
    event.stopPropagation();
});


//-----------------------------------------------------------------------------------------------------------------

// Xem thêm
var more__btn_drink = document.querySelector('.home-product-more__btn-drink')
more__btn_drink.onclick = function(){
    window.location.href = "/menu.html"
} 
//-----------------------------------------------------------------------------------------------------------------

