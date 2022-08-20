import axios from 'axios'

 const dataBaseUrl = 'https://course-practice-9760e-default-rtdb.firebaseio.com/'

 export function BackendExpense (expenses) {
    axios.post(dataBaseUrl + 'expenses.js', expenses)   
}