import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc} from "firebase/firestore"
import { db } from './firebase'

function GroceryList({ familyGroupID }) {
    const [itemName, setItemName] = useState('')
    const [items, setItems] = useState([])
    const [editingItemID, setEditingItemID] = useState(null)
    const [editedItemName, setEditedItemName] = useState('')

    function refreshItems() {
        const itemsQuery = query(
            collection(db, "groceryItems"),
            where("familyGroupID", "==", familyGroupID)
        )
        getDocs(itemsQuery).then((querySnapshot) => {
            const itemsList = []
            querySnapshot.forEach((itemDoc) => {
                itemsList.push({ id: itemDoc.id, ...itemDoc.data() })
            })
            setItems(itemsList)
        })
    }

    useEffect(() => {
        if (familyGroupID) {
            refreshItems()
        }
    }, [familyGroupID])

    function handleAddItem(e) {
        e.preventDefault()
        if (itemName === '') {
            console.log("Item name empty")
            return
        }
        addDoc(collection(db, "groceryItems"), {
            name: itemName,
            isPurchased: false,
            familyGroupID: familyGroupID
        })
        .then(() => {
            setItemName('')
            refreshItems()
        })
        .catch((error) => console.log("Add item error", error.message))
    }

    function handleDeleteItem(itemID) {
        deleteDoc(doc(db, "groceryItems", itemID))
        .then(() => {
            console.log("Item Deleted:", itemID) 
            refreshItems()
        })
        .catch((error) => console.log("Delete error:", error.message))
    }

    
    function handleCancelEdit() {
        setEditingItemID(null)
        setEditedItemName('')
    }

    function handleEdit(item) {
        setEditingItemID(item.id)
        setEditedItemName(item.name) 
    }

    function handleSaveEdit(itemID) {
        if (editedItemName === '') {
            console.log("Name cannot be empty")
            return
        }

        updateDoc(doc(db, "groceryItems", itemID), {
            name: editedItemName
        })
        .then(() => {
            setEditingItemID(null)
            setEditedItemName('')
            refreshItems()
        })
        .catch((error) => console.log("Edit error:", error.message))
    }

    function handleToggleBought(item) {
        updateDoc(doc(db, "groceryItems", item.id), {
            isPurchased: !item.isPurchased
        })
        .then(() => refreshItems())
        .catch((error) => console.log("Toggle error:", error.message))
    }

    return (
        <div>
            <h2>Grocery List</h2>
                        
                <form onSubmit={handleAddItem}>
                            <input
                                type="text"
                                placeholder="enter item"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                            <button type="submit">Add</button>
                </form>
                                <div>
                    <h3>Still needed</h3>
                    {items.filter(item => !item.isPurchased).map(item => (
                        <div key={item.id}>
                            {editingItemID === item.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editedItemName}
                                        onChange={(e) => setEditedItemName(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveEdit(item.id)}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="checkbox"
                                        checked={item.isPurchased}
                                        onChange={() => handleToggleBought(item)}
                                    />
                                    <span>{item.name}</span>
                                    <button onClick={() => handleStartEdit(item)}>Edit</button>
                                    <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    <h3>Already bought</h3>
                    {items.filter(item => item.isPurchased).map(item => (
                        <div key={item.id}>
                            <input
                                type="checkbox"
                                checked={item.isPurchased}
                                onChange={() => handleToggleBought(item)}
                            />
                            <span style={{ textDecoration: 'line-through' }}>{item.name}</span>
                            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </div>
                    ))}
                </div>
        </div>
)}

export default GroceryList