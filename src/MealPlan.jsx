import { useEffect, useState } from "react"
import { collection, addDoc, query, where, deleteDoc, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore"
import { db } from './firebase'


function MealPlan({ familyGroupID }){
    const [mealName, setMealName] = useState('')
    const [selectedDay, setSelectedDay] = useState('Monday')
    const [meals, setMeals] = useState([])
    const [editingMealId, setEditingMealId] = useState(null)
    const [editedName, setEditedName] = useState('')
    const [familyMembers, setFamilyMembers] = useState([])
    const [selectedCook, setSelectedCook] = useState('')

    useEffect(() => {
        if (familyGroupID) {
            getDoc(doc(db, "families", familyGroupID))
            .then((familyDoc) => {
                if (familyDoc.exists()) {
                    const memberIDs = familyDoc.data().memberIDs
                    const promises = memberIDs.map(uid => getDoc(doc(db, "users", uid)))
                    return Promise.all(promises)
                }
            })
            .then((userDocs) => {
                const members = userDocs.map(d => ({
                    uid: d.id,
                    fullName: d.data().fullName
                }))
                setFamilyMembers(members)
            })
            .catch((error) => console.log("Error fetching members:", error.message))
        }
    }, [familyGroupID])

  

    useEffect(() => {
        if (familyGroupID) {
            const mealsQuery = query(
                collection(db, "meals"),
                where("familyGroupID", "==", familyGroupID)
            )
            
            const unsubscribe = onSnapshot(mealsQuery, (querySnapshot) => {
                const mealsList = []
                querySnapshot.forEach((mealDoc) => {
                    mealsList.push({ id: mealDoc.id, ...mealDoc.data()})
                })
                setMeals(mealsList)
            })
            return () => unsubscribe()
        }
    }, [familyGroupID])

    function handleAddMeal(e) {
        e.preventDefault()
        if (mealName === '') {
            console.log("Meal name empty")
            return
        }

        if (selectedCook ==='') {
        console.log("Please pick a cook")
        return
        }

        addDoc(collection(db, "meals"), {
            name: mealName,
            dayOfWeek: selectedDay,
            familyGroupID: familyGroupID,
            assignedCook: selectedCook
        })
        .then(() => {
            console.log("Meal added:", mealName, "on", selectedDay)
            setMealName('')
            refreshMeals()
            setSelectedCook('')
        })
        .catch((error) => console.log("Add meal error:", error.message))
    }

    function handlerDeleteMeal(mealId) {
        deleteDoc(doc(db, "meals", mealId))
        .then(() => {
            console.log("Meal Deleted:", mealId) 
            refreshMeals()
        })
        .catch((error) => console.log("Delete error:", error.message))
    }

    function refreshMeals() {
        const mealsQuery = query(
            collection(db, "meals"),
            where("familyGroupID", "==", familyGroupID)
        )
        getDocs(mealsQuery).then((querySnapshot) => {
            const mealList = []
            querySnapshot.forEach((mealDoc) => {
                mealList.push({ id: mealDoc.id, ...mealDoc.data() })
            })
            setMeals(mealList)
        })
    }

    function handleCanceledit() {
        setEditingMealId(null)
        setEditedName('')
    }

    function handleEdit(meal) {
        setEditingMealId(meal.id)
    }

    function handleSaveEdit(mealId) {
        if (editedName === '') {
            console.log("Name cannot be empty")
            return
        }

        updateDoc(doc(db, "meals", mealId), {
            name: editedName
        })
        .then(() => {
            console.log("Meal updated:", mealId)
            setEditingMealId(null) 
            setEditedName('')
            refreshMeals()
        })
    }

    return (
    <div>
        <form onSubmit={handleAddMeal}>
            <input
                type='text'
                placeholder="Meal name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
            />
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>

            <select value={selectedCook} onChange={(e) => setSelectedCook(e.target.value)}>
                <option value="">-- Who is cooking? --</option>
                {familyMembers.map(m =>(
                    <option key={m.uid} value={m.fullName}>{m.fullName}</option>
                ))}
            </select>

            <button type="submit">Add Meal</button>
        </form>
        <h2>Weekly Meal Plan</h2>
        
        <div>
            <h3>Monday</h3>
            {meals.filter(m => m.dayOfWeek === "Monday").map(m => (
                <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span> 
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>
        
        <div>
            <h3>Tuesday</h3>
            {meals.filter(m => m.dayOfWeek === "Tuesday").map(m => (
                  <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span> 
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>

        <div>
            <h3>Wednesday</h3>
            {meals.filter(m => m.dayOfWeek === "Wednesday").map(m => (
                  <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span>  
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>

        <div>
            <h3>Thursday</h3>
            {meals.filter(m => m.dayOfWeek === "Thursday").map(m => (
               <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span>  
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>

        <div>
            <h3>Friday</h3>
            {meals.filter(m => m.dayOfWeek === "Friday").map(m => (
                <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span> 
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>

        <div>
            <h3>Saturday</h3>
            {meals.filter(m => m.dayOfWeek === "Saturday").map(m => (
               <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span> 
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>

        <div>
            <h3>Sunday</h3>
            {meals.filter(m => m.dayOfWeek === "Sunday").map(m => (
                  <div key={m.id}>
                    {editingMealId === m.id ? (
                        <>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleSaveEdit(m.id)}>Save</button>
                            <button onClick={handleCanceledit}>Cancel</button>
                        </>
                    ) : (
                        <>
                           <span>{m.name} - {m.assignedCook} cooks</span> 
                           <button onClick={() => handleEdit(m)}>Edit</button>
                           <button onClick={() => handlerDeleteMeal(m.id)}>Delete</button>
                        </>
                    )}
                      
                    
                </div>
            ))}
        </div>
        <p>Family members: {familyMembers.map(m => m.fullName).join(", ")}</p>
    </div>
    )
    
}
export default MealPlan
