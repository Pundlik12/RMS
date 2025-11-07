import { auth, db } from './firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const itemRef = collection(db, "Items");

const form = document.getElementById('itemForm');
const itemList = document.getElementById('itemList').querySelector('tbody');

form.onsubmit = async (e) => 
{
  e.preventDefault();
  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('category').value;
  const price = parseFloat(document.getElementById('price').value);
  const available = document.getElementById('available').checked;
  const editId = document.getElementById('editIndex').value;

  if (!name || !category || price <= 0) return alert("Please enter valid item details.");
  const data = { name, category, price, available };

  try 
  {
	if (editId) 
	{
	  const docRef = doc(db, "Items", editId);
	  await updateDoc(docRef, data);
	} 
	else 
	{
	  await addDoc(itemRef, data);
	}
	form.reset();
	document.getElementById('editIndex').value = "";
  }
  catch (err) 
  {
	alert("Error saving item: " + err.message);
  }
};

function renderItems() 
{
  const q = query(itemRef, orderBy("name"));
  
  onSnapshot(q, snapshot => {
	itemList.innerHTML = "";
	snapshot.forEach((docSnap, i) => {
	  const item = docSnap.data();
	  const row = document.createElement('tr');
	  row.innerHTML = `
		<td>${i + 1}</td>
		<td>${item.name}</td>
		<td>${item.category}</td>
		<td>₹${item.price.toFixed(2)}</td>
		<td>${item.available ? "✅" : "❌"}</td>
		<td class="actions">
		  <button onclick="editItem('${docSnap.id}', '${item.name}', '${item.category}', ${item.price}, ${item.available})">✏️</button>
		  <button onclick="deleteItem('${docSnap.id}')">🗑️</button>
		</td>
	  `;
	  itemList.appendChild(row);
	});
  });
}

window.editItem = (id, name, category, price, available) => 
{
  document.getElementById('itemName').value = name;
  document.getElementById('category').value = category;
  document.getElementById('price').value = price;
  document.getElementById('available').checked = available;
  document.getElementById('editIndex').value = id;
};

window.deleteItem = async (id) => 
{
  if (confirm("Delete this item?")) 
  {
	try 
	{
	  await deleteDoc(doc(db, "Items", id));
	} 
	catch (err) 
	{
	  alert("Error deleting item: " + err.message);
	}
  }
};

renderItems();