import { auth, db } from './firebase.js';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Get tableId from URL (e.g. ?tableId=abc123)
const urlParams = new URLSearchParams(window.location.search);

const tableId = urlParams.get("tableId");

if (!tableId) alert("Missing tableId in URL");

const orderRef = collection(db, "Tables", tableId, "Orders");
const form = document.getElementById("itemForm");
const orderList = document.getElementById("orderList");

form.onsubmit = async (e) => 
{
    e.preventDefault();
    const name = document.getElementById("itemName").value.trim();
    const qty = parseInt(document.getElementById("qty").value);
    const price = parseFloat(document.getElementById("price").value);

    if (!name || qty <= 0 || price <= 0) return alert("Enter valid item details.");
    try 
    {
        await addDoc(orderRef, { name, qty, price });
        form.reset();
    } 
    catch (err) 
    {
        alert("Error adding item: " + err.message);
    }
};

function renderOrders() 
{
    const q = query(orderRef, orderBy("name"));
    
    onSnapshot(q, snapshot => 
    {
        orderList.innerHTML = "";
        snapshot.forEach(docSnap => 
        {
            const item = docSnap.data();
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${(item.qty * item.price).toFixed(2)}</td>
            <td><button onclick="removeItem('${docSnap.id}')">❌</button></td>
            `;
            orderList.appendChild(row);
        });
    });
}

window.removeItem = async (id) => {
    if (confirm("Remove this item?")) 
    {
        try 
        {
            await deleteDoc(doc(db, "Tables", tableId, "orders", id));
        } 
        catch (err) 
        {
            alert("Error removing item: " + err.message);
        }
    }
};

renderOrders();
