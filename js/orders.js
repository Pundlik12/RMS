import { auth, db } from './firebase.js';
import { collection, doc, updateDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableRef = collection(db, "Tables");

const tableList = document.getElementById('tableList');

function renderTables() 
{
    const q = query(tableRef, orderBy("name"));
    onSnapshot(q, snapshot => 
    {
        tableList.innerHTML = "";
        
        snapshot.forEach(docSnap => 
        {
            const t = docSnap.data();
            const card = document.createElement('div');
            card.className = "table-card";
            card.innerHTML = `
            <h3>${t.name}</h3>
            <p>Status: <strong>${t.status}</strong></p>
            <button onclick="addItems('${docSnap.id}')">➕ Add Items</button>
            <button onclick="generateBill('${docSnap.id}')">💳 Generate Bill</button>`;
            tableList.appendChild(card);
        });
    });
}

window.addItems = (id) => 
{
    alert("Add Items logic for table ID: " + id);
    window.location.href = `add_items.html?tableId=${id}`;
    // You can redirect or open a modal here
};

window.generateBill = async (id) => 
{
    if (confirm("Generate bill and reset table status?")) 
    {
        try 
        {
            const docRef = doc(db, "Tables", id);
            await updateDoc(docRef, { status: "Available" });
            alert("Bill generated. Table status reset.");
        } 
        catch (err) 
        {
            alert("Error updating table: " + err.message);
        }
    }
};

renderTables();
