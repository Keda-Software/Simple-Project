    // const form = document.getElementById("shopping-form");
    // const receiptItems = document.getElementById("receipt-items");
    // const grandTotalElement = document.getElementById("grand-total");

    // let grandTotal = 0;

    // form.addEventListener("submit", function(event) {
    //     event.preventDefault();

    //     // 1. Get data from input fields
    //     const customerName = document.getElementById("customerName").value.trim();
    //     const productName = document.getElementById("productName").value.trim();
    //     const price = Number(document.getElementById("price").value);
    //     const quantity = Number(document.getElementById("quantity").value);

    //     // 2. Calculate the product total
    //     const total = price * quantity;

    //     // 3. Create a new table row
    //     const row = document.createElement("tr");

    //     // 4. Add data to the row
    //     const values = [
    //         customerName,
    //         productName,
    //         price.toFixed(2),
    //         quantity,
    //         total.toFixed(2)
    //     ];

    //     values.forEach(function(value) {
    //         const cell = document.createElement("td");
    //         cell.textContent = value;
    //         row.appendChild(cell);
    //     });

    //     // 5. Insert the row into the table
    //     receiptItems.appendChild(row);

    //     // 6. Update the grand total
    //     grandTotal += total;
    //     grandTotalElement.textContent = grandTotal.toFixed(2);

    //     // 7. Clear product fields for the next item
    //     document.getElementById("productName").value = "";
    //     document.getElementById("price").value = "";
    //     document.getElementById("quantity").value = "";

    //     document.getElementById("productName").focus();
    // });

    
const form = document.getElementById("shopping-form");
const receiptItems = document.getElementById("receipt-items");
const grandTotalElement = document.getElementById("grand-total");

// Load saved items from localStorage
let items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

// Save items to localStorage
function saveItems() {
    localStorage.setItem("shoppingItems", JSON.stringify(items));
}

// Display all items in the table
function displayItems() {
    receiptItems.innerHTML = "";

    let grandTotal = 0;

    items.forEach(function(item) {
        const row = document.createElement("tr");

        const values = [
            item.customerName,
            item.productName,
            item.price.toFixed(2),
            item.quantity,
            (item.price * item.quantity).toFixed(2)
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Create Delete button
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.style.backgroundColor = "#dc2626";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "8px 12px";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.cursor = "pointer";

        deleteButton.addEventListener("click", function() {
            deleteItem(item.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        receiptItems.appendChild(row);

        grandTotal += item.price * item.quantity;
    });

    grandTotalElement.textContent = grandTotal.toFixed(2);
}

// Add a new item
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const customerName =
        document.getElementById("customerName").value.trim();

    const productName =
        document.getElementById("productName").value.trim();

    const price =
        Number(document.getElementById("price").value);

    const quantity =
        Number(document.getElementById("quantity").value);

    if (
        !customerName ||
        !productName ||
        document.getElementById("price").value === "" ||
        document.getElementById("quantity").value === "" ||
        !Number.isFinite(price) ||
        !Number.isInteger(quantity) ||
        price < 0 ||
        quantity < 1
    ) {
        alert("Please enter valid product details.");
        return;
    }

    const newItem = {
        id: Date.now() + Math.random(),
        customerName: customerName,
        productName: productName,
        price: price,
        quantity: quantity
    };

    items.push(newItem);

    saveItems();
    displayItems();

    // Clear product fields for the next item
    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("productName").focus();
});

// Delete one item
function deleteItem(id) {
    items = items.filter(function(item) {
        return item.id !== id;
    });

    saveItems();
    displayItems();
}

// Show saved items when the page loads or refreshes
displayItems();
