import Cards from '../components/Cards'
import Header from '../components/Header'
import { useEffect, useState } from 'react';

import AddExpense from '../components/Models/AddExpense';
import AddIncome from '../components/Models/AddIncome';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db,auth} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import TransactionsTables from '../components/TransactionsTables';
import Charts from '../components/Charts'

const Dashboard = () => {
  const [user]=useAuthState(auth);

  const [isExpenseModalVisible,setIsExpensiveModalVisible]=useState(false);
  const [isIncomeModalVisible,setIsIncomeModelVisible]=useState(false);
  const [loading,setLoading]=useState(false);
  const [transaction,setTransaction]=useState([]);
  const [income,setIncome]=useState(0);
  const [expense,setExpense]=useState(0);
  const [totalBalance,setTotalBalance]=useState(0);

  const showExpenseModal=()=>{
    setIsExpensiveModalVisible(true)
  };
  const showIncomeModal=()=>{
    setIsIncomeModelVisible(true);
  }
  const handleExpensiveCancel=()=>{
    setIsExpensiveModalVisible(false);
  };

  const handleIncomeCancel=()=>{
    setIsIncomeModelVisible(false);
  };

const onFinish=(values,type)=>{
  console.log("onfinish",values,type);
  const newTransaction={
    type:type,
    date:values.date.format("YYYY-MM-DD"),
    amount:parseFloat(values.amount),
    tag:values.tag,
    name:values.name

  };
  addTransaction(newTransaction);


}

async function addTransaction(newTransaction) {
  try {
    const docRef = await addDoc(
      collection(db, `users/${user.uid}/transactions`),
      newTransaction
    );

    console.log("document written with Id:", docRef.id);

    toast.success("Transaction Added");

    fetchTransactions(); // ✅ best approach

  } catch (e) {
    console.error("error loading document", e);
    toast.error("couldn't add transaction");
  }
}


useEffect(() => {
  if (user) {
    fetchTransactions();
  }
}, [user]);




async function fetchTransactions() {
  setLoading(true);

  try {
    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/transactions`)
      );

      const querySnapshot = await getDocs(q);

      let transactionsArray = [];

      querySnapshot.forEach((doc) => {
        transactionsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setTransaction(transactionsArray);
      toast.success("Transactions fetched");
    }
  } catch (e) {
    console.error(e);
    toast.error("Failed to fetch transactions");
  }

  setLoading(false);
}

useEffect(()=>{
  calculateBalance();
},[transaction]);





function calculateBalance()
{
  let incomeTotal=0;
  let expensesTotal=0;

  transaction.forEach((transaction)=>{
    if(transaction.type==="income"){
      incomeTotal+=transaction.amount;
    }else{
      expensesTotal+=transaction.amount;
    }
  });
  setIncome(incomeTotal);
  setExpense(expensesTotal);
  setTotalBalance(incomeTotal-expensesTotal);

}
let sortedTransaction=transaction.sort((a,b)=>{
  return new Date(a.date)-new Date(b.date);
})

  return (
  loading ? (
    <p>loading</p>
  ) : (
    <>
      <div>
        <Header />

        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
        {transaction&&transaction.length!=0?<Charts sortedTransaction={sortedTransaction}></Charts>:<h2>No Transactions</h2>}

        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />

        <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpensiveCancel={handleExpensiveCancel}
          onFinish={onFinish}
        />
        <TransactionsTables transactions={transaction} addTransaction={addTransaction} fetchTransactions={fetchTransactions}></TransactionsTables>
      </div>
    </>
  )
)
}
export default Dashboard
