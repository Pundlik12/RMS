import { auth, db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableRef = collection(db, "Tables");

const form = document.getElementById('tableForm');
const tableList = document.getElementById('tableList').querySelector('tbody');

form.onsubmit = async (e) => 
{
    e.preventDefault();
    const name = document.getElementById('tableName').value.trim();
    const capacity = parseInt(document.getElementById('capacity').value);
    const status = document.getElementById('status').value;
    const editId = document.getElementById('editIndex').value;

    if (!name || capacity < 1) return alert("Please enter valid data.");
    
    const data = { name, capacity, status };

    try 
    {
        if (editId) 
        {
            const docRef = doc(db, "Tables", editId);
            await updateDoc(docRef, data);
        } 
        else 
        {
            await addDoc(tableRef, data);
        }
        form.reset();
        document.getElementById('editIndex').value = "";
    } 
    catch (err) 
    {
        alert("Error saving table: " + err.message);
    }
};

function renderTable() 
{
    const q = query(tableRef, orderBy("name"));
    
    onSnapshot(q, snapshot => 
    {
        tableList.innerHTML = "";
        snapshot.forEach((docSnap, i) => 
        {
            const t = docSnap.data();
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${i + 1}</td>
            <td>${t.name}</td>
            <td>${t.capacity}</td>
            <td>${t.status}</td>
            <td class="actions">
                <button onclick="editTable('${docSnap.id}', '${t.name}', ${t.capacity}, '${t.status}')">✏️</button>
                <button onclick="deleteTable('${docSnap.id}')">🗑️</button>
            </td>
            `;
            tableList.appendChild(row);
        });
    });
}

window.editTable = (id, name, capacity, status) => 
{
    document.getElementById('tableName').value = name;
    document.getElementById('capacity').value = capacity;
    document.getElementById('status').value = status;
    document.getElementById('editIndex').value = id;
};

window.deleteTable = async (id) => 
{
    if (confirm("Delete this table?")) 
    {
        try 
        {
            await deleteDoc(doc(db, "Tables", id));
        } 
        catch (err) 
        {
            alert("Error deleting table: " + err.message);
        }
    }
};

renderTable();