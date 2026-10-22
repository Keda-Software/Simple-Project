const form = document.getElementById("shopping-form");
    const receiptItems = document.getElementById("receipt-items");
    const grandTotalElement = document.getElementById("grand-total");

    let grandTotal = 0;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // 1. Get data from input fields
        const customerName = document.getElementById("customerName").value.trim();
        const productName = document.getElementById("productName").value.trim();
        const price = Number(document.getElementById("price").value);
        const quantity = Number(document.getElementById("quantity").value);

        // 2. Calculate the product total
        const total = price * quantity;

        // 3. Create a new table row
        const row = document.createElement("tr");

        // 4. Add data to the row
        const values = [
            customerName,
            productName,
            price.toFixed(2),
            quantity,
            total.toFixed(2)
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // 5. Insert the row into the table
        receiptItems.appendChild(row);

        // 6. Update the grand total
        grandTotal += total;
        grandTotalElement.textContent = grandTotal.toFixed(2);

        // 7. Clear product fields for the next item
        document.getElementById("productName").value = "";
        document.getElementById("price").value = "";
        document.getElementById("quantity").value = "";

        document.getElementById("productName").focus();
    });